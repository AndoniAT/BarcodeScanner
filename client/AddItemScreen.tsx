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
    const [value, onChangeValue] = useState('');
    const [itemsValues, onChangeItem] = useState( [] );
    const apiUrl = Constants.expoConfig.extra.apiUrl;

    async function fetchData() {
         setItems( apiUrl, onChangeItem );
    }

    useEffect(() => {
        fetchData();
    }, []);

      return (
        <View style={styles.inputAddPageContainer}>
            <TextInput placeholder="Nouvelle tâche" style={styles.inputAdd}  onChangeText={ text => onChangeValue(text)} />
            <View style={{width: '100%'}}>
                <View style={styles.btnContainer}>
                   <Button title="Valider" color="white" onPress={() =>{
                        saveItemInCart(value, itemsValues, onChangeItem, apiUrl).then(() => {
                            navigation.navigate('Barre Code Scanner')
                        });
                    }
                    }/>
                </View>
            </View>
        </View>
      );
}

const styles = StyleSheet.create({
    inputAddPageContainer : {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'start',
        paddingTop: 50,
        width: '100%',
        flex: 1,
        alignItems: 'center',
        textAlign: 'center'
    },
    inputAdd : {
        borderColor: 'black',
        borderWidth: 1,
        padding: 10,
        backgroundColor: 'white',
        width: '50%',
        marginBottom: 10,
        placeholderTextColor: '#F7BCBC'
    },
    btnContainer : {
        backgroundColor: '#76D0FC',
        borderColor: '#CFCFCF',
        alignSelf: 'center'
    }
})
