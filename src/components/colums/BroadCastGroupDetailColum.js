import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Divider} from '../../styles/commonStyle';
import {textScale} from '../../styles/responsiveStyles';
import {spacing} from '../../styles/spacing';
import {fontNames} from '../../styles/typography';
import Colors from '../../theme/colors';
import colors from '../../utils/colors';
import THEME_COLOR from '../../utils/constant';
import TextComponent from '../common/TextComponent';
import {useTheme} from '../hooks';

const BroadCastGroupDetailColum = ({item}) => {
  const {theme} = useTheme();
  const isDarkMode = theme === THEME_COLOR;

  return (
    <>
      <View style={[styles.container]}>
        {item?.contact_name && (
          <TextComponent
            text={item?.contact_name || 'No Name'}
            color={isDarkMode ? Colors.dark.black : Colors.light.white}
            size={textScale(18)}
            font={fontNames.ROBOTO_FONT_FAMILY_BOLD}
          />
        )}
        {item?.mobile_no && (
          <TextComponent
            text={item?.mobile_no || 'No Mobile Number'}
            color={isDarkMode ? Colors.dark.black : Colors.light.white}
            size={textScale(14)}
            font={fontNames.ROBOTO_FONT_FAMILY_BOLD}
            style={{opacity: 0.8, marginBottom: spacing.MARGIN_2}}
          />
        )}
        {item?.group_member && (
          <TextComponent
            text={`👥 Group Member: ${item?.group_member || 'Not Available'}`}
            color={isDarkMode ? Colors.dark.black : Colors.light.white}
            size={textScale(14)}
            font={fontNames.ROBOTO_FONT_FAMILY_BOLD}
            style={{opacity: 0.6, marginBottom: spacing.MARGIN_2}}
          />
        )}

        <TextComponent
          text={item?.enable === 1 ? 'Active' : 'Inactive'}
          color={
            item?.enable === 1 ? Colors.default.accent : Colors.default.error
          }
          size={textScale(14)}
          font={fontNames.ROBOTO_FONT_FAMILY_BOLD}
          style={{opacity: 0.6, marginTop: spacing.MARGIN_6}}
          textAlign={'left'}
        />
      </View>
      <Divider />
    </>
  );
};

export default BroadCastGroupDetailColum;

const styles = StyleSheet.create({
  container: {
    paddingVertical: spacing.PADDING_4,
    paddingHorizontal: spacing.PADDING_16,
    marginVertical: spacing.MARGIN_4,
  },
  containerLight: {
    borderBottomColor: colors.grey200,
  },
  containerDark: {
    borderBottomColor: colors.grey900,
  },
  contactName: {
    fontSize: textScale(18),
    marginBottom: spacing.MARGIN_4,
    fontFamily: fontNames.ROBOTO_FONT_FAMILY_BOLD,
  },
  contactNameLight: {
    color: colors.black,
  },
  contactNameDark: {
    color: colors.white,
  },
  text: {
    fontSize: textScale(14),
    marginBottom: 2,
  },
  textLight: {
    color: colors.grey900,
  },
  textDark: {
    color: colors.grey200,
  },
  status: {
    marginTop: spacing.MARGIN_8,
    fontSize: textScale(14),
    fontWeight: 'bold',
    textAlign: 'left',
  },
  activeStatus: {
    color: '#155724',
  },
  inactiveStatus: {
    color: '#721c24',
  },
  activeStatusDark: {
    color: '#a5d6a7',
  },
  inactiveStatusDark: {
    color: '#ef9a9a',
  },
});
