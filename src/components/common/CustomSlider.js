import React, { useRef } from 'react';
import { Dimensions, PanResponder, StyleSheet, View } from 'react-native';
import colors from '../../utils/colors';

const { width } = Dimensions.get('window');

const CustomSlider = ({ value, onValueChange, minimumValue, maximumValue }) => {
  const sliderWidth = width - 40; 
  const thumbWidth = 20;

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        return gestureState.dx !== 0 || gestureState.dy !== 0;
      },
      onPanResponderMove: (evt, gestureState) => {
        const newValue = Math.max(minimumValue, Math.min(maximumValue, (gestureState.moveX - 20) / (sliderWidth - thumbWidth) * (maximumValue - minimumValue) + minimumValue));
        onValueChange(newValue);
      },
    })
  ).current;

  return (
    <View style={styles.container}>
      <View style={styles.track}>
        <View style={[styles.progress, { width: `${((value - minimumValue) / (maximumValue - minimumValue)) * 100}%` }]} />
        <View
          {...panResponder.panHandlers}
          style={[styles.thumb, { left: `${((value - minimumValue) / (maximumValue - minimumValue)) * 100}%` }]}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
  },
  track: {
    width: '100%',
    height: 4,
    backgroundColor: colors.grey400,
    borderRadius: 2,
    position: 'relative',
  },
  progress: {
    height: 4,
    backgroundColor: colors.green600,
    position: 'absolute',
    top: 0,
    left: 0,
    borderRadius: 2,
  },
  thumb: {
    position: 'absolute',
    width: 20,
    height: 20,
    backgroundColor: colors.white,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.green600,
    top: -8, // Center the thumb on the track
  },
});

export default CustomSlider;