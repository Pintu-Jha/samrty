import React, { useEffect, useState } from 'react';
import {
  Dimensions,
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  TouchableWithoutFeedback,
  View
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import Colors, { gradientColorTokensMap } from '../../theme/colors';
import THEME_COLOR from '../../utils/constant';
import { useTheme } from '../hooks';

const ContainerComponent = ({
  children,
  useScrollView = true,
  style,
  keyboardAvoidingViewProps = {},
  flatListProps = {},
  safeAreaViewProps = {},
  containerStyle = {},
  keyboardAvoidingStyle = {},
  rightComponent,
  flatListStyle = {},
  safeAreaStyle = {},
  showHeader = false,
  headerTitle = '',
  headerLeft,
  noPadding = false,
  headerOnPress,
  statusBarBackgroundColor,
  headerBackgroundColor,
  onPress,
  bottomComponent,
  ...rest
}) => {
  const insets = useSafeAreaInsets();
  const {theme} = useTheme();
  const isDarkMode = theme === THEME_COLOR;
  
  // Handle screen dimensions and orientation changes
  const [dimensions, setDimensions] = useState(Dimensions.get('window'));
  const [orientation, setOrientation] = useState('portrait');

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({window}) => {
      setDimensions(window);
      setOrientation(window.width > window.height ? 'landscape' : 'portrait');
    });

    return () => subscription?.remove();
  }, []);

  // Calculate dynamic padding based on device size
  const getDynamicPadding = () => {
    const { width, height } = dimensions;
    const baseSize = Math.min(width, height);
    return baseSize * 0.03; // 3% of screen size
  };

  // Calculate bottom padding to account for bottom component
  const getBottomPadding = () => {
    if (bottomComponent) {
      return Platform.select({
        ios: insets.bottom + 70, // Adjust for iOS devices with home indicator
        android: 70, // Standard padding for Android
      });
    }
    return insets.bottom;
  };

  const content = (
    <View
      style={[
        styles.container,
        {
          padding: noPadding ? 0 : getDynamicPadding(),
          paddingBottom: getBottomPadding(),
          backgroundColor: isDarkMode ? Colors.light.white : Colors.dark.black,
          minHeight: dimensions.height - insets.top - insets.bottom,
        },
        containerStyle,
        style,
      ]}
      {...rest}>
      {children}
    </View>
  );

  const listData = [{key: 'content', content}];
  const renderItem = ({item}) => item.content;

  return (
    <SafeAreaProvider style={styles.provider}>
      <StatusBar
        barStyle={isDarkMode ? 'dark-content' : 'light-content'}
        backgroundColor={
          statusBarBackgroundColor ||
          (isDarkMode ? Colors.light.white : Colors.dark.black)
        }
      />
      <LinearGradient
        colors={
          isDarkMode
            ? gradientColorTokensMap.DarkGR
            : gradientColorTokensMap.White
        }
        start={{x: 0, y: 0}}
        end={{x: 1, y: 0}}
        style={[styles.gradient, {paddingTop: insets.top}]}>
        <SafeAreaView
          style={[styles.safeArea, safeAreaStyle]}
          edges={['left', 'right']}
          {...safeAreaViewProps}>
          <KeyboardAvoidingView
            style={[styles.keyboardAvoiding, keyboardAvoidingStyle]}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
            {...keyboardAvoidingViewProps}>
            {useScrollView ? (
              <FlatList
                data={listData}
                renderItem={renderItem}
                keyExtractor={item => item.key}
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={[
                  styles.flatListContent,
                  orientation === 'landscape' && styles.landscapeContent,
                ]}
                style={[
                  styles.flatList,
                  {
                    backgroundColor: isDarkMode
                      ? Colors.light.white
                      : Colors.dark.black,
                  },
                  flatListStyle,
                ]}
                {...flatListProps}
              />
            ) : (
              <TouchableWithoutFeedback
                onPress={() => {
                  Keyboard.dismiss();
                  if (onPress) onPress();
                }}>
                {content}
              </TouchableWithoutFeedback>
            )}
          </KeyboardAvoidingView>
          {bottomComponent && (
            <View style={[styles.bottomComponent, { paddingBottom: insets.bottom }]}>
              {bottomComponent}
            </View>
          )}
        </SafeAreaView>
      </LinearGradient>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  provider: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  keyboardAvoiding: {
    flex: 1,
  },
  flatList: {
    flex: 1,
  },
  flatListContent: {
    flexGrow: 1,
  },
  landscapeContent: {
    maxWidth: 800,
    alignSelf: 'center',
    width: '100%',
  },
  container: {
    flex: 1,
  },
  bottomComponent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'transparent',
  },
});

export default ContainerComponent;