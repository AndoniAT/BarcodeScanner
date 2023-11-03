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

}