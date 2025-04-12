import { createDrawerNavigator } from '@react-navigation/drawer';
import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import * as SvgIcon from '../assets';
import TextComponent from '../components/common/TextComponent';
import { useTheme } from '../components/hooks';
import DrawerComponent from '../components/module/DrawerComponent';
import * as Screens from '../screens/index';
import { boxShadow } from '../styles/mixins';
import { textScale } from '../styles/responsiveStyles';
import { spacing } from '../styles/spacing';
import { fontNames } from '../styles/typography';
import colors from '../utils/colors';
import NavigationString from './navigationString';

const Drawer = createDrawerNavigator();

const DRAWER_COLORS = {
  light: {
    background: colors.white,
    text: '#1A1A1A',
    activeBackground: '#006702',
    activeText: colors.white,
    inactiveBackground: 'transparent',
  },
  dark: {
    background: '#1A1A1A',
    text: colors.white,
    activeBackground: '#006702',
    activeText: colors.white,
    inactiveBackground: 'transparent',
  },
};

const MAIN_ITEMS = [
  {
    title: 'Complaints',
    icon: SvgIcon.complains,
    component: Screens.ComplainsScreen,
    name: NavigationString.ComplainsScreen,
  },
  {
    title: 'FeedBack',
    icon: SvgIcon.feedback,
    component: Screens.FeedbackScreen,
    name: NavigationString.FeedBackScreen,
  },
  {
    title: 'Projects',
    icon: SvgIcon.projects,
    component: Screens.ProjectsScreen,
    name: NavigationString.ProjectScreen,
  },
  {
    title: 'Message',
    icon: SvgIcon.ChatIcon,
    component: Screens.MessageScreen,
    name: NavigationString.MessageScreen,
  },
  {
    title: 'Contact',
    icon: SvgIcon.ContactIcon,
    component: Screens.ContactScreen,
    name: NavigationString.ContactScreen,
  },
  {
    title: 'Templates',
    icon: SvgIcon.TemplateIcon,
    component: Screens.TemplateScreen,
    name: NavigationString.TemplatesScreen,
  },
  {
    title: 'Forms',
    icon: SvgIcon.FormIcon,
    component: Screens.FormScreen,
    name: NavigationString.FormScreen,
  },
  {
    title: 'Date Reminder',
    icon: SvgIcon.DateReminder,
    component: Screens.DateReminder,
    name: NavigationString.DateReminder,
  },
  {
    title: 'BroadCast Message',
    icon: SvgIcon.SendMessage,
    component: Screens.BroadCastMessage,
    name: NavigationString.broadCastMessageScreen,
  },
  {
    title: 'BroadCast Group',
    icon: SvgIcon.BroadCastGroup,
    component: Screens.BroadCastGroup,
    name: NavigationString.broadCastGroupScreen,
  },
  {
    title: 'Support',
    icon: SvgIcon.Support,
    component: Screens.SupportScreen,
    name: NavigationString.Support,
  },
];

const DrawerScreen = () => {
  const {theme} = useTheme();
  const isDark = theme === 'dark';
  const themeColors = isDark ? DRAWER_COLORS.dark : DRAWER_COLORS.light;

  const DrawerItem = ({item, focused}) => {
    const textColor = focused ? themeColors.activeText : themeColors.text;

    return (
      <View style={[styles.drawerItem, focused && styles.activeItem]}>
        <item.icon width={24} height={24} color={textColor} />

        <TextComponent
          text={item.title}
          color={textColor}
          font={fontNames.ROBOTO_FONT_FAMILY_BOLD}
          style={styles.itemText}
        />
      </View>
    );
  };

  const screenOptions = useMemo(
    () => ({
      headerShown: false,
      drawerPosition: 'left',
      drawerStyle: {
        width: '75%',
        backgroundColor: themeColors.background,
        ...boxShadow(themeColors.background, {width: 0, height: 2}, 0.2, 8, 5),
      },
      drawerActiveBackgroundColor: themeColors.activeBackground,
      drawerInactiveBackgroundColor: themeColors.inactiveBackground,
      drawerActiveTintColor: themeColors.activeText,
      drawerInactiveTintColor: themeColors.text,
    }),
    [isDark, themeColors],
  );

  return (
    <Drawer.Navigator
      drawerContent={props => <DrawerComponent {...props} />}
      screenOptions={screenOptions}
      initialRouteName={NavigationString.ComplainsScreen}>
      {MAIN_ITEMS.map(item => (
        <Drawer.Screen
          key={item.name}
          name={item.name}
          component={item.component}
          options={{
            drawerLabel: () => null,
            drawerIcon: ({focused}) => (
              <DrawerItem item={item} focused={focused} />
            ),
          }}
        />
      ))}
    </Drawer.Navigator>
  );
};

const styles = StyleSheet.create({
  drawerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  activeItem: {
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  itemText: {
    fontSize: textScale(14),
    letterSpacing: 0.3,
    marginLeft: spacing.MARGIN_12,
  },
});

export default DrawerScreen;
