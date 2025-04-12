import { BackHandler } from 'react-native';

// A Set to hold unique back handlers
const backHandlerStack = new Set();

// Function to register a new back handler
export const registerBackHandler = (handler) => {
  if (typeof handler === 'function' && !backHandlerStack.has(handler)) {
    backHandlerStack.add(handler);
  }
};

// Function to unregister a back handler
export const unregisterBackHandler = (handler) => {
  if (backHandlerStack.has(handler)) {
    backHandlerStack.delete(handler);
  }
};

// Centralized back handler
const handleBackPress = () => {
  // Convert the set to an array and reverse it to ensure we handle the most recent handler first
  const handlers = Array.from(backHandlerStack).reverse();
  
  for (const handler of handlers) {
    // If handler returns true, it means it has handled the back press
    if (handler()) {
      return true; // Stop further processing
    }
  }

  return false; 
};

// Add centralized back handler on application start
BackHandler.addEventListener('hardwareBackPress', handleBackPress);

// Cleanup function to remove centralized back handler when application closes
export const removeCentralizedBackHandler = () => {
  BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
};
