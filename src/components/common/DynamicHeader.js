import React from 'react';
import { View, StatusBar, StyleSheet, Animated } from 'react-native';
import { spacing } from '../styles/spacing';
import { fontNames } from '../styles/typography';
import { textScale } from '../styles/responsiveStyles';
import Colors from '../theme/colors';
import { HeaderIcon } from '../HeaderIcon';
import TextComponent from './TextComponent';
import { Divider } from '../../styles/commonStyle';
import { HeaderTypes } from '../../constants/headerConstants';

const DynamicHeader = ({
  title,
  mode = HeaderTypes.DEFAULT,
  defaultLeftIcons = [],
  defaultRightIcons = [],
  selectionLeftIcons = [],
  selectionRightIcons = [],
  selectedCount,
  onBackPress,
  onTitlePress,
  theme = 'light',
  style,
  testID
}) => {
  const isDarkMode = theme === 'dark';
  const isSelectionMode = mode === HeaderTypes.SELECTION;

  const colors = {
    background: isDarkMode ? Colors.dark.black : Colors.light.white,
    text: isDarkMode ? Colors.light.white : Colors.dark.black,
    icon: isDarkMode ? Colors.light.grey : Colors.dark.grey,
    selectionIcon: Colors.dark.grey // Icons in selection mode are always grey
  };

  const renderIcons = (icons, position) => {
    return icons.map((icon, index) => (
      <HeaderIcon
        key={`${position}-${index}`}
        Icon={icon.icon}
        onPress={icon.onPress}
        color={isSelectionMode ? colors.selectionIcon : colors.icon}
        style={position === 'left' ? styles.leftIcon : styles.rightIcon}
        testID={`${position}-icon-${index}`}
      />
    ));
  };

  const renderLeftSection = () => {
    if (isSelectionMode) {
      return (
        <>
          {renderIcons(selectionLeftIcons, 'left')}
          <TextComponent
            text={`${selectedCount} Selected`}
            color={colors.text}
            size={textScale(16)}
            font={fontNames.ROBOTO_FONT_FAMILY_BOLD}
            style={styles.selectionText}
          />
        </>
      );
    }

    return renderIcons(defaultLeftIcons, 'left');
  };

  const renderTitle = () => {
    if (isSelectionMode) return null;

    return (
      <TouchableOpacity 
        onPress={onTitlePress} 
        disabled={!onTitlePress}
        style={styles.titleContainer}>
        <TextComponent
          text={title}
          color={colors.text}
          size={textScale(16)}
          font={fontNames.ROBOTO_FONT_FAMILY_BOLD}
          style={styles.title}
        />
      </TouchableOpacity>
    );
  };

  const renderRightSection = () => {
    return renderIcons(
      isSelectionMode ? selectionRightIcons : defaultRightIcons,
      'right'
    );
  };

  return (
    <>
      <StatusBar
        backgroundColor={colors.background}
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
      />
      <View
        style={[
          styles.container,
          { backgroundColor: colors.background },
          style
        ]}
        testID={testID}>
        <View style={styles.leftSection}>{renderLeftSection()}</View>
        <View style={styles.centerSection}>{renderTitle()}</View>
        <View style={styles.rightSection}>{renderRightSection()}</View>
      </View>
      <Divider />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: spacing.HEIGHT_60,
    paddingHorizontal: spacing.MARGIN_6,
  },
  leftSection: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  centerSection: {
    flex: 2,
    alignItems: 'center',
  },
  rightSection: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  titleContainer: {
    alignItems: 'center',
  },
  title: {
    textTransform: 'capitalize',
  },
  selectionText: {
    marginLeft: spacing.MARGIN_16,
  },
  leftIcon: {
    marginRight: spacing.MARGIN_8,
  },
  rightIcon: {
    marginLeft: spacing.MARGIN_8,
  },
});

export default DynamicHeader;