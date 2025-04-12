import {Alert, Linking} from 'react-native';
import NavigationService from '../NavigationServies';
import Toast, {BaseToast, ErrorToast} from 'react-native-toast-message';

export const formatTimestamp = (timestamp, formatType = 'time') => {
  const date = new Date(timestamp);
  const now = new Date();

  // Calculate time difference in hours
  const diffTime = (now - date) / (1000 * 60 * 60); // Difference in hours

  // Return time if the formatType is 'time' or if the time difference is less than 12 hours
  if (formatType === 'time' || diffTime <= 12) {
    const options = {hour: 'numeric', minute: 'numeric', hour12: true};
    return date.toLocaleTimeString('en-US', options); // Return formatted time
  }

  // Check if the formatType is 'day' and return day-related strings
  if (formatType === 'day') {
    const diffDays = Math.floor(diffTime / 24); // Difference in days

    // Format for today
    if (diffDays === 0) {
      return 'Today';
    }

    // Format for yesterday
    if (diffDays === 1) {
      return 'Yesterday';
    }

    // Check if the date is within the current week
    if (diffDays < 7 && date.getDay() < now.getDay()) {
      const options = {weekday: 'long'}; // Format day of the week
      return date.toLocaleDateString('en-US', options);
    }
  }

  // Get date and time
  if (formatType === 'dateTime') {
    const options = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    };
    return date.toLocaleString('en-US', options); // Return formatted date and time
  }

  // Default to just returning the date if none of the above match
  return date.toLocaleDateString('en-US');
};

export const formatTimestampWithoutModifying = originalTimestamp => {
  // Convert the input string into a Date object
  const date = new Date(originalTimestamp);

  // Format the date as required (dd/mm/yy)
  const formattedDate = `${('0' + date.getDate()).slice(-2)}/${(
    '0' +
    (date.getMonth() + 1)
  ).slice(-2)}/${String(date.getFullYear()).slice(-2)}`;

  // Format the time (h:mm a)
  const hours = date.getHours();
  const minutes = ('0' + date.getMinutes()).slice(-2);
  const period = hours >= 12 ? 'pm' : 'am';
  const formattedTime = `${hours % 12 || 12}:${minutes} ${period}`;

  // Combine the date and time
  const formattedDateTime = `${formattedDate} ${formattedTime}`;

  // Return the formatted string without modifying the original timestamp
  return formattedDateTime;
};

export const formatTimestampForMessageList = (
  timestamp,
  formatType = 'time',
) => {
  const date = new Date(timestamp);
  const now = new Date();

  // Calculate time difference in milliseconds
  const diffTime = now - date;
  const diffHours = diffTime / (1000 * 60 * 60); // Difference in hours
  const diffDays = Math.floor(diffHours / 24); // Difference in days

  // Return time in local 12-hour format if the message is from today
  if (diffDays === 0) {
    const options = {hour: '2-digit', minute: '2-digit', hour12: true}; // 12-hour format
    return date.toLocaleTimeString([], options);
  }

  // Return 'Yesterday' if the message was from the previous day
  if (diffDays === 1) {
    return 'Yesterday';
  }

  // If the message is older than yesterday, show the full date (dd MMM yyyy)
  const options = {year: 'numeric', month: 'short', day: 'numeric'};
  return date.toLocaleDateString([], options);
};

export const formatTimestampForComplaints = (
  timestamp,
  formatType = 'time',
) => {
  const date = new Date(timestamp);
  const now = new Date();

  // Remove time components to compare only dates
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfYesterday = new Date(startOfToday);
  startOfYesterday.setDate(startOfYesterday.getDate() - 1);

  // Check if the timestamp is today
  if (date >= startOfToday) {
    if (formatType === 'time') {
      const options = { hour: '2-digit', minute: '2-digit', hour12: true };
      return date.toLocaleTimeString([], options);
    }
    return 'Today';
  }

  // Check if the timestamp is yesterday
  if (date >= startOfYesterday) {
    return 'Yesterday';
  }

  // If the message is older than yesterday, show the full date (dd MMM yyyy)
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return date.toLocaleDateString([], options);
};


//${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")} ${ampm}

const participantColors = {};
export const getColorForParticipant = participantId => {
  if (!participantColors[participantId]) {
    const hash = participantId
      ?.split('')
      ?.reduce((acc, char) => char.charCodeAt(0) + ((acc << 5) - acc), 0);
    const hue = hash % 360;
    const isBright = hash % 2 === 0;
    const saturation = isBright ? 70 : 50;
    const lightness = isBright ? 70 : 40;

    const backgroundColor = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
    const textColor = lightness > 50 ? '#000000' : '#FFFFFF';

    participantColors[participantId] = {backgroundColor, textColor};
  }

  return participantColors[participantId];
};

export const debounce = (func, wait) => {
  let timeout;

  return function (...args) {
    const context = this;
    clearTimeout(timeout);  
    timeout = setTimeout(() => {
      func.apply(context, args);
    }, wait);
  };
};

export const debounceIcon = (func, delay, immediate = false) => {
  let timeout;
  return (...args) => {
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      timeout = null;
      if (!immediate) func(...args);
    }, delay);
    if (callNow) func(...args);
  };
};

export function getContentTypeFromMimeType(mimeType) {
  if (!mimeType) return 'unknown';

  const mimeToDescription = {
    // Image types
    'image/jpeg': 'image',
    'image/png': 'image',
    'image/gif': 'image',
    'image/svg+xml': 'image',
    'image/webp': 'image',
    'image/bmp': 'image',
    'image/tiff': 'image',

    // Audio types
    'audio/mpeg': 'audio',
    'audio/wav': 'audio',
    'audio/aac': 'audio',
    'audio/ogg': 'audio',
    'audio/midi': 'audio',

    // Video types
    'video/mp4': 'video',
    'video/x-msvideo': 'video',
    'video/x-matroska': 'video',
    'video/quicktime': 'video',
    'video/x-ms-wmv': 'video',
    'video/webm': 'video',

    // Text types
    'text/plain': 'text',
    'text/html': 'text',
    'text/css': 'text',
    'application/javascript': 'text',
    'text/csv': 'text',

    // Document types
    'application/pdf': 'document',
    'application/msword': 'document',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'document',
    'application/vnd.ms-excel': 'document',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'document',
    'application/vnd.ms-powerpoint': 'document',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation': 'document',

    // Archive types
    'application/zip': 'archive',
    'application/x-rar-compressed': 'archive',
    'application/x-7z-compressed': 'archive',

    // Data types
    'application/json': 'data',
    'application/xml': 'data',
    'application/x-yaml': 'data',
  };

  return mimeToDescription[mimeType.toLowerCase()] || 'unknown';
}

//NAVIGATION FUNCTIONS
export const navigate = (routeName, params) => {
  NavigationService.navigate(routeName, params);
};

export const replace = (routeName, params) => {
  NavigationService.replace(routeName, params);
};

export const goBack = () => {
  NavigationService.back();
};

export const openDrawer = () => {
  NavigationService.openDrawer();
};

export const closeDrawer = () => {
  NavigationService.closeDrawer();
};

export const clearStack = (routeName, params = {}) => {
  NavigationService.clearStack(routeName, params);
};

export const push = (routeName, params = {}) => {
  NavigationService.push(routeName, params);
};

export const forceNavigate = (navigation, routeName) => {
  navigation.dispatch(
    CommonActions.reset({
      index: 0,
      routes: [{ name: routeName }],
    }),
  );
};

export const isPhoneNumber = message => {
  // Extract all possible phone numbers from the message using a regex pattern
  const possibleNumbers = message.match(/\d+/g);

  if (!possibleNumbers) return false; // If no numbers found, return false

  // Loop through all extracted numeric strings to find a valid phone number
  for (let number of possibleNumbers) {
    // Strip out non-numeric characters from the number
    let cleanedMessage = number.replace(/[^\d]/g, '');

    // If the number starts with '91' and has more than 10 digits, remove the '91' prefix
    if (
      (cleanedMessage.length > 10 && cleanedMessage.startsWith('91')) ||
      cleanedMessage.startsWith('+91')
    ) {
      cleanedMessage = cleanedMessage.slice(2); // Remove the first 2 characters (91)
    }

    // Check if the cleaned message contains exactly 10 digits
    const phonePattern = /^\d{10}$/;
    if (phonePattern.test(cleanedMessage)) {
      return cleanedMessage; // Return the valid phone number if found
    }
  }

  return false; // Return false if no valid phone number is found
};

// Helper function to check if the message is a URL
export const isValidURL = message => {
  const urlPattern = new RegExp(
    '^(https?:\\/\\/)?' + // Protocol (optional)
      '((([a-zA-Z\\d]([a-zA-Z\\d-]*[a-zA-Z\\d])*)\\.)+[a-zA-Z]{2,})' + // Domain
      '(\\:\\d+)?(\\/[-a-zA-Z\\d%@_.~+&:]*)*' + // Port and path (optional)
      '(\\?[;&a-zA-Z\\d%@_.,~+&:=-]*)?' + // Query string (optional)
      '(\\#[-a-zA-Z\\d_]*)?$', // Fragment (optional)
  );
  return urlPattern.test(message.trim());
};

// Function to open the phone dialer
export const openPhoneDialer = async phoneNumber => {
  try {
    let formattedNumber = phoneNumber.trim();
    // Ensure the phone number starts with +91 (India country code)
    if (!formattedNumber.startsWith('91')) {
      formattedNumber = '+91' + formattedNumber;
    }
    const url = `tel:${formattedNumber}`;
    if (url) {
      await Linking.openURL(url);
    } else {
      Alert.alert(
        'Unable to open dialer',
        `Can't handle phone number: ${formattedNumber}`,
      );
    }
  } catch (err) {
    console.error('An error occurred', err);
    Alert.alert('Error', 'An error occurred while trying to open the dialer.');
  }
};

// Function to open a link in the browser
export const openLink = async url => {
  try {
    let formattedURL = url.trim();
    if (
      !formattedURL.startsWith('http://') &&
      !formattedURL.startsWith('https://')
    ) {
      formattedURL = 'https://' + formattedURL;
    }

    if (formattedURL) {
      await Linking.openURL(formattedURL);
    } else {
      Alert.alert('Unable to open URL', `Can't handle URL: ${formattedURL}`);
    }
  } catch (err) {
    console.error('An error occurred', err);
    Alert.alert('Error', 'An error occurred while trying to open the URL.');
  }
};

// Function to open a prompt for the user to choose the action
export const promptUserAction = content => {
  Alert.alert(
    'Choose Action',
    'What would you like to do with this content?',
    [
      {
        text: 'Open in Browser',
        onPress: () => openLink(content),
      },
      {
        text: 'Call this Number',
        onPress: () => openPhoneDialer(content),
      },
      {
        text: 'Cancel',
        style: 'cancel',
      },
    ],
    {cancelable: true},
  );
};

export const isImageAttachment = attachment => {
  // console.log("attachment",attachment);

  const imageExtensions = ['.jpeg', '.jpg', '.png', '.gif', '.bmp', '.webp'];
  return imageExtensions.some(ext => attachment?.toLowerCase().endsWith(ext));
};

export const isVideoAttachment = attachment => {
  const videoExtensions = ['.mp4', '.mov', '.avi', '.wmv', '.flv', '.mkv'];
  return videoExtensions.some(ext => attachment?.toLowerCase().endsWith(ext));
};

export const CommonToastMessage = (type, message, description = '') => {
  Toast.show({
    type: type, // 'success', 'error', or 'info'
    text1: message,
    text2: description,
    position: 'top',
    visibilityTime: 2000,
    autoHide: true,
    topOffset: 50,
    // swipeable:true
  });
};

export function convertDateFormat(dateStr) {
  // Check if the dateStr is null, undefined, or empty
  if (!dateStr) return;
  // Split the input date string into components
  const [year, month, day] = dateStr.split('-');
  // Return the reformatted date
  return `${day}-${month}-${year}`;
}

export const truncateText = (text, charLimit) => {
  if (text?.length > charLimit) {
    return text?.slice(0, charLimit) + '...';
  }
  return text;
};

export const toastConfig = {
  success: props => (
    <BaseToast
      {...props}
      style={{borderLeftColor: '#28a745'}}
      contentContainerStyle={{paddingHorizontal: 15}}
      text1Style={{
        fontSize: 16,
        fontWeight: 'bold',
      }}
      text2Style={{
        fontSize: 14,
        color: '#4B5563',
      }}
    />
  ),
  error: props => (
    <ErrorToast
      {...props}
      style={{borderLeftColor: '#FF6F61'}}
      contentContainerStyle={{paddingHorizontal: 15}}
      text1Style={{
        fontSize: 16,
        fontWeight: 'bold',
      }}
      text2Style={{
        fontSize: 14,
        color: '#4B5563',
      }}
    />
  ),
  info: props => (
    <BaseToast
      {...props}
      style={{borderLeftColor: '#1E90FF'}}
      contentContainerStyle={{paddingHorizontal: 15}}
      text1Style={{
        fontSize: 16,
        fontWeight: 'bold',
      }}
      text2Style={{
        fontSize: 14,
        color: '#4B5563',
      }}
    />
  ),
};
import colors from './colors';
import * as SvgIcon from '../assets';

export const MESSAGE_STATUS = {
  read: {
    type: 'svg',
    component: SvgIcon.DoubleCheckIcon,
    color: colors.blue800,
  },
  failed: {
    type: 'svg',
    component: SvgIcon.Wrong,
    color: colors.redA700,
  },
  delivered: {
    type: 'svg',
    component: SvgIcon.DoubleCheckIcon,
    color: colors.green900,
  },
  sent: {
    type: 'svg',
    component: SvgIcon.CheckIcon,
    color: colors.black,
  },
};

export const getDateLabel = dateString => {
  const messageDate = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    // Reset hours to compare just the dates
    const messageDateDay = new Date(
      messageDate.getFullYear(),
      messageDate.getMonth(),
      messageDate.getDate(),
    );
    const todayDay = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
    );
    const yesterdayDay = new Date(
      yesterday.getFullYear(),
      yesterday.getMonth(),
      yesterday.getDate(),
    );

    if (messageDateDay.getTime() === todayDay.getTime()) {
      return 'Today';
    } else if (messageDateDay.getTime() === yesterdayDay.getTime()) {
      return 'Yesterday';
    } else {
      return messageDate.toLocaleDateString();
    }
};

export const formatDateTime = (date, mode = 'date', locale = 'en-US') => {
  // Handle null, undefined, or non-Date inputs
  if (!date) return ''; 

  // Convert input to Date object if it's not already one
  let formattedDate;
  try {
    // Check if input is a time-only string (HH:MM:SS or HH:MM)
    if (typeof date === 'string' && /^\d{1,2}:\d{2}(:\d{2})?$/.test(date)) {
      // Combine with today's date
      const today = new Date();
      const [hours, minutes, seconds] = date.split(':');
      today.setHours(parseInt(hours), parseInt(minutes), seconds ? parseInt(seconds) : 0);
      formattedDate = today;
    } 
    // Check if input is already a Date object
    else if (date instanceof Date) {
      formattedDate = date;
    } 
    // Try to convert to Date
    else {
      formattedDate = new Date(date);
    }

    // Validate the date
    if (isNaN(formattedDate.getTime())) {
      console.warn('Invalid date input:', date);
      return '';
    }
  } catch (error) {
    console.warn('Error converting to date:', error);
    return '';
  }

  if (mode === 'date') {
    const year = date.getFullYear(); // Get full year (YYYY)
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Ensure two digits (MM)
    const day = String(date.getDate()).padStart(2, '0'); // Ensure two digits (DD)
    return `${year}-${month}-${day}`; // Format as YYYY-MM-DD
  }

  if (mode === 'time') {
    return date.toLocaleTimeString(locale, {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false, // 24-hour format
    });
  }

  return `${formatDateTime(date, 'date')} ${formatDateTime(date, 'time')}`; // Combine date and time
};


export const parseResponse = (response) => {
    if (Array.isArray(response)) {
      return {
        results: response,
        hasMore: false,
        total: response.length,
      };
    }
    
    return {
      results: response.results || response.data || [],
      hasMore: response.hasMore ?? false,
      total: response.total || 0,
    };
  };