import React, { forwardRef, useState } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import * as SvgIcon from '../../assets';
import { textScale } from '../../styles/responsiveStyles';
import { spacing } from '../../styles/spacing';
import { fontNames } from '../../styles/typography';
import Colors from '../../theme/colors';
import THEME_COLOR from '../../utils/constant';
import { useTheme } from '../hooks';
import TextComponent from './TextComponent';

const CustomInput = forwardRef((props, ref) => {
  const {
    value,
    placeholder,
    onChange,
    styles,
    type,
    isSecure,
    maxLength,
    autoFocus,
    editable = true,
    error,
    bgColor,
    showFirstChildren = false,
    showSecondChildren = false,
    textAlign,
    inputStyles,
    onFocus,
    placeholderColor,
    fontSize,
    label,
    required,
    onBlur,
    numberOfLines,
    multiline,
    textAlignVertical,
    FirstChildren,
    SecondChildren,
    onPressTextInput,
    onLayout
  } = props;

  const [isShowPass, setIsShowPass] = useState(isSecure);
  const [isFocused, setIsFocused] = useState(false);
  const {theme} = useTheme();
  const isDarkMode = theme === THEME_COLOR;

  return (
    <>
      {label && (
        <View style={style.labelContainer}>
          <TextComponent
            text={label}
            size={textScale(14)}
            fontWeight="500"
            style={{
              marginBottom: 5,
              color: isDarkMode ? Colors.dark.black : Colors.light.white,
            }}
          />
          {required && (
            <TextComponent text="*" size={textScale(18)} color="red" />
          )}
        </View>
      )}

      <TouchableOpacity
        style={[
          style.inputContainer,
          {
            borderColor: error?.exists
              ? Colors.default.error
              : isFocused
              ? Colors.default.accent
              :"#5f5e5e",
            backgroundColor: editable
              ? bgColor
              : isDarkMode
              ? Colors.light.grey
              : Colors.light.greyTransparent,
            borderRadius: spacing.RADIUS_10,
          },
          styles,
        ]}
        onPress={onPressTextInput}
        activeOpacity={0.8} onLayout={onLayout}>
        {showFirstChildren && FirstChildren}
        <TextInput
          allowFontScaling={false}
          keyboardType={type}
          value={value}
          placeholder={isFocused ? undefined : placeholder}
          onChangeText={onChange}
          style={[
            style.input,
            {
              fontSize: fontSize || textScale(16),
              textAlign: textAlign || 'left',
              fontFamily: fontNames.ROBOTO_FONT_FAMILY_REGULAR,
              textAlignVertical: textAlignVertical || 'center',
            },
            inputStyles,
          ]}
          autoCapitalize="none"
          onFocus={() => {
            setIsFocused(true);
            onFocus && onFocus();
          }}
          onBlur={() => {
            setIsFocused(false);
            onBlur && onBlur();
          }}
          maxLength={maxLength}
          autoFocus={autoFocus}
          editable={editable}
          secureTextEntry={isShowPass}
          placeholderTextColor={placeholderColor || Colors.default.grey}
          ref={ref}
          numberOfLines={numberOfLines}
          multiline={multiline}
        />
        {showSecondChildren && SecondChildren}
        {isSecure && (
          <TouchableOpacity onPress={() => setIsShowPass(!isShowPass)}>
            {isShowPass ? (
              <SvgIcon.Eye
                color={
                  isDarkMode
                    ? Colors.default.grey
                    : Colors.default.greyTransparent
                }
              />
            ) : (
              <SvgIcon.CloseEye
                color={
                  isDarkMode
                    ? Colors.default.grey
                    : Colors.default.greyTransparent
                }
              />
            )}
          </TouchableOpacity>
        )}
      </TouchableOpacity>

      {error?.message?.length > 0 ? (
        <TextComponent
          text={error.message}
          color="red"
          size={textScale(12)}
          style={{margin: spacing.MARGIN_4}}
        />
      ) : (
        <View style={{width: '100%', height: spacing.HEIGHT_14}} />
      )}
    </>
  );
});

const style = StyleSheet.create({
  inputContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    paddingVertical: spacing.PADDING_6,
    paddingHorizontal: spacing.PADDING_12,
    borderWidth: 1,
    height: spacing.HEIGHT_46,
    borderColor: Colors.default.grey,
  },
  input: {
    flex: 1,
    height: spacing.HEIGHT_80,
    color: Colors.default.black,
    fontFamily: fontNames.ROBOTO_FONT_FAMILY_REGULAR,
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    marginLeft:spacing.MARGIN_4
  },
});

export default CustomInput;
