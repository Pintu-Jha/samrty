import React, {useEffect, useMemo, useState} from 'react';
import {Alert, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import FileViewer from 'react-native-file-viewer';
import RNFS from 'react-native-fs';
import CircularProgress from '../components/common/CircularProgress';
import TextComponent from '../components/common/TextComponent';
import {useTheme} from '../components/hooks';
import {textScale} from '../styles/responsiveStyles';
import {spacing} from '../styles/spacing';
import Colors from '../theme/colors';
import THEME_COLOR from '../utils/constant';
import CacheManager from './cacheManager';
import {
  checkFileExists,
  formatFileSize,
  getDisplayFileName,
  getFileExtension,
  getFileIcon,
  getFileInfo,
  getFilePath,
  getMimeType,
  isAudioFile,
} from './fileUtils';
import {truncateText} from './helperFunctions';
import {requestStoragePermission} from './permissionsUtils';

const FilePreview = ({
  filename,
  fileSize,
  loading,
  progress,
  onPress,
  customStyles,
  isIncoming,
}) => {
  const {theme} = useTheme();
  const isDarkMode = theme === THEME_COLOR;
  const IconComponent = getFileIcon(filename);
  const displayName = getDisplayFileName(filename);
  const displayType = getFileExtension(filename);

  return (
    <TouchableOpacity
      style={[
        styles.fileContainer,
        customStyles?.fileContainer,
        [
          {
            backgroundColor: isDarkMode
              ? Colors.default.messageOutgoing
              : Colors.default.messageOutgoingDark,
          },
        ],
      ]}
      onPress={onPress}>
      <View style={styles.fileContent}>
        <View style={styles.iconContainer}>
          {loading ? (
            <View style={styles.loaderContainer}>
              <CircularProgress progress={progress} />
              {/* Optional: Show percentage in the middle */}
              <TextComponent
                text={Math.round(progress)}
                style={styles.progressPercentage}
                color={isDarkMode ? Colors.dark.black : Colors.light.white}
              />
            </View>
          ) : (
            <IconComponent width={40} height={40} />
          )}
        </View>
        <View style={styles.fileInfo}>
          <TextComponent
            text={truncateText(displayName, 15)}
            numberOfLines={1}
            color={isDarkMode ? Colors.dark.black : Colors.light.white}
          />
          <TextComponent
            text={`${
              fileSize > 0 ? formatFileSize(fileSize) + ' • ' : ''
            }${displayType}`}
            color={isDarkMode ? Colors.dark.black : Colors.light.white}
          />
        </View>
      </View>
    </TouchableOpacity>
  );
};

const URLFileHandler = ({url, customStyles, isIncoming}) => {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);
  const [downloadedFile, setDownloadedFile] = useState(null);

  // Detect file type and determine if it's an attachment
  const fileTypeInfo = useMemo(() => {
    const isFileUrl = url?.startsWith('/files/');
    const filename = url?.split('/').pop() || '';

    // Handle vnd format and hashed filenames
    let fileExtension;
    if (filename.includes('vnd.openxmlformats-officedocument')) {
      fileExtension = 'docx';
    } else {
      fileExtension = filename.split('.').pop()?.toLowerCase();
    }

    const documentExtensions = [
      'pdf',
      'doc',
      'docx',
      'xls',
      'xlsx',
      'ppt',
      'pptx',
      'txt',
      'rtf',
      'xml',
      'document',
    ];
    const mediaExtensions = [
      'jpeg',
      'jpg',
      'png',
      'mp4',
      'mov',
      'avi',
      'wmv',
      'flv',
      'mkv',
    ];

    const isDocument =
      documentExtensions.includes(fileExtension) ||
      filename.includes('vnd.openxmlformats-officedocument');
    const isMedia = mediaExtensions.includes(fileExtension);
    const isAttachment = isFileUrl || isDocument || isMedia;

    let mimeType = getMimeType(filename);
    if (
      filename.includes(
        'vnd.openxmlformats-officedocument.wordprocessingml.document',
      )
    ) {
      mimeType =
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
    }

    return {
      isAttachment,
      isAudio: isAudioFile(filename),
      isDocument,
      extension: fileExtension,
      mimeType: mimeType || '*/*',
      originalFilename: filename,
    };
  }, [url]);

  // Generate a unique cache key for this URL
  const getCacheKey = url => `downloaded_file_${encodeURIComponent(url)}`;

  // Check for previously downloaded file on component mount
  useEffect(() => {
    const checkExistingFile = async () => {
      try {
        const cacheKey = getCacheKey(url);
        const cachedData = await CacheManager.get(cacheKey, 'storage');

        if (cachedData) {
          const {data: fileInfo} = cachedData;
          const fileExists = await checkFileExists(fileInfo.path);

          if (fileExists) {
            setDownloadedFile(fileInfo);
          } else {
            await CacheManager.clear('storage');
          }
        }
      } catch (error) {
        console.error('Error checking existing file:', error);
      }
    };

    if (fileTypeInfo.isAttachment) {
      checkExistingFile();
    }
  }, [url, fileTypeInfo.isAttachment]);

  // Get appropriate directory based on file type
  const getAppropriateDirectory = () => {
    if (fileTypeInfo.isImage || fileTypeInfo.isVideo) {
      return 'downloads';
    }
    return 'documents';
  };

  // Download and open file
  const handleFileDownload = async () => {
    try {
      if (downloadedFile) {
        openFile(downloadedFile.path, downloadedFile.name);
        return;
      }

      const hasPermission = await requestStoragePermission();
      if (!hasPermission) {
        Alert.alert(
          'Permission Denied',
          'Storage permission is required to download files',
        );
        return;
      }

      setLoading(true);
      setError(null);

      const filename = url.split('/').pop();
      const directory = getAppropriateDirectory();
      const filePath = getFilePath(filename, directory);

      const fileExists = await checkFileExists(filePath);
      if (fileExists) {
        console.log('File exists:', filePath);
        const fileInfo = await getFileInfo(filePath);
        await saveToCache(fileInfo);
        openFile(filePath, filename);
        return;
      }

      const downloadUrl = url.startsWith('/files/') ? `${BASE_URL}${url}` : url;

      const response = await RNFS.downloadFile({
        fromUrl: downloadUrl,
        toFile: filePath,
        progress: response => {
          const progressPercent =
            (response.bytesWritten / response.contentLength) * 100;
          setProgress(progressPercent);
        },
      }).promise;

      if (response.statusCode === 200) {
        const fileInfo = await getFileInfo(filePath);
        await saveToCache(fileInfo);
        openFile(filePath, filename);
      } else {
        throw new Error('Download failed');
      }
    } catch (error) {
      console.error('Download error:', error);
      setError('Failed to download file: ' + error.message);
      Alert.alert('Error', 'Failed to download file');
    } finally {
      setLoading(false);
      setProgress(0);
    }
  };

  // Save file info to cache
  const saveToCache = async fileInfo => {
    try {
      const cacheKey = getCacheKey(url);
      await CacheManager.set(cacheKey, fileInfo, 'storage');
    } catch (error) {
      console.error('Error saving to cache:', error);
    }
  };

  // Open file with enhanced mime type detection
  const openFile = async (filePath, filename) => {
    try {
      console.log('Opening file:', filePath);

      const options = {
        showOpenWithDialog: true,
        showAppsSuggestions: true,
        type: fileTypeInfo.mimeType,
      };

      await FileViewer.open(filePath, options);

      const fileInfo = await getFileInfo(filePath);
      setDownloadedFile(fileInfo);
    } catch (error) {
      console.error('Open file error:', error);
      setError('Failed to open file: ' + error.message);
      Alert.alert(
        'Error',
        `Failed to open file. Please make sure you have an appropriate viewer for this file type.`,
      );
    }
  };

  if (!fileTypeInfo.isAttachment) {
    return null;
  }

  return (
    <View style={[styles.container, customStyles?.container]}>
      {error && (
        <Text style={[styles.error, customStyles?.error]}>{error}</Text>
      )}

      <FilePreview
        filename={url?.split('/').pop() || ''}
        fileSize={downloadedFile?.size || 0}
        fileType={fileTypeInfo.extension?.toUpperCase() || 'DOCUMENT'}
        loading={loading}
        progress={progress}
        onPress={handleFileDownload}
        customStyles={customStyles}
        isIncoming={isIncoming}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: spacing.PADDING_8,
  },
  fileContainer: {
    borderRadius: spacing.RADIUS_12,
    padding: spacing.PADDING_12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: spacing.MARGIN_4,
  },
  fileContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: spacing.WIDTH_48,
    height: spacing.HEIGHT_48,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.MARGIN_12,
  },
  fileInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  fileName: {
    color: '#FFFFFF',
    fontSize: textScale(16),
    fontWeight: '500',
    marginBottom: spacing.MARGIN_6,
  },
  fileDetails: {
    color: '#8E8E93',
    fontSize: textScale(12),
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: spacing.PADDING_8,
  },
  progressText: {
    color: '#8E8E93',
    fontSize: textScale(12),
    marginLeft: spacing.MARGIN_8,
  },
  statusContainer: {
    paddingLeft: spacing.PADDING_8,
  },
  error: {
    color: '#FF3B30',
    textAlign: 'center',
    marginVertical: spacing.MARGIN_10,
  },
  loaderContainer: {
    position: 'relative',
    width: spacing.WIDTH_48,
    height: spacing.HEIGHT_48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressPercentage: {
    position: 'absolute',
    color: '#FFFFFF',
    fontSize: textScale(10),
    fontWeight: '500',
  },
});

export default URLFileHandler;
