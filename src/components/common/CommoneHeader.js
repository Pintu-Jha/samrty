import React from 'react';
import {StatusBar, StyleSheet, TouchableOpacity, View} from 'react-native';
import * as SvgIcon from '../../assets';
import {textScale} from '../../styles/responsiveStyles';
import {spacing} from '../../styles/spacing';
import {fontNames} from '../../styles/typography';
import Colors from '../../theme/colors';
import colors from '../../utils/colors';
import THEME_COLOR from '../../utils/constant';
import {useTheme} from '../hooks';
import TextComponent from './TextComponent';
import {Divider} from '../../styles/commonStyle';

const CustomHeader = ({
  title,
  showLeftIcon = false,
  onLeftIconPress,
  leftIcon = SvgIcon.BackIcon,
  showRightIcons = false,
  rightIcons = [],
  onRightIconPress = () => {},
  showNumber = false,
  number,
  onTitlePress,
  activeFilterIndex = null, // New prop for active filter index
}) => {
  const {theme} = useTheme();
  const isDarkMode = theme === THEME_COLOR;
  const LeftComponent = showLeftIcon && leftIcon ? leftIcon : null;

  const renderRightIcons = () => {
    return rightIcons.map((Icon, index) => {
      // Determine if this icon is active
      const isActive = activeFilterIndex === index;
      // Set the icon color based on its active state
      const iconColor = isActive
        ? Colors.default.accent // You can define this in your Colors file
        : isDarkMode
        ? Colors.dark.black
        : Colors.light.white;
      return (
        <TouchableOpacity
          key={index}
          onPress={() => onRightIconPress(index)}
          hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
          style={{marginLeft: spacing.MARGIN_10}}>
          <Icon
            width={spacing.WIDTH_24}
            height={spacing.HEIGHT_24}
            color={iconColor}
          />
        </TouchableOpacity>
      );
    });
  };

  return (
    <>
      <View
        style={[
          styles.headerContainer,
          {
            backgroundColor: isDarkMode
              ? Colors.light.white
              : Colors.dark.black,
          },
        ]}>
        <StatusBar
          backgroundColor={isDarkMode ? Colors.light.white : Colors.dark.black}
          barStyle={isDarkMode ? 'dark-content' : 'light-content'}
        />
        {/* Left Section */}
        <View style={styles.leftContainer}>
          {LeftComponent && (
            <TouchableOpacity
              onPress={onLeftIconPress}
              style={{
                marginVertical: spacing.MARGIN_16,
                padding: spacing.PADDING_10,
              }}
              hitSlop={{
                top: spacing.HEIGHT_28,
                bottom: spacing.HEIGHT_28,
                left: spacing.WIDTH_28,
                right: spacing.WIDTH_28,
              }}>
              <LeftComponent
                width={spacing.WIDTH_24}
                height={spacing.HEIGHT_24}
                color={isDarkMode ? Colors.dark.black : Colors.light.white}
              />
            </TouchableOpacity>
          )}
          <TouchableOpacity
            onPress={onTitlePress}
            hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
            style={{marginLeft: spacing.MARGIN_14}}>
            <TextComponent
              text={title}
              color={isDarkMode ? Colors.dark.black : Colors.light.white}
              size={textScale(16)}
              font={fontNames.ROBOTO_FONT_FAMILY_BOLD}
              style={{textTransform: 'capitalize'}}
            />
            {showNumber && (
              <TextComponent
                text={number}
                color={isDarkMode ? Colors.dark.black : Colors.light.white}
              />
            )}
          </TouchableOpacity>
        </View>

        {/* Right Section */}
        <View style={styles.rightContainer}>
          {showRightIcons && renderRightIcons()}
        </View>
      </View>
      <Divider />
    </>
  );
};

export default CustomHeader;


const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',

    height: spacing.HEIGHT_60,
    paddingHorizontal: spacing.MARGIN_6,
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  titleStyle: {
    fontSize: textScale(16),
    textTransform: 'capitalize',
    color: colors.black,
    fontFamily: fontNames.ROBOTO_FONT_FAMILY_BOLD,
  },
  numberStyle: {
    fontSize: textScale(14),
    color: colors.black,
    fontFamily: fontNames.POPPINS_FONT_FAMILY_MEDIUM,
  },
});
