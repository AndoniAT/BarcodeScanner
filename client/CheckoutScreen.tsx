import { useStripe } from "@stripe/stripe-react-native";
import Constants from "expo-constants";
import React, { useEffect, useState } from "react";
import { Alert, Text, Button, SafeAreaView, View, StyleSheet, Dimensions, TouchableOpacity, ScrollView } from "react-native";
import { Camera } from 'expo-camera';
import { BarCodeScanner } from 'expo-barcode-scanner';
import axios from 'axios';
import { SwipeListView } from  'react-native-swipe-list-view';
const screenHeight = Dimensions.get('window').height;
import * as SQLite from "expo-sqlite";

function openDatabase() {
  if (Platform.OS === "web") {
    return {
      transaction: () => {
        return {
          executeSql: () => {},
        };
      },
    };
  }

  const db = SQLite.openDatabase("db.db");
  return db;
}

const db = openDatabase();

const sortArr = ( arr ) => {
    return arr.sort( (a, b) => {
        if(a.name < b.name) return -1;
        if(a.name > b.name) return 1;
        else return 0;
    });
}

export async function saveItemInCart(id, itemsValues, fn, apiUrl) {
    return new Promise((resolve, reject) => {
        fetch(`${apiUrl}/items/${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            }).then( r => {
                return r.json();
            }).then( element => {
                    console.log('element'); console.log(element);
                    // L'element existe, on peut continuer
                    if(element.message || element.detail) {
                        alert("Element invalide");
                        reject();
                        return;
                    }
                    db.transaction( tx => {
                            tx.executeSql(
                                `select * from panier WHERE id_item = ?;`, [id],
                                (txObj, resultSet) =>  {
                                    let res = resultSet.rows._array;
                                    // Si l'element l'item n'a pas été ajouté, l'inserer dans la base de données
                                    if( res.length == 0 ) {
                                        txObj.executeSql( 'insert into panier (id_item, amount) values (?, 1)', [id],
                                        (txObj2, resultSet2) => {
                                            let items = [...itemsValues];
                                            element.amount = 1;
                                            items.push( element );
                                            items = sortArr(items);
                                            fn(items);
                                            resolve();
                                        },
                                        (txObj2, err ) => console.log( err )
                                        )
                                    } else {
                                        // sinon, le modifier
                                            txObj.executeSql( 'update panier SET amount = amount + 1 where id_item = ?;', [id],
                                                (txObj2, resultSet2) => {
                                                    let items = [...itemsValues];
                                                    let item = items.filter( items => items.id == id )[0]
                                                    let idx = items.indexOf(item);
                                                    items[idx].amount++;
                                                    items = sortArr(items);
                                                    fn(items);
                                                    resolve();
                                                },
                                                ( txObj2, err2 ) => console.log( err2 )
                                            );
                                        }
                                },
                                ( txObj, err ) =>  {
                                    alert('error ' + err);
                                    reject();
                                }
                            );
                        });
                } ).catch( err => {
                    reject();
                    console.log('Erreur dans le serveur ' + err)
            });
    });
}

export function setItems( apiUrl, fn ) {
    db.transaction( tx => {
        tx.executeSql(
            `select * from panier;`, null,
            (txObj, resultSet) =>  {
                let res = resultSet.rows._array;
                let items = [];
                res.forEach( r => {
                    try {
                        fetch(`${apiUrl}/items/${r.id_item}`, {
                            method: 'GET',
                            headers: {
                                'Content-Type': 'application/json',
                            }
                        }).then( r => {
                            return r.json();
                        }).then( element => {
                            element.amount = r.amount;
                            items.push( element );
                            items = sortArr(items);
                            fn(items);
                        } )
                    } catch (error) {
                        console.error('Erreur lors de la récupération des données :', error);
                    }
                });
            },
            ( txObj, err ) =>  console.log(err)
        );
    });
}

export default function CheckoutScreen({navigation}) {
    const { initPaymentSheet, presentPaymentSheet } = useStripe();
    const [loading, setLoading] = useState(false);
    const [paymentIntentId, setPaymentIntentId] = useState<string>("");
    const [hasPermission, setHasPermission] = useState<boolean | null>(null); // Camera permission
    const [scanned, setScanned] = useState(false);
    const [itemsKeys, onChangeKey] = useState('items');
    const [itemsValues, onChangeItem] = useState( [] );
    const [ isLoadingDb, setIsLoadingDb ] = useState(true);
    const apiUrl = Constants.expoConfig.extra.apiUrl;

    const userId = "cus_OwIeB1ZbHc2opD";
    /*const items = [
        {
            "id": 1,
            "amount": 2
        }
    ];*/

    const removeItemInCart = async function( id ) {
        db.transaction( tx => {
            tx.executeSql( 'update panier SET amount = amount - 1 where id_item = ?;', [id],
                (txObj, resultSet) => {
                    let items = [...itemsValues];
                    let item = items.filter( items => items.id == id )[0]
                    let idx = items.indexOf(item);
                    items[idx].amount--;
                    onChangeItem(items);
                    if( items[idx].amount <= 0 ) {
                        txObj.executeSql( 'delete from panier where id_item = ?;', [id],
                        (txObj2, resultSet2) => {
                            let items = [...itemsValues];
                            let item = items.filter( items => items.id == id )[0]
                            let idx = items.indexOf(item);
                            items.splice( idx, 1 );
                            items = sortArr(items);
                            onChangeItem(items);
                        },
                        ( txObj2, err2 ) => console.log( err2 )
                        );
                    }
                },
                ( txObj, err ) => console.log( err )
            );
        });
    }

    const fetchPaymentSheetParams = async () => {
        await fetchData();
        const items = itemsValues.map( i => { return { id: i.id, amount: i.amount } })
        const response = await fetch(`${apiUrl}/payments/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                "pending_items": items,
                "customer_id": userId
            })
        });

        const { paymentIntent, ephemeralKey, customer } = await response.json();
        return {
            paymentIntent,
            ephemeralKey,
            customer,
        };

    };

    const initializePaymentSheet = async () => {
        const {
            paymentIntent,
            ephemeralKey,
            customer,
        } = await fetchPaymentSheetParams();

        const { error } = await initPaymentSheet({
            merchantDisplayName: "Example, Inc.",
            customerId: customer,
            customerEphemeralKeySecret: ephemeralKey,
            paymentIntentClientSecret: paymentIntent,
            allowsDelayedPaymentMethods: false,
        });

        if (!error) {
            setPaymentIntentId(paymentIntent);
            setLoading(true);
        }else {
            console.log(error);
        }
    };

    const openPaymentSheet = async () => {
        await fetchData();
        initializePaymentSheet();
        const { error } = await presentPaymentSheet();

        if (error) {
            Alert.alert(`Error code: ${error.code}`, error.message);
        } else {
            const paymentIntent = `pi_${paymentIntentId.split("_")[1]}`;
            const response = await fetch(`${apiUrl}/payments/check/${paymentIntent}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    "customer_id": userId
                })
            });

            if (response.status == 200) {
                db.transaction( tx => {
                        tx.executeSql( 'delete from panier;', null,
                            (txObj, resultSet) => {
                               onChangeItem([]);
                            },
                            ( txObj, err ) => console.log( err )
                        );
                    });
                Alert.alert('Success', 'Your order is confirmed!');
            }
        }
    };

    const focusFunction = async () => { fetchData(); };
    useEffect(() => {
        navigation.addListener('focus', focusFunction);
        return () => {
            navigation.removeListener('focus', focusFunction);
        };
    }, []);

    useEffect(() => {
        (async () => {
          const { status } = await BarCodeScanner.requestPermissionsAsync();
          setHasPermission(status === 'granted');
          fetchData().then( () => {
            initializePaymentSheet();
          });
        })();
      }, [hasPermission]);

      if (hasPermission === null) {
         // L'autorisation est en cours de vérification, vous pouvez afficher un indicateur de chargement ici.
         return <Text>Checking camera permission...</Text>;
      }

      if (hasPermission === false) {
         // L'utilisateur n'a pas accordé l'autorisation, vous pouvez afficher un message ici.
         return <Text>No access to camera</Text>;
      }

      const handleBarCodeScanned = ({ type, data }) => {
             saveItemInCart( data, itemsValues, onChangeItem, apiUrl);
      };

    async function fetchData() {
         db.transaction((tx) => {
              tx.executeSql('CREATE TABLE IF NOT EXISTS panier ( id INTEGER PRIMARY KEY AUTOINCREMENT, id_item INTEGER UNIQUE, amount INTEGER)')
              //tx.executeSql('DELETE FROM panier');
         });
         setItems( apiUrl, onChangeItem );
         setIsLoadingDb(false)
      }

    const renderItem = rowData => {
        let c = rowData.item.amount > 1 ? `(${rowData.item.amount})` : '';
        return (
            <TouchableOpacity onPress={() => console.log('Item touched')} style={styles.itemContainer}>
                <View style={{backgroundColor: 'white'}}>
                    <View style={styles.elementContainer} id-list={rowData.item.id}><Text style={{fontSize: 25}}>{rowData.item.name} {c}</Text></View>
                </View>
            </TouchableOpacity>
        );
    }

    const renderHiddenItem = (rowData, rowMap, params) => {
        return (
            <View style={styles.hiddenContainer}>
                <TouchableOpacity style={[styles.hiddenButton, styles.actionButton]}
                    onPress={() => {
                            removeItemInCart( rowData.item.id ).then(()=> {
                                fetchData().then( () => { initializePaymentSheet(); });
                            });
                        }
                    }
                >
                    <Text style={styles.buttonText}>-</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.hiddenButton, styles.actionButton]}
                    onPress={() => {
                        saveItemInCart( rowData.item.id, itemsValues, onChangeItem, apiUrl ).then(()=> {
                            fetchData().then( () => { initializePaymentSheet(); });
                        });
                    }}
                >
                    <Text style={styles.buttonText}>+</Text>
                </TouchableOpacity>
            </View>
        );
    }

     if( isLoadingDb ) {
        return (
            <View>
                <Text>Loading items...</Text>
            </View>
        )
     }

    return (
        <SafeAreaView style={styles.principalContainer}>
              <View style={{ flex:1,  flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', marginTop: 10, marginBottom: 20}}>
                 <View style={{ backgroundColor: '#76D0FC', alignSelf: 'flex-start', marginRight: 20 }}>
                     <Button title="Nouveau" color="white" onPress={() => { navigation.navigate('Add') } }/>
                  </View>
                  <View style={{ backgroundColor: '#76D0FC', alignSelf: 'flex-start', marginRight: 20 }}>
                        <Button title="Historique" color="white" onPress={() => { navigation.navigate('History') } }/>
                   </View>
              </View>
            <View style={styles.container}>
                      <BarCodeScanner
                        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
                        style={StyleSheet.absoluteFillObject}
                      />
                      {scanned && <Text>Scanned!</Text>}
             </View>
             <View style={styles.scannedItemsSection}>
                <View style={{ padding: 20, height: '100%' }}>
                      <SwipeListView
                         style={{ maxHeight: screenHeight * 0.4 }}
                         data={itemsValues}
                         renderItem={(data) => renderItem(data)}
                         renderHiddenItem={(data) => renderHiddenItem(data, null)}
                         rightOpenValue={-150}
                      />
                </View>
            </View>
            <View style={styles.btnPay}>
                <Button title="Payer" onPress={openPaymentSheet}/>
            </View>
        </SafeAreaView>
    );
}


const styles = StyleSheet.create({
    principalContainer: {
        height: '100%',
        width: '100%',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    scannedItemsSection: {
        height: '80%',
        width: '100%',
    },
    btnPay: {
        backgroundColor: '#4DD2D0',
        borderRadius: 8,
        padding: 3,
        width: '80%'
    },
    hiddenButton: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 75,
        height: 80,
    },

    actionButton: {
      backgroundColor: '#DDDDDD',
      width: 50,
      borderRadius: '50%',
      height: 40
    },

    itemContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFF',
        height: 80,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 3,
        marginBottom: 10,
    },
    elementContainer: {
      padding: 20,
      backgroundColor: '#E3E3E3²',
      borderColor: '#CFCFCF',
      borderWidth: 0
    },
    hiddenContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        backgroundColor: '#FFF',
        height: 80,
        borderRadius: 20,
        padding: 20
    },
});