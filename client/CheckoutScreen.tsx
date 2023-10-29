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

export default function CheckoutScreen({navigation}) {
    const { initPaymentSheet, presentPaymentSheet } = useStripe();
    const [loading, setLoading] = useState(false);
    const [paymentIntentId, setPaymentIntentId] = useState<string>("");
    const [hasPermission, setHasPermission] = useState<boolean | null>(null); // Camera permission
    const [scanned, setScanned] = useState(false);
    const [itemsKeys, onChangeKey] = useState('items');
    const [itemsValues, onChangeItem] = useState( [] );

    const apiUrl = Constants.expoConfig.extra.apiUrl;

    const userId = "cus_OsVFxOpN2P8IKP";
    const items = [
        {
            "id": 1,
            "amount": 2
        }
    ];

    const fetchPaymentSheetParams = async () => {
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
          initializePaymentSheet();
          fetchData();
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
              alert(`Type: ${type}\nData: ${data}`);
              saveItem(1).then(() => {
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
        for( let idx = 0 ; idx < itemsCollection.length ; idx++ ) {
                let item = itemsCollection[idx];
                fetch(`${apiUrl}/items/1`, { method: 'GET', 'Content-Type': 'application/json', }
                ).then(r => {
                    return r.json();
                }).then( element => {
                    element.amount = item.amount;
                    listItems.push( element );
                    onChangeItem(listItems);
                }
    );
        }
      }

    renderItem = rowData => (
              <TouchableOpacity
                  onPress={() => console.log('Item touched')}
                  style={styles.itemContainer}>
                  <View style={{backgroundColor: 'white'}}>
                    <Text>{rowData.item}</Text>
                    </View>
              </TouchableOpacity>
    );

    renderHiddenItem = (rowData, rowMap, params) => {
        return (
                  <View style={styles.hiddenContainer}>
                      <TouchableOpacity
                      style={[styles.hiddenButton, styles.deleteButton]}
                            onPress={() => {
                                    deleteItem( rowData.item.key, params ).then(()=> {
                                        fetchData();
                                    });
                                }
                            }
                      >
                        <Text style={styles.buttonText}>X</Text>
                      </TouchableOpacity>
                        </View>
                  );
    }
    let liste = itemsValues.length > 0 ? itemsValues.map( i => <View style={styles.elementContainer}><Text style={{fontSize: 25}}>{i.name} ({i.amount})</Text></View> ) : [];
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
                         data={liste}
                         renderItem={(data) => renderItem(data)}
                         renderHiddenItem={(data) => renderHiddenItem(data, null)}
                         rightOpenValue={-150}
                      />
                </View>
            </View>
            <View style={styles.btnPay}>
                <Button disabled={!loading} title="Payer" onPress={openPaymentSheet}/>
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

    deleteButton: {
      borderBottomRightRadius: 8,
      borderTopRightRadius: 8,
      backgroundColor: '#ED6666',
      width: 100
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