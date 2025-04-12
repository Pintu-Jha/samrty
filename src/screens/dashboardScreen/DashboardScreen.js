import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../../components/hooks';
import NavigationString from '../../navigations/navigationString';
import colors from '../../utils/colors';
import THEME_COLOR from '../../utils/constant';

const DashboardScreen = () => {
  const {theme} = useTheme();
  // const {saveInitialScreen} = useContext(AuthContext);

  // const handleScreenClick = async screenName => {
  //   await saveInitialScreen(screenName);
  //   navigate(screenName);
  // };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme === THEME_COLOR ? colors.white : colors.black,
        },
      ]}>
      {/* First Row */}
      <View style={styles.row}>
        {/* <TouchableOpacity
          style={[styles.box, styles.boxYellow]}
          onPress={() => handleScreenClick(NavigationString.TaskScreen)}>
          <Text style={styles.boxText}>TASK</Text>
        </TouchableOpacity> */}
        <TouchableOpacity
          style={[styles.box, styles.boxGreen]}
          onPress={() => handleScreenClick(NavigationString.MessageScreen)}>
          <Text style={styles.boxText}>MESSAGES</Text>
        </TouchableOpacity>
      </View>

      {/* Second Row */}
      <View style={styles.row}>
        <TouchableOpacity
          style={[styles.box, styles.boxMagenta]}
          onPress={() => handleScreenClick(NavigationString.ContactScreen)}>
          <Text style={styles.boxText}>CONTACTS</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.box, styles.boxLime]}
          onPress={() => handleScreenClick(NavigationString.TemplatesScreen)}>
          <Text style={styles.boxText}>TEMPLATES</Text>
        </TouchableOpacity>
      </View>

      {/* Third Row */}
      <View style={styles.row}>
        <TouchableOpacity
          style={[styles.box, styles.boxDarkGreen]}
          onPress={() => handleScreenClick(NavigationString.FormScreen)}>
          <Text style={styles.boxText}>FORMS</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default DashboardScreen;

// Styles for the grid layout
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    padding: 20,
  },
  row: {
    flexDirection: 'row',
    marginVertical: 10,
  },
  box: {
    flex: 1,
    margin: 5,
    height: 120, // Adjust the height as needed
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
    elevation: 6, // Shadow for Android
    shadowColor: '#000', // Shadow for iOS
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  boxYellow: {
    backgroundColor: '#FFD700',
  },
  boxGreen: {
    backgroundColor: '#32CD32',
  },
  boxMagenta: {
    backgroundColor: '#FF00FF',
  },
  boxLime: {
    backgroundColor: '#DFFF00',
  },
  boxDarkGreen: {
    backgroundColor: colors.blueA400,
  },
  boxBlue: {
    backgroundColor: '#1E90FF',
  },
  boxText: {
    color: '#000',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
