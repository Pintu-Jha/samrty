import { Animated, StyleSheet, Text, View } from "react-native";
import * as SvgIcons from '../../../../assets';
import Colors from "../../../../theme/colors";

const ReplyIcon = ({ translateX, isDarkMode }) => {
  const opacity = translateX.interpolate({
    inputRange: [-50, 0],  // Changed to handle left swipe
    outputRange: [1, 0],   // Reversed to show on left swipe
    extrapolate: 'clamp',
  });

  return (
    <Animated.View style={[styles.replyIconContainer, { opacity }]}>
      <View style={[
        styles.replyIcon,
        isDarkMode ? styles.replyIconDark : styles.replyIconLight
      ]}>
       <SvgIcons.Reply color={isDarkMode ? Colors.dark.black : Colors.default.blue}/>
      </View>
    </Animated.View>
  );
};

  export default ReplyIcon;

const styles = StyleSheet.create({
  // ... existing styles ...
  replyIconContainer: {
    position: 'absolute',
    left: -40,  // Changed from right to left
    top: '50%',
    transform: [{ translateY: -12 }],
    zIndex: 1,
  },
  // ... rest of styles remain the same ...
});