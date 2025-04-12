import React from 'react';
import {
  Platform,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import * as SvgIcon from '../../../assets';
import {textScale} from '../../../styles/responsiveStyles';
import {spacing} from '../../../styles/spacing';
import colors from '../../../utils/colors';
import THEME_COLOR from '../../../utils/constant';
import CustomButton from '../../common/CustomButton';
import TextComponent from '../../common/TextComponent';
import {useTheme} from '../../hooks';

const MessageInput = ({
  isMarkAsRead,
  isSessionExpired,
  isReplyingMessage,
  replyingMessage,
  message,
  inputHeight,
  selectedDomain,
  onMarkAsReadPress,
  onChatOptionPress,
  onCancelReply,
  onMessageChange,
  onSendMessage,
  onTemplatePress,
  setInputHeight,
  onReplyPress,
  maxTextInputHeight = 100,
}) => {
  const {theme} = useTheme();
  const isDarkMode = theme === THEME_COLOR;

  return (
    <View
      style={[
        styles.mainContainer,
        {backgroundColor: !isDarkMode ? colors.grey900 : colors.white},
      ]}>
      {/* Reply Message Section */}
      {isReplyingMessage && (
        <View
          style={[
            styles.replyContainer,
            {backgroundColor: !isDarkMode ? colors.grey800 : colors.grey100},
          ]}>
          <View style={styles.replyContent}>
            <TextComponent
              text={replyingMessage?.message || ''}
              color={!isDarkMode ? colors.grey300 : colors.grey600}
              size={textScale(14)}
              numberOfLines={1}
            />
          </View>
          <TouchableOpacity onPress={onCancelReply}>
            <SvgIcon.Wrong
              width={spacing.WIDTH_20}
              height={spacing.HEIGHT_20}
              color={!isDarkMode ? colors.grey400 : colors.grey600}
            />
          </TouchableOpacity>
        </View>
      )}

      {/* Input Section */}
      <View style={styles.inputContainer}>
        {!isSessionExpired ? (
          isMarkAsRead ? (
            <View style={styles.markAsReadContainer}>
              <CustomButton
                title="Template"
                onPress={onTemplatePress}
                disabled={!selectedDomain}
                buttonStyle={{width: '45%'}}
              />
              <CustomButton
                title="Mark as Read"
                onPress={onMarkAsReadPress}
                buttonStyle={{width: '45%'}}
              />
            </View>
          ) : (
            <CustomButton
              title="Template"
              onPress={onTemplatePress}
              disabled={!selectedDomain}
              buttonStyle={{width: '90%', flex: 1}}
            />
          )
        ) : isMarkAsRead ? (
          <View style={styles.markAsReadContainer}>
            <CustomButton
              title="Reply"
              onPress={onReplyPress}
              buttonStyle={{width: '45%'}}
            />
            <CustomButton
              title="Mark as Read"
              onPress={onMarkAsReadPress}
              buttonStyle={{width: '45%'}}
            />
          </View>
        ) : (
          <>
            <View
              style={[
                styles.textInputContainer,
                {
                  backgroundColor: !isDarkMode
                    ? colors.grey800
                    : colors.grey100,
                },
              ]}>
              <TextInput
                style={[
                  styles.input,
                  {
                    height: Math.max(
                      40,
                      Math.min(inputHeight, maxTextInputHeight),
                    ),
                    color: !isDarkMode ? colors.white : colors.black,
                  },
                ]}
                value={message}
                onChangeText={onMessageChange}
                placeholder="Type a message"
                placeholderTextColor={
                  !isDarkMode ? colors.grey400 : colors.grey500
                }
                multiline
                onContentSizeChange={e =>
                  setInputHeight(e.nativeEvent.contentSize.height)
                }
              />
            </View>
            {message ? (
              <TouchableOpacity
                style={styles.sendButton}
                onPress={onSendMessage}>
                <SvgIcon.SendMessage
                  width={spacing.WIDTH_24}
                  height={spacing.HEIGHT_24}
                  color={colors.green600}
                />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={styles.optionsButton}
                onPress={onChatOptionPress}>
                <SvgIcon.AddICon
                  width={spacing.WIDTH_24}
                  height={spacing.HEIGHT_24}
                  color={colors.green600}
                />
              </TouchableOpacity>
            )}
          </>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    paddingBottom: Platform.OS === 'ios' ? spacing.PADDING_20 : 0,
  },
  replyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.PADDING_8,
    marginHorizontal: spacing.MARGIN_8,
    borderRadius: spacing.RADIUS_8,
  },
  replyContent: {
    flex: 1,
    marginRight: spacing.MARGIN_8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: spacing.PADDING_5,
    paddingVertical: spacing.PADDING_8,
  },
  markAsReadContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    width: '100%',
  },
  markAsReadBtnStyle: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '50%',
    marginHorizontal: spacing.MARGIN_8,
    paddingVertical: spacing.PADDING_10,
    borderRadius: spacing.RADIUS_8,
  },
  markAsReadBtnTextStyle: {
    fontSize: textScale(14),
  },
  textInputContainer: {
    flex: 1,
    marginHorizontal: spacing.MARGIN_8,
    borderRadius: spacing.RADIUS_20,
    paddingHorizontal: spacing.PADDING_12,
  },
  input: {
    fontSize: textScale(16),
    paddingTop: Platform.OS === 'ios' ? spacing.PADDING_8 : 0,
    paddingBottom: Platform.OS === 'ios' ? spacing.PADDING_8 : 0,
  },
  sendButton: {
    padding: spacing.PADDING_8,
  },
  optionsButton: {
    padding: spacing.PADDING_8,
  },
  templateButton: {
    padding: spacing.PADDING_8,
    borderRadius: spacing.RADIUS_8,
  },
});

export default MessageInput;
