import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { fontNames } from '../../styles/typography';
import colors from '../../utils/colors';

const RegularText = ({ children = '', style = {}, ...props }) => {
  return (
    <Text {...props} style={[styles.text, style]}>
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  text: {
    color: colors.black,
    fontFamily: fontNames.POPPINS_FONT_FAMILY_REGULAR,
  },
});

export default RegularText;
