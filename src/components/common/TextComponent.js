import React from 'react';
import { Text } from 'react-native';
import { textScale } from '../../styles/responsiveStyles';
import { fontNames } from '../../styles/typography';
import Colors from '../../theme/colors';

const TextComponent = ({
  text,
  color,
  size,
  flex,
  style,
  fontWeight,
  textAlign,
  font = fontNames.ROBOTO_FONT_FAMILY_REGULAR,
  numberOfLines,
  underline,
  lineHeight,
  ...props
}) => {
  const baseTextStyle = {
    color: color || Colors.default.white,
    textDecorationLine: underline ? 'underline' : 'none',
    fontSize: size || textScale(14),
    flex: flex || 0,
    fontWeight: fontWeight || 'normal',
    textAlign: textAlign || 'auto',
    fontFamily: font || fontNames.ROBOTO_FONT_FAMILY_REGULAR,
    lineHeight: lineHeight,
  };

  return (
    <Text
      {...props}
      allowFontScaling={false}
      style={[baseTextStyle, style,]}
      numberOfLines={numberOfLines}>
      {text}
    </Text>
  );
};

export default TextComponent;
