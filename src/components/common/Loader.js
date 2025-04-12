import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import Colors from '../../theme/colors';
import THEME_COLOR from '../../utils/constant';
import { useTheme } from '../hooks';

const LoadingScreen = ({
  color = Colors.default.accent,
  containerStyle,
  size = 'large',
}) => {
  const {theme} = useTheme();
  const isDarkMode = theme === THEME_COLOR;
  return (
    <View
      style={[
        styles.container,
        containerStyle,
        {backgroundColor: !isDarkMode ? Colors.dark.black : Colors.light.white},
      ]}>
      <ActivityIndicator size={size} color={color} />
    </View>
  );
};

export default LoadingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
