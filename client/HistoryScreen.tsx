import { useStripe } from "@stripe/stripe-react-native";
import Constants from "expo-constants";
import React, { useEffect, useState } from "react";
import { Alert, Text, Button, SafeAreaView, View, StyleSheet, Dimensions, TouchableOpacity, ScrollView, TextInput } from "react-native";
import { Camera } from 'expo-camera';
import { BarCodeScanner } from 'expo-barcode-scanner';
import axios from 'axios';
import { SwipeListView } from  'react-native-swipe-list-view';
const screenHeight = Dimensions.get('window').height;
import { setItems, saveItemInCart } from './CheckoutScreen';
import * as SQLite from "expo-sqlite";

export default function AddItemScreen({navigation}) {
    const [itemsValues, onChangeItem] = useState( [] );
    const apiUrl = Constants.expoConfig.extra.apiUrl;
    const userId = "cus_OwIeB1ZbHc2opD";

    async function fetchData() {
         fetch(`${apiUrl}/payments/${userId}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            }
         } ).then( r => {
            return r.json();
         } ).then( elements => {
            elements = elements.filter( e => e.is_checked );
            onChangeItem( elements );
         } );
    }

    useEffect(() => {
        fetchData();
    }, []);

    return (
            <ScrollView style={styles.scrollView}>
                <View style={styles.inputHistoryPageContainer}>
                {itemsValues.map((element, index) => (
                     <View style={styles.historyItem}>
                        <Text key={index}>Date: { new Date(element.checkout_date).toLocaleDateString()}</Text>
                        <Text key={index}>Total payé: {
                                element.purchased_items.map( i => i.item.price*i.amount)
                                .reduce( ( ac, cur ) => { return ac + cur; }, 0)
                                }
                        </Text>
                        <Text key={index}>Produits: </Text>
                        {element.purchased_items.map( i => {
                            return <Text key={index}>- {i.item.name} ({i.amount})</Text>
                        })}
                     </View>
                ))}
                </View>
            </ScrollView>

          );
}

const styles = {
    inputHistoryPageContainer : {
        height: '100%',
        width: '100%',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 20
    },
    historyItem : {
        backgroundColor: '#FFF',
        padding: 20,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#CFCFCF',
        width: '80%',
        margin: 10
    },
    scrollView: {
        backgroundColor: '#DDDDDD',
        width: '100%',
        flex:'center',
        alignText: 'center',
    }
}