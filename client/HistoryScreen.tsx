import React, { useEffect, useState } from "react";
import { Alert, Text, Button, SafeAreaView, View, StyleSheet, Dimensions, TouchableOpacity, ScrollView, TextInput } from "react-native";
import { setItems, saveItemInCart } from './CheckoutScreen';
import { userId, apiUrl, moodConfig } from './variables_config'
import { setMode, getValueMood } from './modeApp'
import * as SQLite from "expo-sqlite";

export default function AddItemScreen({navigation}) {
    const [itemsValues, onChangeItem] = useState( [] );
    const [modeApp, setModeApp] = useState('light');
    async function fetchData() {
         fetch(`${apiUrl}/payments/checked/${userId}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            }
         } ).then( r => {
            return r.json();
         } ).then( elements => {
            elements = elements.filter( e => e.is_checked );
            onChangeItem( elements );
         } ).catch(e => {
         })
    }

    useEffect(() => {
        (async () => {
            const mode = await getValueMood();
            setModeApp(mode);
        })();

        fetchData();
    }, []);

    const stylesMode =  {
             principalContainer: {
                   backgroundColor: modeApp == moodConfig.light.label ? moodConfig.light.color : moodConfig.dark.color
             }
      }
    return (
            <ScrollView style={[ styles.scrollView, stylesMode.principalContainer ]}>
                <View style={styles.inputHistoryPageContainer}>
                {itemsValues.map((element, index) => (
                     <View style={styles.historyItem}>
                        <Text>Date: { new Date(element.checkout_date).toLocaleDateString()}</Text>
                        <Text>Total payée: {
                                element.purchased_items.map( i => ( (i.item.price/100)*i.amount) )
                                .reduce( ( ac, cur ) => { return ac + cur; }, 0)
                                }
                        </Text>
                        <Text style={{marginTop: 10}}>Produits: </Text>
                        {element.purchased_items.map( i => {
                            return <Text>- {i.item.name} ({i.amount})</Text>
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
        alignText: 'center',
    }
}