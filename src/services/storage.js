// src/services/storage.js
// import AsyncStorage from '@react-native-async-storage/async-storage';

// 1. Detect if we are on the Web safely (No imports needed)
const isWeb = typeof window !== 'undefined' && window.localStorage;

export const LocalStorage = {
  get: async (key) => {
    if (isWeb) {
      return localStorage.getItem(key);
    } else {
      // This line will only run on mobile, so it's safe
      return await AsyncStorage.getItem(key);
    }
  },

  set: async (key, value) => {
    const stringValue = String(value);
    
    if (isWeb) {
      localStorage.setItem(key, stringValue);
    } else {
      await AsyncStorage.setItem(key, stringValue);
    }
  }
};