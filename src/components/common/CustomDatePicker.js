import DateTimePicker from '@react-native-community/datetimepicker';
import React, { useEffect, useState } from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import * as SvgIcon from '../../assets';
import { textScale } from '../../styles/responsiveStyles';
import { spacing } from '../../styles/spacing';
import Colors from '../../theme/colors';
import THEME_COLOR from '../../utils/constant';
import { useTheme } from '../hooks';
import TextComponent from './TextComponent';

const CustomDatePicker = ({
  label = 'Select Date/Time',
  initialDate = null,  
  onChange,            
  minimumDate,
  maximumDate,
  locale = 'en-US',
  mode = 'date',     
  display = 'default',
  buttonStyle,
  buttonTextStyle,
  required = false,
  placeholder = 'Select Date/Time',
  selectedDate = null,
  hour12 = true,    
}) => {
 
  function ensureValidDate(input) {
    let dateObj = input;

  
    if (!dateObj) {
      dateObj = new Date();
    }

   
    if (dateObj instanceof Date && isNaN(dateObj.getTime())) {
      dateObj = new Date();
    }

    if (typeof dateObj === 'string') {
      if (mode === 'time' && /^\d{1,2}:\d{1,2}(:\d{1,2})?$/.test(dateObj)) {
        const now = new Date();
        const [hours, minutes, seconds] = dateObj.split(':').map(Number);
        dateObj = new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate(),
          hours || 0,
          minutes || 0,
          seconds || 0
        );
      } else {
        dateObj = new Date(dateObj);
        if (isNaN(dateObj.getTime())) {
          dateObj = new Date();
        }
      }
    }

    if (!(dateObj instanceof Date) || isNaN(dateObj.getTime())) {
      dateObj = new Date();
    }

    if (mode === 'time') {
      const minutes = dateObj.getMinutes();
      const roundedMinutes = Math.round(minutes / 5) * 5;
      dateObj.setMinutes(roundedMinutes);
    }

    if (minimumDate && dateObj < minimumDate) {
      dateObj = new Date(minimumDate);
    }
    if (maximumDate && dateObj > maximumDate) {
      dateObj = new Date(maximumDate);
    }

    return dateObj;
  }

  function createInitialDate() {
    return ensureValidDate(initialDate || new Date());
  }

  const [componentRenderedAt] = useState(createInitialDate());

  useEffect(() => {
    onChange?.(componentRenderedAt);
  }, []);

  const [showPicker, setShowPicker] = useState(false);
  const { theme } = useTheme();
  const isDarkMode = theme === THEME_COLOR;

  const handleDateChange = (event, date) => {
    if (Platform.OS === 'android') {
      setShowPicker(false);
      if (event.type === 'dismissed') {
        return;
      }
    }
    if (date && date instanceof Date) {
      const validDate = ensureValidDate(date);
      onChange?.(validDate); 
    } else {
      console.error('Invalid date selected:', date);
    }
  };

  const formatSelectedDate = () => {
    let dateToDisplay = selectedDate || componentRenderedAt;
    dateToDisplay = ensureValidDate(dateToDisplay);

    if (mode === 'date') {
      return dateToDisplay.toLocaleDateString(locale, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } else if (mode === 'time') {
      return dateToDisplay.toLocaleTimeString(locale, {
        hour: '2-digit',
        minute: '2-digit',
        hour12: hour12, 
      });
    } else {
      return dateToDisplay.toLocaleString(locale);
    }
  };


  const renderPicker = () => {
    const pickerValue = ensureValidDate(selectedDate || componentRenderedAt);
    return (
      <DateTimePicker
        value={pickerValue}
        mode={mode}
        display={display}
        onChange={handleDateChange}
        minimumDate={minimumDate}
        maximumDate={maximumDate}
        locale={locale}
        minuteInterval={5}
      />
    );
  };

  return (
    <View>
      {label && (
        <View style={styles.labelContainer}>
          <TextComponent
            text={label}
            size={textScale(14)}
            fontWeight="500"
            style={{
              marginBottom: 5,
              color: isDarkMode ? Colors.dark.black : Colors.light.white,
            }}
          />
          {required && <TextComponent text="*" size={textScale(18)} color="red" />}
        </View>
      )}

      <Pressable
        style={[
          styles.button,
          buttonStyle,
          {
            backgroundColor: isDarkMode
              ? Colors.light.grey
              : Colors.light.greyTransparent,
          },
        ]}
        onPress={() => setShowPicker(true)}
      >
        <Text
          style={[
            styles.buttonText,
            buttonTextStyle,
            { color: isDarkMode ? Colors.dark.black : Colors.light.white },
          ]}
        >
          {selectedDate || componentRenderedAt
            ? formatSelectedDate()
            : placeholder}
        </Text>

        {mode === 'time' ? <SvgIcon.ClockIcon /> : <SvgIcon.CalendarIcon />}
      </Pressable>

      {showPicker && renderPicker()}
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: spacing.PADDING_6,
    paddingHorizontal: spacing.PADDING_12,
    borderRadius: spacing.RADIUS_12,
    borderWidth: 1,
    height: spacing.HEIGHT_46,
    borderColor: Colors.default.grey,
    marginBottom: spacing.MARGIN_8,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
  },
  buttonText: {
    fontSize: textScale(16),
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    marginLeft: spacing.MARGIN_4,
  },
});

export default CustomDatePicker;
