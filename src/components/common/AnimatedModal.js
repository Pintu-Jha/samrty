import React, {useEffect} from 'react';
import {
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {spacing} from '../../styles/spacing';
import Colors from '../../theme/colors';
import {
  registerBackHandler,
  unregisterBackHandler,
} from './BackHandlerManager';
import BackDrop from './BackDrop';
import { useTheme } from '../hooks';
import THEME_COLOR from '../../utils/constant'

const {width, height} = Dimensions.get('window');

const AnimatedModal = ({
  isVisible,
  close,
  animationType = 'bottom-to-top',
  children,
  duration = 250,
  left = undefined,
  right = undefined,
  top = undefined,
  bottom = undefined,
  backDropColor = 'rgba(0, 0, 0, 0.5)',
  modalStyle,
  keyboardAvoidingViewProps,
}) => {
  const {theme} = useTheme()
  const isDark  = theme === THEME_COLOR
  const animationValue = useSharedValue(0);

  useEffect(() => {
    animationValue.value = withTiming(isVisible ? 1 : 0, {duration});
  }, [isVisible]);

  useEffect(() => {
    if (isVisible) {
      // Register back handler when modal is visible
      registerBackHandler(handleBackPress);
    } else {
      // Unregister back handler when modal is not visible
      unregisterBackHandler(handleBackPress);
    }

    // Cleanup handler on unmount
    return () => {
      unregisterBackHandler(handleBackPress);
    };
  }, [isVisible]);

  const handleBackPress = () => {
    if (isVisible) {
      close();
      return true;
    }
    return false;
  };

  // Animated style for modal (based on animationType)
  const modalAnimation = useAnimatedStyle(() => {
    let translateX = 0;
    let translateY = 0;

    switch (animationType) {
      case 'bottom-to-top':
        translateY = interpolate(animationValue.value, [0, 1], [height, 0]);
        break;
      case 'top-to-bottom':
        translateY = interpolate(animationValue.value, [0, 1], [-height, 0]);
        break;
      case 'left-to-right':
        translateX = interpolate(animationValue.value, [0, 1], [-width, 0]);
        break;
      case 'right-to-left':
        translateX = interpolate(animationValue.value, [0, 1], [width, 0]);
        break;
    }

    return {
      transform: [{translateX}, {translateY}],
      opacity: animationValue.value,
    };
  });

  // Dynamic style to adjust modal's position
  const modalPosition = {
    left: left !== undefined ? left : 'auto',
    right: right !== undefined ? right : 'auto',
    top: top !== undefined ? top : 'auto',
    bottom: bottom !== undefined ? bottom : 'auto',
  };

  return (
    <>
      <BackDrop
        topAnimation={animationValue}
        openHeight={1}
        closeHeight={0}
        backDropColor={backDropColor}
        close={close}
      />

      {/* Modal Content with Animated Styles */}

      <Animated.View
        style={[
          styles.modal,
          modalAnimation,
          modalPosition,
          modalStyle,
          {backgroundColor: !isDark ? Colors.dark.black : Colors.light.white},
        ]}>
        <KeyboardAvoidingView
          style={[styles.keyboardAvoiding]}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          {...keyboardAvoidingViewProps}>
          <TouchableWithoutFeedback onPress={() => {}}>
            <View style={[styles.contentContainer]}>{children}</View>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </Animated.View>
    </>
  );
};

export default AnimatedModal;

const styles = StyleSheet.create({
  backdrop: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 1,
    flex: 1,
  },
  modal: {
    position: 'absolute',
    alignSelf: 'center',
    borderRadius: 15,
    paddingVertical: spacing.PADDING_20,
    elevation: 5, // Shadow on Android
    shadowColor: '#000', // Shadow on iOS
    shadowOpacity: 0.2,
    shadowOffset: {width: 0, height: 5},
    maxHeight: '100%',
    maxWidth: '100%',
  },
  contentContainer: {
    flexGrow: 1,
  },
  keyboardAvoiding: {
    flex: 1,
  },
});
