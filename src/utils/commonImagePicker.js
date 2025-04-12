// import ImagePicker from 'react-native-image-crop-picker';
import DocumentPicker from 'react-native-document-picker';
import RNFS from 'react-native-fs';
import { getContentTypeFromMimeType } from '../utils/helperFunctions';

async function getBase64(fileUri) {
  try {
    const base64String = await RNFS.readFile(fileUri, 'base64');
    return base64String;
  } catch (error) {
    console.error('Error reading file:', error);
    throw error;
  }
}


export const pickAndSendMediaMessage = async (
  fileTypes = ['*/*']
) => {
  try {
    const res = await DocumentPicker.pickSingle({
      type: fileTypes,
    });

    if (!res) {
      return { status: 'no_document' };
    }

    const { uri, type, name } = res;
    if (!uri || !type || !name) {
      return { status: 'incomplete_details', data: res };
    }

    // Convert the file to a base64 string
    const base64String = await getBase64(uri); // Assuming getBase64 is defined elsewhere

    // Get the file extension based on the MIME type
    const fileExtension = getContentTypeFromMimeType(type);
    const selectedFile = {
      uri, // File URI
      type, // MIME type (e.g., image/jpeg)
      name, // File name (e.g., myphoto.jpg)
      base64String, // Base64-encoded string
      fileExtension, // File extension (e.g., jpeg or mp4)
    };

    return { status: 'success', data: selectedFile };

  } catch (error) {
    if (DocumentPicker.isCancel(error)) {
      return { status: 'cancelled' }; // Indicate cancellation to the caller
    } else {
      return { status: 'error', error }; // Return the error to the caller
    }
  }
};

