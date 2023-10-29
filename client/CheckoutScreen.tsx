import { useStripe } from "@stripe/stripe-react-native";
import Constants from "expo-constants";
import React, { useEffect, useState } from "react";
import { Alert, Text, Button, SafeAreaView, View, StyleSheet, Dimensions, TouchableOpacity } from "react-native";
import { Camera } from 'expo-camera';
import { BarCodeScanner } from 'expo-barcode-scanner';
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';
import { SwipeListView } from  'react-native-swipe-list-view';
const screenHeight = Dimensions.get('window').height;

async function deleteAllItems() {
  await SecureStore.setItemAsync('items', '[]');
}
async function saveItem(id) {
      let result = await SecureStore.getItemAsync('items');
      if (result == null ) result = "[]";
      let res = JSON.parse(result);
      let exists = res.filter( r => { return r.id == id });
      let element = { id: id, amount: 1 };

      if( exists.length > 0 ) {
        element = exists[0];
        element.amount++;
      } else {
        res.push(element);
      }

      let newValue = JSON.stringify(res);
      await SecureStore.setItemAsync('items', newValue);
}


async function removeItem( id ) {
    let result = await SecureStore.getItemAsync('items');
    res = JSON.parse(result);
    let filter = res.filter(i => i.id == id );
    if( filter.length > 0 ) {
        let element = filter[0]
        let idx = res.indexOf(element);
           if( res[idx].amount > 0 ) {
           res[idx].amount--;
       }
       if( res[idx].amount == 0) {
            res.splice( idx, 1 )
       }
    }
   let newValue = JSON.stringify( [ ...res ] );
   await SecureStore.setItemAsync('items', newValue);
}

async function addAmountItem( id ) {
    let result = await SecureStore.getItemAsync('items');
    res = JSON.parse(result);
    let filter = res.filter(i => i.id == id );
    if( filter.length > 0 ) {
        let element = filter[0];
        let idx = res.indexOf(element);
           if( res[idx].amount > 0 ) {
           res[idx].amount++;
       }
    }
   let newValue = JSON.stringify( [ ...res ] );
   await SecureStore.setItemAsync('items', newValue);
}


export default function CheckoutScreen({navigation}) {
    const { initPaymentSheet, presentPaymentSheet } = useStripe();
    const [loading, setLoading] = useState(false);
    const [paymentIntentId, setPaymentIntentId] = useState<string>("");
    const [hasPermission, setHasPermission] = useState<boolean | null>(null); // Camera permission
    const [scanned, setScanned] = useState(false);
    const [itemsKeys, onChangeKey] = useState('items');
    const [itemsValues, onChangeItem] = useState( [] );
    //deleteAllItems();
    const apiUrl = Constants.expoConfig.extra.apiUrl;

    const userId = "cus_OsVFxOpN2P8IKP";
    /*const items = [
        {
            "id": 1,
            "amount": 2
        }
    ];*/

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
            console.log('no error');
            setPaymentIntentId(paymentIntent);
            setLoading(true);
        }else {
            console.log('errroorrrr');
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

            if (response.status == 200) Alert.alert('Success', 'Your order is confirmed!');
        }
    };

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
              //setScanned(true);

              //alert(`Type: ${type}\nData: ${data}`);
              saveItem(data).then(() => {
                fetchData();
              });

          };

    async function getValueFor( key ) {
       let result = await SecureStore.getItemAsync(key);
       res = JSON.parse(result);
       if (result) return res;
       else alert('invalid')
    }

    async function fetchData() {
        const itemsCollection = await getValueFor(itemsKeys);
        let listItems = [];
        if(itemsCollection.length == 0 ) onChangeItem([]);
        for( let idx = 0 ; idx < itemsCollection.length ; idx++ ) {
                let item = itemsCollection[idx];
                try {
                  let response = await fetch(`${apiUrl}/items/${item.id}`, {
                    method: 'GET',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                  });
                  let element = await response.json();
                  element.amount = item.amount;
                  listItems.push( element );
                } catch (error) {
                  console.error('Erreur lors de la récupération des données :', error);
                }
        }
        await onChangeItem(listItems);
      }

    renderItem = rowData => {
    let c = rowData.item.amount > 1 ? `(${rowData.item.amount})` : '';
        return (
                             <TouchableOpacity
                                 onPress={() => console.log('Item touched')}
                                 style={styles.itemContainer}>
                                 <View style={{backgroundColor: 'white'}}>
                                   <View style={styles.elementContainer} id-list={rowData.item.id}><Text style={{fontSize: 25}}>{rowData.item.name} {c}</Text></View>
                                   </View>
                             </TouchableOpacity>
                   );
    }

    renderHiddenItem = (rowData, rowMap, params) => {
        return (
                  <View style={styles.hiddenContainer}>
                      <TouchableOpacity
                      style={[styles.hiddenButton, styles.actionButton]}
                            onPress={() => {
                                    removeItem( rowData.item.id ).then(()=> {
                                        fetchData().then( () => {
                                                    initializePaymentSheet();
                                                  });
                                    });
                                }
                            }
                      >
                        <Text style={styles.buttonText}>-</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                                            style={[styles.hiddenButton, styles.actionButton]}
                                                  onPress={() => {
                                                          addAmountItem( rowData.item.id , params ).then(()=> {
                                                              fetchData().then( () => {
                                                                          initializePaymentSheet();
                                                                        });
                                                          });
                                                      }
                                                  }
                                            >
                                              <Text style={styles.buttonText}>+</Text>
                                            </TouchableOpacity>
                        </View>
                  );
    }
    return (
        <SafeAreaView style={styles.principalContainer}>
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
        width: '100%'
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