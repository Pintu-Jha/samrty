import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';
import React, { useEffect, useState } from 'react';
import { StatusBar, StyleSheet, TouchableOpacity, View } from 'react-native';
import Toast from 'react-native-toast-message';
import { logoutUser, STORAGE_KEYS } from '../../api/slice/authSlice';
import * as SvgIcon from '../../assets';
import { useSocket } from '../../provider';
import commonStyle, { APP_PADDING_HORIZONTAL } from '../../styles/commonStyle';
import { textScale } from '../../styles/responsiveStyles';
import { spacing } from '../../styles/spacing';
import { fontNames } from '../../styles/typography';
import Colors from '../../theme/colors';
import colors from '../../utils/colors';
import THEME_COLOR from '../../utils/constant';
import { closeDrawer } from '../../utils/helperFunctions';
import TextComponent from '../common/TextComponent';
import { useAppDispatch, useTheme } from '../hooks';

const DrawerComponent = props => {
  
  const {disconnect } = useSocket();
  const {theme, toggleTheme} = useTheme();
  const isDarkMode = theme === THEME_COLOR;
  const dispatch = useAppDispatch();

  const [userInfo, setUserInfo] = useState({
    userName: '',
    companyName: '',
    number: '',
  });

  // Fetch the user info from storage and update state
  const getUserData = async () => {
    try {
      const storedData = await AsyncStorage.multiGet(
        Object.values(STORAGE_KEYS),
      );

      const parsedData = Object.fromEntries(
        storedData.map(([key, value]) => {
          try {
            // Parse JSON if the value looks like JSON
            return [
              key,
              (value && value.startsWith('{')) || value.startsWith('[')
                ? JSON.parse(value)
                : value,
            ];
          } catch {
            return [key, value || ''];
          }
        }),
      );

      setUserInfo({
        userName: parsedData[STORAGE_KEYS.FULL_NAME] || 'User Name',
        companyName: parsedData[STORAGE_KEYS.WHATSAPP_DISPLAY_NAME] || '',
        number: parsedData[STORAGE_KEYS.WHATSAPP_NUMBER] || '',
      });
    } catch (error) {
      console.error('Error fetching user data:', error);
      Toast.show({
        type: 'error',
        text1: 'error',
        text2: 'Failed to fetch user information',
      });
    }
  };

  useEffect(() => {
    getUserData();
  }, []);

  const handleLogout = async () => {
    try {
      dispatch(logoutUser()).then(() => {
        disconnect();
      });
      Toast.show({
        type: 'success',
        text1: 'success',
        text2: 'Logged out successfully',
      });
    } catch (error) {
      console.error('Error during logout:', error);
      Toast.show({
        type: 'error',
        text1: 'error',
        text2: 'Failed to log out. Please try again',
      });
    }
  };

  const renderDrawerHeader = () => (
    <View style={styles.subContainer}>
      <View style={{marginTop: spacing.MARGIN_12, flex: 1}}>
        {['userName', 'companyName', 'number'].map(field => (
          <TextComponent
            text={userInfo[field]}
            key={field}
            font={fontNames.ROBOTO_FONT_FAMILY_MEDIUM}
            color={isDarkMode ? Colors.dark.black : Colors.light.white}
            style={{marginBottom: spacing.MARGIN_4, flexWrap: 'wrap'}}
            size={textScale(18)}
          />
        ))}
      </View>
      <TouchableOpacity
        style={styles.headerContainer}
        hitSlop={{left: 20, right: 20, top: 20, bottom: 20}}
        onPress={closeDrawer}>
        <SvgIcon.Wrong
          width={spacing.WIDTH_30}
          height={spacing.HEIGHT_30}
          color={isDarkMode ? colors.black : colors.white}
        />
      </TouchableOpacity>
    </View>
  );

  // Drawer Logout and Theme Selection Section
  const renderLogoutButton = () => {
    return (
      <View>
        {/* Radio Buttons for Theme Selection */}
        <View style={styles.radioContainer}>
          <TouchableOpacity
            style={styles.radioButton}
            onPress={() => {
              if (theme !== 'light') toggleTheme();
            }}>
            <View
              style={[
                theme === 'light'
                  ? styles.radioSelected
                  : styles.radioUnselected,
                {
                  borderColor: theme === 'light' ? colors.black : colors.white,
                  backgroundColor: colors.black,
                },
              ]}
            />
            <TextComponent
              text={'Light Mode'}
              color={theme === 'light' ? Colors.dark.black : Colors.light.white}
              size={textScale(16)}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.radioButton}
            onPress={() => {
              if (theme !== 'dark') toggleTheme();
            }}>
            <View
              style={[
                theme === 'dark'
                  ? styles.radioSelected
                  : styles.radioUnselected,
                {
                  borderColor: theme === 'dark' ? colors.white : colors.black,
                  backgroundColor: colors.white,
                },
              ]}
            />
            <TextComponent
              text={'Dark Mode'}
              color={theme === 'dark' ? Colors.light.white : Colors.dark.black}
              size={textScale(16)}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={[styles.mainContainer]}>
      <StatusBar
        backgroundColor={isDarkMode ? colors.white : '#000000ef'}
        barStyle={isDarkMode ? 'dark-content' : 'light-content'}
      />
      {renderDrawerHeader()}
      <DrawerContentScrollView {...props}>
        <DrawerItemList {...props} />
        {renderLogoutButton()}
      </DrawerContentScrollView>
      <TouchableOpacity
        style={styles.logoutContainer}
        onPress={handleLogout}
        hitSlop={{left: 20, right: 20, top: 20, bottom: 20}}>
        <SvgIcon.LogoutIcon
          width={spacing.WIDTH_24}
          height={spacing.HEIGHT_24}
          color={isDarkMode ? colors.black : colors.white}
        />
        <TextComponent
          text={'Logout'}
          color={isDarkMode ? Colors.dark.black : Colors.light.white}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    paddingHorizontal: APP_PADDING_HORIZONTAL,
    flex: 1,
  },
  headerContainer: {
    ...commonStyle.flexRow,
    justifyContent: 'flex-end',
    marginTop: spacing.MARGIN_12,
  },
  logoutContainer: {
    justifyContent: 'flex-start',
    flexDirection: 'row',
    gap: spacing.MARGIN_12,
    paddingVertical: spacing.PADDING_14,
    paddingHorizontal:spacing.PADDING_36,
    alignItems: 'center',
  },
  subContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: APP_PADDING_HORIZONTAL,
  },
  userInfoTextStyle: {
    fontSize: textScale(14),
    fontFamily: fontNames.ROBOTO_FONT_FAMILY_MEDIUM,
    color: colors.black,
    marginBottom: spacing.MARGIN_2,
    flexShrink: 1,
    flexWrap: 'wrap',
  },
  menuItemContainer_title: {
    fontSize: textScale(14),
    color: colors.grey700,
  },
  userNameTextStyle: {
    fontSize: textScale(20),
    fontFamily: fontNames.ROBOTO_FONT_FAMILY_BOLD,
    color: colors.black,
    marginBottom: spacing.MARGIN_4,
  },
  radioContainer: {
    marginVertical: spacing.MARGIN_20,
    paddingLeft: spacing.PADDING_24,
  },
  radioButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: spacing.MARGIN_6,
  },
  radioSelected: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#000',
    marginRight: 10,
  },
  radioUnselected: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#000',
    marginRight: 10,
  },
  radioLabel: {
    fontSize: 16,
  },
});

export default DrawerComponent;
