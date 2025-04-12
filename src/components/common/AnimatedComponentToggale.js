import React, { useEffect, useState, memo } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Animated, {
  Layout,
  useAnimatedStyle,
  withTiming,
  FadeIn,
  FadeOut,
} from 'react-native-reanimated';
import * as SvgIcon from '../../assets';
import { scale, textScale, verticalScale } from '../../styles/responsiveStyles';
import { spacing } from '../../styles/spacing';
import { fontNames } from '../../styles/typography';
import Colors from '../../theme/colors';
import colors from '../../utils/colors';
import THEME_COLOR from '../../utils/constant';
import { useTheme } from '../hooks';
import TextComponent from './TextComponent';

const AnimatedComponentToggle = ({
  children,
  tabName,
  source = SvgIcon.DownArrow,
  AnimationBtnContainer,
  tabNameStyle,
  leftImage,
  isLeftImg = false,
  isRightIcon = true,
  isActive,
  onPress,
  defaultOpen = false,
  isExtraText = false,
  extraText = '',
  containerStyle,
  btnText,
  extraBtnStyle,
  extraBtnStyleLinearGradient,
  extraBtnStyleText,
  extraBtnStyleonPress,
  descrption,
  gradientColors = ['#4CAF50', '#2E7D32'],
  isEditEnable = false,
  onPressEditIcon,
}) => {
  const isControlled = isActive !== undefined;
  const [isExpanded, setIsExpanded] = useState(isControlled ? false : defaultOpen);
  const { theme } = useTheme();
  const isDarkMode = theme === THEME_COLOR;
  
  // Update internal state when controlled externally
  useEffect(() => {
    if (isControlled) {
      setIsExpanded(isActive);
    }
  }, [isActive, isControlled]);

  // Animation for the arrow rotation
  const rotation = useAnimatedStyle(() => ({
    transform: [
      { rotate: withTiming(isExpanded ? '180deg' : '0deg', { duration: 200 }) },
    ],
  }));

  const handlePress = () => {
    if (isControlled && onPress) {
      onPress();
    } else {
      setIsExpanded(prev => !prev);
    }
  };

  const LeftComponent = isLeftImg ? leftImage : null;
  const RightComponent = isRightIcon ? source : null;

  // Theme-based styling
  const textColor = isDarkMode ? Colors.dark.black : Colors.light.white;
  const iconColor = isDarkMode ? colors.black : colors.white;

  // Render edit button if enabled
  const renderEditButton = () => {
    if (!isEditEnable) return null;
    
    return (
      <TouchableOpacity
        style={styles.editButton}
        onPress={onPressEditIcon}
        accessibilityLabel="Edit"
        accessibilityRole="button"
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
        <SvgIcon.EditIcon color={Colors.default.primaryColor} width={spacing.WIDTH_28} height={spacing.HEIGHT_28}/>
      </TouchableOpacity>
    );
  };

  // Render action button if text is provided
  const renderActionButton = () => {
    if (!btnText) return null;
    
    return (
      <TouchableOpacity
        style={[styles.extraBtnStyle, extraBtnStyle]}
        onPress={extraBtnStyleonPress}
        accessibilityLabel={btnText}
        accessibilityRole="button">
        <LinearGradient
          colors={gradientColors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.extraBtnStyleLinearGradient, extraBtnStyleLinearGradient]}>
          <TextComponent
            text={btnText}
            size={textScale(12)}
            color={Colors.default.white}
            style={extraBtnStyleText}
          />
        </LinearGradient>
      </TouchableOpacity>
    );
  };

  return (
    <>
      <TouchableOpacity
        onPress={handlePress}
        style={[styles.btnContainer, AnimationBtnContainer, containerStyle]}
        activeOpacity={0.8}
        accessibilityRole="button"
        accessibilityState={{ expanded: isExpanded }}
        accessibilityLabel={tabName}>
        <View style={styles.row}>
          {LeftComponent && (
            <LeftComponent
              width={spacing.WIDTH_30}
              height={spacing.HEIGHT_30}
              color={isDarkMode ? Colors.dark.black : colors.white}
            />
          )}
          <View style={styles.column}>
            {isExtraText && (
              <TextComponent
                text={`Task Number: ${extraText}`}
                color={textColor}
                size={textScale(16)}
                font={fontNames.ROBOTO_FONT_FAMILY_BOLD}
                style={styles.extraText}
              />
            )}
            {tabName && (
              <TextComponent
                text={tabName}
                color={textColor}
                font={fontNames.ROBOTO_FONT_FAMILY_BOLD}
                style={[styles.tabNameStyle, tabNameStyle]}
              />
            )}
            {descrption && (
              <TextComponent
                text={descrption}
                color={textColor}
                size={textScale(12)}
                font={fontNames.ROBOTO_FONT_FAMILY_MEDIUM}
              />
            )}
          </View>
        </View>
        <View style={styles.rightContainer}>
          {renderEditButton()}
          {renderActionButton()}
          {RightComponent && (
            <Animated.View style={rotation}>
              <RightComponent
                width={scale(24)}
                height={scale(24)}
                color={iconColor}
              />
            </Animated.View>
          )}
        </View>
      </TouchableOpacity>
      
      {isExpanded && (
        <Animated.View
          style={styles.contentContainer}
          layout={Layout.springify()}
          entering={FadeIn}
          exiting={FadeOut}>
          {children}
        </Animated.View>
      )}
    </>
  );
};

// Use memo to prevent unnecessary re-renders
export default memo(AnimatedComponentToggle);

const styles = StyleSheet.create({
  btnContainer: {
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: spacing.MARGIN_4,
    alignSelf: 'center',
    flexDirection: 'row',
  },
  tabNameStyle: {
    fontSize: textScale(14),
    fontFamily: fontNames.ROBOTO_FONT_FAMILY_BOLD,
    textTransform: 'capitalize',
  },
  contentContainer: {
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '50%',
  },
  column: {
    flexDirection: 'column',
  },
  extraText: {
    marginTop: spacing.MARGIN_8
  },
  extraBtnStyle: {
    width: '50%',
  },
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    width: '50%',
  },
  extraBtnStyleLinearGradient: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: verticalScale(8),
    paddingHorizontal: spacing.PADDING_6,
    borderRadius: scale(8),
  },
  // Function to create dynamic styles
  editButton: {
    marginRight: spacing.MARGIN_6,
    borderRadius: spacing.RADIUS_10,
    opacity: 0.8,
  },
});