import React, {useEffect, useState} from 'react';
import {Modal, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import THEME_COLOR from '../../utils/constant';
import {useTheme} from '../hooks';
import colors from '../../utils/colors';
import Colors from '../../theme/colors';

const CommonPopupModal = ({
  isVisible,
  message,
  messageText,
  buttons = [],
  onCancel,
}) => {
  const {theme} = useTheme();
  const isDarkMode = theme === THEME_COLOR;
  const [modalVisible, setModalVisible] = useState(isVisible);
  const [isProcessing, setIsProcessing] = useState(false);

  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.8);

  useEffect(() => {
    if (isVisible) {
      setModalVisible(true);
      setIsProcessing(false); // Reset when modal opens
      opacity.value = withTiming(1, {duration: 200});
      scale.value = withSpring(1);
    } else {
      opacity.value = withTiming(0, {duration: 200}, finished => {
        if (finished) {
          runOnJS(setModalVisible)(false);
        }
      });
      scale.value = withTiming(0.8);
    }
  }, [isVisible]);

  const handlePress = async (onPress) => {
    if (isProcessing) return;
    setIsProcessing(true);
    if (typeof onPress === 'function') {
      await onPress();
    }
  };

  const animatedOverlayStyle = useAnimatedStyle(() => ({
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    opacity: opacity.value,
  }));

  const animatedModalStyle = useAnimatedStyle(() => ({
    transform: [{scale: scale.value}],
    opacity: opacity.value,
  }));

  return (
    <Modal
      transparent
      visible={modalVisible}
      animationType="none"
      onRequestClose={onCancel}>
      <Animated.View style={[styles.overlay, animatedOverlayStyle]}>
        <Animated.View
          style={[
            styles.modalContainer,
            animatedModalStyle,
            {
              backgroundColor: isDarkMode ? colors.white : colors.grey900,
            },
          ]}>
          <Text style={[styles.messageText, messageText, {color: isDarkMode ? Colors.dark.black : Colors.light.white}]}>
            {message}
          </Text>
          <View style={styles.buttonContainer}>
            {buttons.map((button, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.button,
                  {backgroundColor: button.color || '#28a745'},
                ]}
                disabled={isProcessing}
                onPress={() => handlePress(button.onPress)}>
                <Text style={styles.buttonText}>{button.text}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 25,
    alignItems: 'center',
    elevation: 10,
  },
  messageText: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: '600',
  },
  buttonContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginHorizontal: 8,
    marginVertical: 5,
    borderRadius: 25,
    alignItems: 'center',
    elevation: 3,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CommonPopupModal;