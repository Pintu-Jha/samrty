import React from 'react';
import { View, StyleSheet } from 'react-native';
import TextComponent from '../../../common/TextComponent';
import { getDateLabel } from '../../../../utils/helperFunctions';
import { spacing } from '../../../../styles/spacing';
import { textScale } from '../../../../styles/responsiveStyles';
import { fontNames } from '../../../../styles/typography';
import Colors from '../../../../theme/colors';

const DateLabel = ({ date, isDarkMode }) => (
  <View style={styles.container}>
    <TextComponent
      text={getDateLabel(date)}
      color={isDarkMode ? Colors.dark.black : Colors.light.white}
      font={fontNames.ROBOTO_FONT_FAMILY_MEDIUM}
      size={textScale(16)}
    />
  </View>
);

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: spacing.MARGIN_10,
  },
});

export default DateLabel;