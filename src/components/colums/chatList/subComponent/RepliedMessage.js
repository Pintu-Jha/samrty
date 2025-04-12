import React from 'react';
import { View, StyleSheet } from 'react-native';
import TextComponent from '../../../common/TextComponent';
import Colors from '../../../../theme/colors';
import { spacing } from '../../../../styles/spacing';
import { textScale } from '../../../../styles/responsiveStyles';
import { fontNames } from '../../../../styles/typography';
import colors from '../../../../utils/colors';

const RepliedMessage = ({ message, sentBy, isIncoming, isDarkMode }) => (
  <View style={[
    styles.container,
    {
      backgroundColor: isIncoming 
        ? isDarkMode ? '#d1f4cc' : '#128C7E'
        : isDarkMode ? colors.white : colors.grey700,
    },
  ]}>
    {isIncoming && (
      <TextComponent
        text={`Sent by: ${sentBy}`}
        size={textScale(12)}
        font={fontNames.ROBOTO_FONT_FAMILY_BOLD}
        color={isDarkMode ? Colors.dark.black : Colors.light.white}
        style={styles.sentBy}
      />
    )}
    <TextComponent
      text={message}
      size={textScale(14)}
      font={fontNames.ROBOTO_FONT_FAMILY_REGULAR}
      style={styles.repliedText}
      color={isDarkMode ? Colors.dark.grey : Colors.light.white}
      numberOfLines={3}
      ellipsizeMode="tail"
    />
  </View>
);

const styles = StyleSheet.create({
  container: {
    borderRadius: spacing.RADIUS_6,
    paddingVertical: spacing.PADDING_8,
    paddingHorizontal: spacing.PADDING_10,
  },
  sentBy: {
    opacity: 0.7,
    flexWrap: 'wrap',
  },
  repliedText: {
    borderLeftWidth: 4,
    borderLeftColor: 'blue',
    paddingLeft: spacing.PADDING_8,
    opacity: 0.6,
  },
});

export default RepliedMessage;