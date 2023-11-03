import { StripeProvider } from '@stripe/stripe-react-native';
import { StyleSheet, Text, View, TouchableOpacity, Image, ScrollView, TextInput, Button, Dimensions } from 'react-native';
import React , {useState, useEffect} from 'react';
import Constants from 'expo-constants';
import CheckoutScreen from './CheckoutScreen';
import AddScreen from './AddItemScreen';
import HistoryScreen from './HistoryScreen';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
const Stack = createNativeStackNavigator();

function HomeScreen({navigation}) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>  
      <CheckoutScreen navigation={navigation}/>
    </View>
  );
}

function AddScreenF({navigation}) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <AddScreen navigation={navigation}/>
    </View>
  );
}

function HistoryScreenF({navigation}) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <HistoryScreen navigation={navigation}/>
    </View>
  );
}


export default function App() {
  const stripePK = Constants.expoConfig.extra.stripePK;

  return (
    <StripeProvider
      publishableKey={stripePK}
      merchantIdentifier="merchant.com.example"
    >
      <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen name="Barre Code Scanner" component={HomeScreen} />
                <Stack.Screen name="Add" component={AddScreenF} />
                <Stack.Screen name="History" component={HistoryScreenF} />
          </Stack.Navigator>
    </NavigationContainer>
    </StripeProvider>
  );
}

const styles = StyleSheet.create({

});