import { Alert, Linking, PermissionsAndroid, Platform } from 'react-native';

const requestAndroidPermission = async (permission, permissionName) => {
  try {
    const granted = await PermissionsAndroid.request(permission);
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      return true;
    } else if (granted === PermissionsAndroid.RESULTS.DENIED) {
      console.warn(`${permissionName} permission denied.`);
      return false;
    } else if (granted === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
      console.warn(`${permissionName} permission denied permanently.`);
      Alert.alert(
        `${permissionName} Permission Required`,
        `You have permanently denied ${permissionName.toLowerCase()} permission. Please enable it in settings.`,
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Open Settings', onPress: () => Linking.openSettings() },
        ]
      );
      return false;
    }
  } catch (err) {
    console.warn('Permission error:', err);
    return false;
  }
};

// Function to handle iOS permission alerts
const showIOSPermissionAlert = (permissionName) => {
  Alert.alert(
    `${permissionName} Permission Required`,
    `This app needs access to your ${permissionName.toLowerCase()} to provide enhanced services. Please enable it in settings.`,
    [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Open Settings', onPress: () => Linking.openSettings() },
    ]
  );
};

// Main permission handler function
export const requestPermission = async (permissionType) => {
  if (Platform.OS === 'android') {
    // Android-specific permissions
    switch (permissionType) {
      case 'location':
        return await requestAndroidPermission(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          'Location'
        );
      case 'contacts':
        return await requestAndroidPermission(
          PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
          'Contacts'
        );
      case 'camera':
        return await requestAndroidPermission(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          'Camera'
        );
      case 'microphone':
        return await requestAndroidPermission(
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
          'Microphone'
        );
      case 'storage':
        return await requestAndroidPermission(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          'Storage'
        );
      case 'readStorage':
        return await requestAndroidPermission(
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
          'Read Storage'
        );
      case 'sms':
        return await requestAndroidPermission(
          PermissionsAndroid.PERMISSIONS.READ_SMS,
          'SMS'
        );
      default:
        return false;
    }
  } else if (Platform.OS === 'ios') {
    // iOS-specific permissions - Display alerts to guide users to settings
    switch (permissionType) {
      case 'location':
        showIOSPermissionAlert('Location');
        return false;
      case 'contacts':
        showIOSPermissionAlert('Contacts');
        return false;
      case 'camera':
        showIOSPermissionAlert('Camera');
        return false;
      case 'microphone':
        showIOSPermissionAlert('Microphone');
        return false;
      case 'storage':
        showIOSPermissionAlert('Storage');
        return false;
      default:
        return false;
    }
  } else {
    return false;
  }
};
