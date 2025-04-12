// src/utils/FileUtils.js
import {Platform} from 'react-native';
import RNFS from 'react-native-fs';
import * as SvgIcon from '../assets';
import {requestStoragePermission} from './permissionsUtils';

export const FileTypes = {
  PDF: {
    mime: 'application/pdf',
    icon: SvgIcon.Pdf,
  },
  DOC: {
    mime: 'application/msword',
    icon: SvgIcon.MSWORD,
  },
  DOCX: {
    mime: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    icon: SvgIcon.DOCX,
  },
  XLS: {
    mime: 'application/vnd.ms-excel',
    icon: SvgIcon.XLS,
  },
  XLSX: {
    mime: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    icon: SvgIcon.XLSX,
  },
  PPT: {
    mime: 'application/vnd.ms-powerpoint',
    icon: SvgIcon.PPT,
  },
  PPTX: {
    mime: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    icon: SvgIcon.PPTX,
  },
  TXT: {
    mime: 'text/plain',
    icon: SvgIcon.TXT,
  },
  RTF: {
    mime: 'application/rtf',
    icon: SvgIcon.RTF,
  },
  XML: {
    mime: 'application/xml',
    icon: SvgIcon.XML,
  },
  MP4: {
    mime: 'video/mp4',
    icon: SvgIcon.MP4,
  },
  MP3: {
    mime: 'audio/mpeg',
    icon: SvgIcon.MP3,
  },
  DOCUMENT: {
    mime: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    icon: SvgIcon.DOCX,
  },
};

export const getFileExtension = (filename) => {
  if (!filename) return '';
  
  // Handle special case for vnd format
  if (filename.includes('vnd.openxmlformats-officedocument')) {
    if (filename.includes('wordprocessingml')) return 'DOCX';
    if (filename.includes('spreadsheetml')) return 'XLSX';
    if (filename.includes('presentationml')) return 'PPTX';
    return 'DOCUMENT';
  }
  
  const ext = filename.split('.').pop()?.toUpperCase() || '';
  return ext;
};

export const getMimeType = filename => {
  const ext = getFileExtension(filename);
  return FileTypes[ext.toUpperCase()]?.mime || '*/*';
};

export const getFileIcon = (filename) => {
  const ext = getFileExtension(filename);
  const fileType = FileTypes[ext];
  
  if (!fileType) {
    // Check for special cases
    if (filename.includes('vnd.openxmlformats-officedocument')) {
      if (filename.includes('wordprocessingml')) return FileTypes.DOCX.icon;
      if (filename.includes('spreadsheetml')) return FileTypes.XLSX.icon;
      if (filename.includes('presentationml')) return FileTypes.PPTX.icon;
    }
    return FileTypes.DOCUMENT.icon; // Default icon
  }
  
  return fileType.icon;
};

export const getDisplayFileName = (filename) => {
  if (!filename) return 'Unknown File';
  
  // Handle vnd format filenames
  if (filename.includes('vnd.openxmlformats-officedocument')) {
    if (filename.includes('wordprocessingml')) return 'Document.docx';
    if (filename.includes('spreadsheetml')) return 'Spreadsheet.xlsx';
    if (filename.includes('presentationml')) return 'Presentation.pptx';
    return 'Document';
  }

  // Handle hashed filenames
  if (filename.match(/^[a-f0-9]{32,}\./)) {
    const extension = filename.split('.').pop();
    return `File.${extension}`;
  }

  // Remove any URL parameters
  const cleanFilename = filename.split('?')[0];
  
  // Decode URI component if it's encoded
  try {
    return decodeURIComponent(cleanFilename.split('/').pop());
  } catch (e) {
    return cleanFilename.split('/').pop();
  }
};

export const isImageFile = filename => {
  const ext = getFileExtension(filename);
  return ['jpg', 'jpeg', 'png', 'gif'].includes(ext.toLowerCase());
};

export const isVideoFile = filename => {
  const ext = getFileExtension(filename);
  return ['mp4', 'mov', 'avi', 'mkv'].includes(ext.toLowerCase());
};

export const isAudioFile = filename => {
  const ext = getFileExtension(filename);
  return ['mp3', 'wav', 'aac', 'm4a'].includes(ext.toLowerCase());
};

export const getFilePath = (filename, directory = 'documents') => {
  switch (directory.toLowerCase()) {
    case 'downloads':
      return Platform.OS === 'android'
        ? `${RNFS.DownloadDirectoryPath}/${filename}`
        : `${RNFS.DocumentDirectoryPath}/${filename}`;
    case 'cache':
      return `${RNFS.CachesDirectoryPath}/${filename}`;
    case 'temp':
      return `${RNFS.TemporaryDirectoryPath}/${filename}`;
    case 'documents':
    default:
      return `${RNFS.DocumentDirectoryPath}/${filename}`;
  }
};

export const formatFileSize = bytes => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const checkFileExists = async filePath => {
  try {
    return await RNFS.exists(filePath);
  } catch (error) {
    console.error('Error checking file:', error);
    return false;
  }
};

export const deleteFile = async filePath => {
  try {
    const exists = await checkFileExists(filePath);
    if (exists) {
      await RNFS.unlink(filePath);
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error deleting file:', error);
    throw error;
  }
};

export const createDirectory = async dirPath => {
  try {
    const hasPermission = await requestStoragePermission();
    if (!hasPermission) {
      throw new Error('Storage permission denied');
    }

    const exists = await RNFS.exists(dirPath);
    if (!exists) {
      await RNFS.mkdir(dirPath);
    }
    return true;
  } catch (error) {
    console.error('Error creating directory:', error);
    throw error;
  }
};

export const moveFile = async (sourcePath, destPath) => {
  try {
    const hasPermission = await requestStoragePermission();
    if (!hasPermission) {
      throw new Error('Storage permission denied');
    }

    await RNFS.moveFile(sourcePath, destPath);
    return true;
  } catch (error) {
    console.error('Error moving file:', error);
    throw error;
  }
};

export const copyFile = async (sourcePath, destPath) => {
  try {
    const hasPermission = await requestStoragePermission();
    if (!hasPermission) {
      throw new Error('Storage permission denied');
    }

    await RNFS.copyFile(sourcePath, destPath);
    return true;
  } catch (error) {
    console.error('Error copying file:', error);
    throw error;
  }
};

export const getFileInfo = async filePath => {
  try {
    const hasPermission = await requestStoragePermission();
    if (!hasPermission) {
      throw new Error('Storage permission denied');
    }

    const stats = await RNFS.stat(filePath);
    const filename = filePath.split('/').pop();
    const extension = getFileExtension(filename);

    return {
      ...stats,
      name: filename,
      extension,
      mimeType: getMimeType(filename),
      icon: getFileIcon(filename),
      isImage: isImageFile(filename),
      isVideo: isVideoFile(filename),
      isAudio: isAudioFile(filename),
      formattedSize: formatFileSize(stats.size),
    };
  } catch (error) {
    console.error('Error getting file info:', error);
    throw error;
  }
};
