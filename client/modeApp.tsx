import * as SecureStore from 'expo-secure-store';

export async function setMode(value) {
console.log('set mode');
console.log(value);
  await SecureStore.setItemAsync('mode', value);
}

export async function getValueMood() {
   let result = await SecureStore.getItemAsync('mode');
   console.log('check result'); console.log(result);
   if (result) return result;
   else return 'light'
}
