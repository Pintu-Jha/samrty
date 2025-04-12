import React from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import NavigationString from '../../navigations/navigationString';
import THEME_COLOR from '../../utils/constant';
import {
  formatTimestampWithoutModifying,
  navigate,
  truncateText,
} from '../../utils/helperFunctions';
import {Divider} from '../../styles/commonStyle';
import {textScale} from '../../styles/responsiveStyles';
import {spacing} from '../../styles/spacing';
import {fontNames} from '../../styles/typography';
import Colors from '../../theme/colors';
import TextComponent from '../common/TextComponent';
import {useTheme} from '../hooks';

const formatTime = timeString => {
  if (!timeString) return 'N/A';

  try {
    const [hours, minutes] = timeString.split(':').map(Number);
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    return `${formattedHours}:${formattedMinutes} ${ampm}`;
  } catch (error) {
    return 'Invalid Time';
  }
};

const DateReminderListColum = ({item}) => {
  const {theme} = useTheme();
  const isDarkMode = theme === THEME_COLOR;

  return (
    <>
      <TouchableOpacity
        style={[
          styles.card,
          {
            backgroundColor: isDarkMode
              ? Colors.light.white
              : Colors.dark.black,
          },
        ]}
        onPress={() =>
          navigate(NavigationString.DateReminderRowScreen, {
            alretName: item?.name,
          })
        }
        activeOpacity={0.6}>
        <View style={styles.row}>
          {/* Main Content */}
          <View style={styles.content}>
            <TextComponent
              text={truncateText(item?.title, 20) || 'No Title Available'}
              color={isDarkMode ? Colors.dark.black : Colors.light.white}
              size={textScale(18)}
              font={fontNames.ROBOTO_FONT_FAMILY_BOLD}
            />
            <TextComponent
              text={`Document Type: ${item?.document_type || 'N/A'}`}
              color={isDarkMode ? Colors.dark.black : Colors.light.white}
              size={textScale(13)}
              font={fontNames.ROBOTO_FONT_FAMILY_MEDIUM}
              style={{letterSpacing: 0.5, opacity: 0.8}}
            />
            <TextComponent
              text={`Created On: ${formatTimestampWithoutModifying(
                item?.creation,
              )}`}
              color={isDarkMode ? Colors.dark.black : Colors.light.white}
              size={textScale(13)}
              font={fontNames.ROBOTO_FONT_FAMILY_REGULAR}
              style={{opacity: 0.6, marginVertical: spacing.MARGIN_2}}
            />
          </View>
          <View
            style={[
              styles.dateContainer,
              {
                backgroundColor:
                  item?.docstatus === 0
                    ? Colors.default.redLight
                    : item?.docstatus === 1
                    ? Colors.default.blueLight
                    : item?.docstatus === 2
                    ? Colors.default.error
                    : null,
                marginHorizontal: spacing.MARGIN_8,
              },
            ]}>
            <TextComponent
              text={
                item?.docstatus === 0
                  ? 'Draft'
                  : item?.docstatus === 1
                  ? 'Submitted'
                  : item?.docstatus === 2
                  ? 'Cancelled'
                  : null
              }
              color={isDarkMode ? Colors.light.white : Colors.dark.black}
              size={textScale(14)}
              style={styles.date}
            />
          </View>
          <View style={[styles.dateContainer, {backgroundColor: '#f3f335c7'}]}>
            <TextComponent
              text={formatTime(item?.scheduler_time)}
              color={isDarkMode ? Colors.light.white : Colors.dark.black}
              size={textScale(14)}
              style={styles.date}
            />
          </View>
        </View>
      </TouchableOpacity>
      <Divider />
    </>
  );
};

export default DateReminderListColum;

const styles = StyleSheet.create({
  card: {
    paddingVertical: spacing.PADDING_8,
    paddingHorizontal: spacing.PADDING_16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  content: {
    flex: 1,
  },
  dateContainer: {
    height: spacing.FULL_HEIGHT * 0.04,
    alignItems: 'center',
    justifyContent: 'center',

    borderRadius: spacing.RADIUS_8,
    overflow: 'hidden',
    paddingVertical: spacing.PADDING_4,
    paddingHorizontal: spacing.PADDING_8,
  },
  date: {
    textAlign: 'center',
    color: '#000',
  },
});
