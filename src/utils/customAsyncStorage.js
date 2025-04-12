import AsyncStorage from '@react-native-async-storage/async-storage';

export const USER_DATA = 'userData';
export const TOKEN_KEY = 'token';
export const BASE_URL_TOKEN = 'url'
export const DOMAIN_LIST = 'domainList'
export const LOGIN_INFO = 'loginInfo'
export const INITIAL_SCREEN_KEY = 'initialScreen';



// Retrieve an item from AsyncStorage
export async function retrieveItem(key) {
  try {
    const retrievedItem = await AsyncStorage.getItem(key);
    if (retrievedItem !== null) {
      const item = JSON.parse(retrievedItem);
      return item;
    }
    return null;
  } catch (error) {
    console.error('Error retrieving item:', error);
    return null;
  }
}

// Store an item in AsyncStorage
export async function storeItem(key, item) {
  try {
    const jsonOfItem = JSON.stringify(item);
    await AsyncStorage.setItem(key, jsonOfItem);
  } catch (error) {
    console.error('Error storing item:', error);
  }
}

// Clear a specific item from AsyncStorage
export async function clearAsyncKeyData(key) {
  try {
    await AsyncStorage.removeItem(key);
  } catch (error) {
    console.error('Error clearing key data:', error);
  }
}

// Clear all data from AsyncStorage
export async function clearData() {
  try {
    await AsyncStorage.clear();
  } catch (error) {
    console.error('Error clearing data:', error);
  }
}

// Store token in AsyncStorage
export const storeToken = async (token) => {
  try {
    await AsyncStorage.setItem(TOKEN_KEY, token);
  } catch (error) {
    console.error('Error storing token:', error);
  }
};

// Retrieve token from AsyncStorage
export const getToken = async () => {
  try {
    return await AsyncStorage.getItem(TOKEN_KEY);
  } catch (error) {
    console.error('Error retrieving token:', error);
    return null;
  }
};
