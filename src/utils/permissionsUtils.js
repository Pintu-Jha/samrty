// src/utils/PermissionsUtils.js
import {PermissionsAndroid, Platform} from 'react-native';

export const Permissions = {
  STORAGE: {
    READ: PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
    WRITE: PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
  },
  CAMERA: PermissionsAndroid.PERMISSIONS.CAMERA,
  LOCATION: {
    FINE: PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    COARSE: PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
  },
};

export const requestPermission = async (permission, options = {}) => {
  if (Platform.OS === 'android') {
    try {
      const defaultOptions = {
        title: 'Permission Required',
        message: 'This app needs access to continue',
        buttonPositive: 'Allow',
        buttonNegative: 'Deny',
        ...options,
      };

      const granted = await PermissionsAndroid.request(
        permission,
        defaultOptions,
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.error('Permission error:', err);
      return false;
    }
  }
  return true;
};

export const requestMultiplePermissions = async (permissions, options = {}) => {
  if (Platform.OS === 'android') {
    try {
      const results = await PermissionsAndroid.requestMultiple(permissions);
      return Object.values(results).every(
        result => result === PermissionsAndroid.RESULTS.GRANTED,
      );
    } catch (err) {
      console.error('Multiple permissions error:', err);
      return false;
    }
  }
  return true;
};

export const checkPermission = async permission => {
  if (Platform.OS === 'android') {
    try {
      return await PermissionsAndroid.check(permission);
    } catch (err) {
      console.error('Permission check error:', err);
      return false;
    }
  }
  return true;
};

// Specific permission requests
export const requestStoragePermission = async () => {
  return requestMultiplePermissions(
    [Permissions.STORAGE.READ, Permissions.STORAGE.WRITE],
    {
      title: 'Storage Permission',
      message: 'App needs access to storage to manage files',
      buttonPositive: 'Allow',
      buttonNegative: 'Deny',
    },
  );
};

export const requestCameraPermission = async () => {
  return requestPermission(Permissions.CAMERA, {
    title: 'Camera Permission',
    message: 'App needs access to camera',
    buttonPositive: 'Allow',
    buttonNegative: 'Deny',
  });
};

export const requestLocationPermission = async () => {
  return requestPermission(Permissions.LOCATION.FINE, {
    title: 'Location Permission',
    message: 'App needs access to location',
    buttonPositive: 'Allow',
    buttonNegative: 'Deny',
  });
};
