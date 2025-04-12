import React, {useEffect} from 'react';
import {StatusBar, StyleSheet, TouchableOpacity, View} from 'react-native';
import THEME_COLOR from '../../utils/constant';
import colors from '../../utils/colors';
import {textScale} from '../../styles/responsiveStyles';
import {spacing} from '../../styles/spacing';
import {fontNames} from '../../styles/typography';
import Colors from '../../theme/colors';
import {useTheme} from '../hooks';
import {registerBackHandler, unregisterBackHandler} from './BackHandlerManager';
import TextComponent from './TextComponent';
import { Divider } from '../../styles/commonStyle';

const CommonToolBar = ({
  title,
  count,
  onBackPress,
  showLeftIcons = false,
  leftIcons = [],
  onLeftIconPress = () => {},
  showRightIcons = false,
  rightIcons = [],
  onRightIconPress = () => {},
  onTitlePress,
}) => {
  const {theme} = useTheme();
  const isDarkMode = theme === THEME_COLOR;

  useEffect(() => {
    const handleBackPress = () => {
      if (onBackPress) {
        onBackPress();
        return true;
      }
      return false;
    };

    registerBackHandler(handleBackPress);

    return () => {
      unregisterBackHandler(handleBackPress);
    };
  }, [onBackPress]);

  // Render all left icons, including the back button if needed
  const renderLeftIcons = () => {
    const iconsToRender = [...leftIcons];

    return iconsToRender.map((item, index) => {
      const IconComponent = item;
      const handlePress = () => onLeftIconPress(index);

      return (
        <TouchableOpacity
          key={index}
          onPress={handlePress}
          hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
          style={{margin: spacing.MARGIN_10}}>
          <IconComponent
            width={spacing.WIDTH_24}
            height={spacing.HEIGHT_24}
            color={isDarkMode ? Colors.dark.grey : Colors.light.grey}
          />
        </TouchableOpacity>
      );
    });
  };

  const renderRightIcons = () => {
    return rightIcons.map((Icon, index) => (
      <TouchableOpacity
        key={index}
        onPress={() => onRightIconPress(index)}
        hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
        style={{marginRight: spacing.MARGIN_10}}>
        <Icon
          width={spacing.WIDTH_24}
          height={spacing.HEIGHT_24}
          color={isDarkMode ? Colors.dark.grey : Colors.light.grey}
        />
      </TouchableOpacity>
    ));
  };

  return (
    <>
      <View
        style={[
          styles.topBar,
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
          {showLeftIcons && renderLeftIcons()}
          {count !== undefined && (
            <TextComponent
              text={count}
              color={isDarkMode ? Colors.dark.black : Colors.light.white}
              size={textScale(16)}
              font={fontNames.ROBOTO_FONT_FAMILY_BOLD}
              style={{marginLeft: spacing.MARGIN_16}}
            />
          )}
        </View>

        {/* Title Section */}
        <View style={styles.titleContainer}>
          {title && (
            <TouchableOpacity onPress={onTitlePress}>
              <TextComponent
                text={title}
                color={isDarkMode ? Colors.dark.black : Colors.light.white}
                size={textScale(16)}
                font={fontNames.ROBOTO_FONT_FAMILY_MEDIUM}
                style={{textTransform: 'capitalize'}}
              />
            </TouchableOpacity>
          )}
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

export default CommonToolBar;

const styles = StyleSheet.create({
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: spacing.HEIGHT_60,
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectedMessageCountStyle: {
    fontSize: textScale(16),
    fontFamily: fontNames.ROBOTO_FONT_FAMILY_BOLD,
    color: colors.black,
    marginLeft: spacing.MARGIN_16,
  },
  titleStyle: {
    fontSize: textScale(16),
    textTransform: 'capitalize',
    color: colors.black,
    fontFamily: fontNames.POPPINS_FONT_FAMILY_MEDIUM,
  },
});
