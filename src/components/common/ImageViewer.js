import React, { useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  Image,
  Modal,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import ImageViewer from 'react-native-image-zoom-viewer';

const {width, height} = Dimensions.get('window');



const ImageZoomViewer = ({message, thumbnailStyle, baseUrl}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const image = `${baseUrl}${message}`;

  const images = [
    {
      url: image, 
      width: Dimensions.get('window').width, 
      height: Dimensions.get('window').height,
    },
  ];

  return (
    <View>
      {/* Thumbnail */}
      <TouchableOpacity onPress={() => setIsVisible(true)} activeOpacity={0.8}>
        <Image
          source={{uri: image}}
          style={[styles.thumbnail, thumbnailStyle]}
          resizeMode="cover"
          onLoadStart={() => setLoading(true)}
          onLoadEnd={() => setLoading(false)}
        />
        {loading && (
          <ActivityIndicator
            size="large"
            color="#ffffff"
            style={styles.activityIndicator}
          />
        )}
      </TouchableOpacity>

      {/* Full-screen Modal with Zoom Viewer */}
      <Modal
        visible={isVisible}
        transparent={true}
        onRequestClose={() => setIsVisible(false)}
        animationType="fade">
        <View style={styles.modalContainer}>
          {/* Image Viewer */}
          <ImageViewer
            imageUrls={images}
            enableSwipeDown
            onSwipeDown={() => setIsVisible(false)}
            backgroundColor="rgba(0, 0, 0, 0.9)"
            renderIndicator={() => null}
            saveToLocalByLongPress={false}
            enablePreload
            doubleClickInterval={300}
            maxOverflow={0}
            
            renderImage={props => (
              <Image
                {...props}
                style={{width, height, resizeMode: 'contain'}} 
              />
            )}
          />
        </View>
      </Modal>
    </View>
  );
};

export default ImageZoomViewer;

const styles = StyleSheet.create({
  thumbnail: {
    width: width * 0.6,
    height: width * 0.4,
    borderRadius: 10,
    marginVertical: 10,
    backgroundColor: '#ddd',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    borderRadius: 100,
    padding: 10,
    zIndex: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
  },
  closeButtonText: {
    fontSize: 24,
    color: '#000',
  },
  activityIndicator: {
    position: 'absolute',
    alignSelf: 'center',
    top: '50%',
  },
});