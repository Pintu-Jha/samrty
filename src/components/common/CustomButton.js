import React from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {
  moderateScale,
  scale,
  textScale,
  verticalScale,
} from '../../styles/responsiveStyles';

export default function CustomButton({
  title,
  onPress,
  disabled = false,
  isLoading = false,
  gradientColors = ['#006702', '#006702'],
  gradientStart = {x: 0, y: 0},
  gradientEnd = {x: 1, y: 1},
  iconLeft = null,
  iconRight = null,
  height = 50,
  width,
  borderRadius = 8,
  textColor = '#FFFFFF',
  loadingColor = '#FFFFFF',
  buttonStyle,
  textStyle,
  fontSize = 16,
  fontWeight = '600',
  lineHeightFactor = 1.3,
}) {
  // Scaling for proper button responsiveness
  const scaledHeight = verticalScale(height);
  const scaledWidth = width ? scale(width) : 'auto';
  const scaledBorderRadius = scale(borderRadius);
  const scaledFontSize = textScale(fontSize);
  const scaledLineHeight = moderateScale(scaledFontSize * lineHeightFactor);

  // Button Content
  const renderContent = () => {
    if (isLoading) {
      return (
        <ActivityIndicator
          color={loadingColor}
          size="small"
          style={styles.spinner}
        />
      );
    }
    return (
      <View style={[styles.contentRow]}>
        {iconLeft && <View style={styles.iconWrapperLeft}>{iconLeft}</View>}

        <Text
          style={[
            styles.buttonText,
            {
              fontSize: scaledFontSize,
              lineHeight: scaledLineHeight,
              fontWeight: fontWeight,
              color: textColor,
            },
            textStyle,
          ]}>
          {title}
        </Text>

        {iconRight && <View style={styles.iconWrapperRight}>{iconRight}</View>}
      </View>
    );
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || isLoading}
      activeOpacity={0.8}
      style={[{width: scaledWidth}, buttonStyle]}>
      <LinearGradient
        colors={gradientColors}
        start={gradientStart}
        end={gradientEnd}
        style={[
          styles.gradientBackground,
          {
            height: scaledHeight,
            borderRadius: scaledBorderRadius,
            opacity: disabled ? 0.5 : 1,
          },
        ]}>
        {renderContent()}
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  /** Main Gradient Background */
  gradientBackground: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: scale(16), // Proper padding
    borderWidth: 0, // Ensure no unwanted borders
    elevation: 4, // Android shadow effect
    shadowColor: 'rgba(0, 0, 0, 0.3)', // iOS shadow
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },

  /** Text Row */
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  iconWrapperLeft: {
    marginRight: scale(8), 
    alignItems: 'center',
    justifyContent: 'center',
  },

  iconWrapperRight: {
    marginLeft: scale(8),
    alignItems: 'center',
    justifyContent: 'center',
  },

  /** Text Styles */
  buttonText: {
    textAlign: 'center',
    textTransform: 'capitalize', // Capitalize first letter
    flexShrink:1
  },

  /** Icon Right Wrapper */
  iconWrapper: {
    marginLeft: scale(8), // Space between text and icon
    alignItems: 'center',
    justifyContent: 'center',
  },

  /** Loading Spinner */
  spinner: {
    padding: scale(4),
  },
});
