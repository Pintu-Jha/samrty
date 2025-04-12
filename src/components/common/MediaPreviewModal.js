import React from 'react';
import { View, Image, Modal, StyleSheet, TouchableOpacity, Text } from 'react-native';

const MediaPreviewModal = ({
  visible,
  media,
  onConfirm,
  onCancel,
}) => {
  return (
    <Modal visible={visible} transparent={true} animationType="slide">
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onCancel} style={styles.closeButton}>
            {/* <Image source={require('./assets/close_icon.png')} style={styles.icon} /> */}
          </TouchableOpacity>
          <Text style={styles.title}>Preview</Text>
        </View>
        {media && media.uri && (
          <View style={styles.imageContainer}>
            <Image source={{ uri: media.uri }} style={styles.image} resizeMode="contain" />
          </View>
        )}
        <View style={styles.footer}>
          <TouchableOpacity style={styles.actionButton} onPress={onConfirm}>
            {/* <Image source={require('./assets/send_icon.png')} style={styles.icon} /> */}
            <Text style={styles.buttonText}>Send</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={onCancel}>
            {/* <Image source={require('./assets/cancel_icon.png')} style={styles.icon} /> */}
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    backgroundColor: '#fff',
  },
  closeButton: {
    padding: 5,
  },
  title: {
    color: '#000',
    fontSize: 20,
    fontWeight: '600',
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 20,
    borderRadius: 10,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 20,
    backgroundColor: '#fff',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007bff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginHorizontal: 10,
  },
  icon: {
    width: 24,
    height: 24,
    marginRight: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default MediaPreviewModal;
