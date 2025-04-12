import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import NavigationString from '../../navigations/navigationString';
import { Divider } from '../../styles/commonStyle';
import { textScale } from '../../styles/responsiveStyles';
import { spacing } from '../../styles/spacing';
import Colors from '../../theme/colors';
import THEME_COLOR from '../../utils/constant';
import { navigate } from '../../utils/helperFunctions';
import TextComponent from '../common/TextComponent';
import { useTheme } from '../hooks';

const BroadCastGroupColum = ({item}) => {
  const {theme} = useTheme();
  const isDarkMode = theme === THEME_COLOR;
  return (
    <>
      <TouchableOpacity
        onPress={() =>
          navigate(NavigationString.broadCastGroupDetailScreen, {
            name: item?.name,
          })
        }
        style={styles.card}>
        <TextComponent
          text={item.group_name}
          color={isDarkMode ? Colors.dark.black : Colors.light.white}
          size={textScale(18)}
        />
        <TextComponent
          text={item.title}
          color={isDarkMode ? Colors.dark.black : Colors.light.white}
          size={textScale(15)}
          style={{opacity: 0.8}}
        />
        <TextComponent
          text={`Messages: ${item.message_count}`}
          color={isDarkMode ? Colors.dark.black : Colors.light.white}
          size={textScale(14)}
          style={{opacity: 0.5}}
        />
      </TouchableOpacity>
      <Divider />
    </>
  );
};

export default BroadCastGroupColum;

const styles = StyleSheet.create({
  card: {
    paddingHorizontal: spacing.PADDING_16,
    paddingVertical: spacing.PADDING_12,
  },
});
