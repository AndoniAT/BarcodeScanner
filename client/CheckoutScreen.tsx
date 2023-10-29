import { useStripe } from "@stripe/stripe-react-native";
import Constants from "expo-constants";
import React, { useEffect, useState } from "react";
import { Alert, Text, Button, SafeAreaView, View, StyleSheet } from "react-native";
import { Camera } from 'expo-camera';
import { BarCodeScanner } from 'expo-barcode-scanner';
import axios from 'axios';

export default function CheckoutScreen({navigation}) {
    const { initPaymentSheet, presentPaymentSheet } = useStripe();
    const [loading, setLoading] = useState(false);
    const [paymentIntentId, setPaymentIntentId] = useState<string>("");
    const [hasPermission, setHasPermission] = useState<boolean | null>(null); // Camera permission
    const [scanned, setScanned] = useState(false);

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

    const openPaymentSheet = async () => {console.log('opeeen');
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
        })();
      }, []);

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

          };

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
        backgroundColor: 'pink',
        width: '100%'
    },
    btnPay: {
        backgroundColor: '#4DD2D0',
        borderRadius: 8,
        padding: 3,
        width: '80%'
    },
});