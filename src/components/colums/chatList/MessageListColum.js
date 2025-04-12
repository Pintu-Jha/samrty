import React, { useRef, useState } from 'react';
import { Animated, Easing, StyleSheet, Vibration, View } from 'react-native';
import { PanGestureHandler, State } from 'react-native-gesture-handler';
import Colors from '../../../theme/colors';
import THEME_COLOR from '../../../utils/constant';
import DateLabel from '../../colums/chatList/subComponent/DateLable';
import { useTheme } from '../../hooks';
import MessageContent from './subComponent/MessageContent';
import ReplyIcon from './subComponent/ReplyIcon';

const MessageListColum = ({
  item,
  nextItem,
  selectedMessages,
  selectionMode,
  onSwipeToReply,
  selectedDomain,
  handleSelectMessage,
  onLongPress,
}) => {

  const handlePressPlayVideo = () => {
    setIsVideoPaused(prevPaused => !prevPaused);
  };

  const [isVideoPaused, setIsVideoPaused] = useState(true);
  const translateX = useRef(new Animated.Value(0)).current;
  const { theme } = useTheme();
  const isDarkMode = theme === THEME_COLOR;

  const isIncoming = item?.type?.toLowerCase() === 'incoming';
  const isTextMessage = item.message && !item.attach;

  const isSelected = selectedMessages.some(
    msg => msg.message_id === item.message_id,
  );
  // Gesture
  const handleGesture = {
    onGestureEvent: Animated.event(
      [{ nativeEvent: { translationX: translateX } }],
      { useNativeDriver: true },
    ),
    onHandlerStateChange: ({ nativeEvent }) => {
      if (nativeEvent.state === State.END) {
        if (nativeEvent.translationX > 50) {
          onSwipeToReply({
            message: item?.message,
            message_id: item?.message_id,
            is_reply: item?.is_reply,
            attach: item.attach,
          });
          Vibration.vibrate([50]);
        }
        Animated.timing(translateX, {
          toValue: 0,
          duration: 150,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }).start();
      }
    },
  };

  // Press
  const handlePress = () => {
    if (selectionMode && isTextMessage) {
      handleSelectMessage(item);
    }
  };

  // Long Press
  const handleLongPress = () => {
    if (isTextMessage) {
      Vibration.vibrate([50, 100]);
      handleSelectMessage(item);
      onLongPress(item);
    }
  };
  // Date Label
  const renderDateLabel = (currentMessage, previousMessage) => {
    const getUTCMidnight = (dateString) => {
      const date = new Date(dateString.replace(' ', 'T') + 'Z'); 
      date.setUTCHours(0, 0, 0, 0);
      return date.getTime();
    };
  
    // Always show label for first message
    if (!previousMessage) {
      return <DateLabel date={currentMessage.creation} isDarkMode={isDarkMode} />;
    }
  
    // Get UTC midnight timestamps for comparison
    const currentUTCDate = getUTCMidnight(currentMessage.creation);
    const previousUTCDate = getUTCMidnight(previousMessage.creation);
  
    // Show label if dates are different
    if (currentUTCDate !== previousUTCDate) {
      return <DateLabel date={currentMessage.creation} isDarkMode={isDarkMode} />;
    }
  
    return null;
  };

  return (
    <>
      {renderDateLabel(item, nextItem)}
      <PanGestureHandler
        {...handleGesture}
        activeOffsetX={[-20, 0]}
        shouldCancelWhenOutside={true}>
        <Animated.View
          style={[
            styles.messageWrapper,
            {
              transform: [
                {
                  translateX: translateX.interpolate({
                    inputRange: [0, 100],
                    outputRange: [0, 50],
                    extrapolate: 'clamp',
                  }),
                },
              ],
            },
          ]}>
          <ReplyIcon translateX={translateX} isDarkMode={isDarkMode} />
          <View style={[
            isSelected && isTextMessage && styles.selectedMessage,
          ]}>
            <MessageContent
              item={item}
              isIncoming={isIncoming}
              isDarkMode={isDarkMode}
              isSelected={isSelected}
              isTextMessage={isTextMessage}
              selectionMode={selectionMode}
              onPress={handlePress}
              onLongPress={handleLongPress}
              isVideoPaused={isVideoPaused}
              handlePressPlayVideo={handlePressPlayVideo}
              selectedDomain={selectedDomain}
              handleSelectMessage={handleSelectMessage}
            />
          </View>
        </Animated.View>
      </PanGestureHandler>
    </>
  );
};

const styles = StyleSheet.create({
  messageWrapper: {
    position: 'relative',
  },
  selectedMessage: {
    backgroundColor: Colors.default.accent,
    opacity: 0.6,
  },
});

export default React.memo(MessageListColum);
