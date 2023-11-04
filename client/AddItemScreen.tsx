import React, { useEffect, useState } from "react";
import { Alert, Text, Button, SafeAreaView, View, StyleSheet, Dimensions, TouchableOpacity, ScrollView, TextInput } from "react-native";
import { setItems, saveItemInCart } from './CheckoutScreen';
import { userId, apiUrl, moodConfig } from './variables_config'
import { setMode, getValueMood } from './modeApp'

import * as SQLite from "expo-sqlite";

export default function AddItemScreen({navigation}) {
    const [value, onChangeValue] = useState('');
    const [itemsValues, onChangeItem] = useState( [] );
    const [modeApp, setModeApp] = useState('light');
    async function fetchData() {
         setItems( apiUrl, onChangeItem );
    }

    useEffect(() => {
        (async () => {
            const mode = await getValueMood();
             setModeApp(mode);
             fetchData();
        })();
    }, []);

   const stylesMode =  {
         principalContainer: {
               backgroundColor: modeApp == moodConfig.light.label ? moodConfig.light.color : moodConfig.dark.color
         }
  }

    return (
        <View style={[styles.inputAddPageContainer,  stylesMode.principalContainer ]}>
            <TextInput placeholder="Nouvelle tâche" style={styles.inputAdd}  onChangeText={ text => onChangeValue(text)} />
            <View>
                <View style={{  marginTop: 10, marginBottom: 20}}>
                <TouchableOpacity style={{ backgroundColor: '#76D0FC', padding: 10, borderRadius: 10, marginRight: 10}}
                    onPress={() =>{
                        saveItemInCart(value, itemsValues, onChangeItem, apiUrl).then(() => {
                            navigation.navigate('Barre Code Scanner')
                            });
                        }
                    }
                >
                    <Text style={{ color: 'black' }}>Valider</Text>
                </TouchableOpacity>
                </View>
            </View>
        </View>
      );
}

const styles = StyleSheet.create({
    inputAddPageContainer : {
        flex: 1,
        paddingTop: 50,
        width: '100%',
        alignItems: 'center'
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
