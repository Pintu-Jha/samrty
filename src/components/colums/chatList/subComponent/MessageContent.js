import PropTypes from 'prop-types';
import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import colors from '../../../../utils/colors';
import * as SvgIcon from '../../../../assets';
import {textScale} from '../../../../styles/responsiveStyles';
import {spacing} from '../../../../styles/spacing';
import Colors from '../../../../theme/colors';
import TextComponent from '../../../common/TextComponent';
import AttachmentMessage from './AttachmentMessage';
import MessageStatus from './MessageStatus';
import RenderMessageContent from './RenderJsonContent';
import {ReplyMessage} from './ReplyMessage';

const MessageContent = ({
  item,
  isIncoming,
  isDarkMode,
  isSelected,
  isTextMessage,
  selectionMode,
  onPress,
  onLongPress,
  isVideoPaused,
  handlePressPlayVideo,
  selectedDomain,
  handleSelectMessage,
}) => {
  const statusIcons = {
    read: {
      component: SvgIcon.DoubleCheckIcon,
      color: colors.blue800,
    },
    failed: {
      component: SvgIcon.Wrong,
      color: colors.redA700,
    },
    delivered: {
      component: SvgIcon.DoubleCheckIcon,
      color: colors.green900,
    },
    sent: {
      component: SvgIcon.CheckIcon,
      color: colors.black,
    },
  };

  const statusIcon = statusIcons[item?.status];

  const formatTime = dateString => {
    try {
      const date = new Date(dateString);
      return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      });
    } catch (error) {
      return '--:--';
    }
  };

  const messageStyles = [
    styles.messageContainer,
    isIncoming ? styles.incomingMessage : styles.outgoingMessage,
    isSelected && isTextMessage && styles.selectedMessage,
    !isDarkMode && {
      backgroundColor: isIncoming
        ? Colors.default.messageIncomingDark
        : Colors.default.messageOutgoingDark,
      shadowColor: 'rgba(0, 0, 0, 0.15)',
    },
  ];

  const textStyles = [
    styles.messageText,
    isIncoming ? styles.incomingText : styles.outgoingText,
    {color: isDarkMode ? Colors.dark.black : Colors.light.white},
  ];

  const timestampStyle = [
    styles.timestamp,
    {color: isDarkMode ? Colors.dark.black : Colors.light.white},
  ];

  // Handle Attachments
  if (item.attach) {
    return (
      <AttachmentMessage
        item={item}
        isDarkMode={isDarkMode}
        isIncoming={isIncoming}
        statusIcon={statusIcon}
        selectedDomain={selectedDomain}
        selectionMode={selectionMode}
        isVideoPaused={isVideoPaused}
        handlePressPlayVideo={handlePressPlayVideo}
      />
    );
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      onLongPress={onLongPress}
      delayLongPress={200}
      activeOpacity={0.8}>
      <View style={messageStyles}>
        {!isIncoming && (
          <TextComponent
            text={item.sent_by}
            style={styles.sentBy}
            numberOfLines={1}
            fontWeight={'bold'}
            color={isDarkMode ? colors.black : colors.white}
          />
        )}
        {(item.is_reply === true || item.is_reply === 1) &&
          item.replied_message && (
            <View style={styles.replyWrapper}>
              <ReplyMessage
                replyData={{
                  message: item.replied_message,
                  message_id: item.reply_to_message_id,
                }}
                isDarkMode={isDarkMode}
                isIncoming={isIncoming}
              />
            </View>
          )}
        <RenderMessageContent
          message={item.message && isTextMessage && item.message}
          handleSelectMessage={handleSelectMessage}
        />

        <View style={styles.messageFooter}>
          <Text style={timestampStyle}>{formatTime(item.creation)}</Text>
          {!isIncoming && (
            <MessageStatus status={item.status} isDarkMode={isDarkMode} />
          )}
        </View>
      </View>
      {item.error_reason && (
        <View style={messageStyles}>
          <TextComponent
            text={'Failed Reason'}
            fontWeight={'bold'}
            color={isDarkMode ? Colors.dark.black : Colors.light.white}
          />
          <TextComponent
            text={item.error_reason}
            color={isDarkMode ? Colors.dark.black : Colors.light.white}
          />
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  messageContainer: {
    maxWidth: '75%',
    padding: spacing.PADDING_8,
    borderRadius: spacing.RADIUS_8,
    marginHorizontal: spacing.MARGIN_8,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 1,
  },
  incomingMessage: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.default.messageIncoming,
    borderTopLeftRadius: spacing.RADIUS_4,
    marginRight: '10%',
  },
  outgoingMessage: {
    alignSelf: 'flex-end',
    backgroundColor: Colors.default.messageOutgoing,
    borderTopRightRadius: spacing.RADIUS_4,
    marginLeft: '10%',
  },
  selectedMessage: {
    backgroundColor: Colors.default.accentTransparent,
    opacity: 1,
  },
  messageText: {
    fontSize: textScale(15.5),
    lineHeight: 20,
    letterSpacing: 0.2,
    color: Colors.default.messageTextIncoming,
  },
  messageFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: spacing.MARGIN_4,
    marginLeft: spacing.MARGIN_8,
  },
  timestamp: {
    fontSize: textScale(14),
    marginRight: spacing.MARGIN_4,
    opacity: 0.7,
  },
  replyWrapper: {
    marginBottom: spacing.MARGIN_8,
  },
  sentBy: {
    marginBottom: spacing.MARGIN_8,
    opacity: 0.7,
    fontWeight: 'bold',
  },
});

MessageContent.propTypes = {
  item: PropTypes.shape({
    message: PropTypes.string,
    message_id: PropTypes.string.isRequired,
    creation: PropTypes.string.isRequired,
    status: PropTypes.string,
    attach: PropTypes.any,
    is_reply: PropTypes.oneOfType([PropTypes.bool, PropTypes.number]),
    reply_to_message_id: PropTypes.string,
    replied_message: PropTypes.string,
    sent_by: PropTypes.string,
  }).isRequired,
  isIncoming: PropTypes.bool.isRequired,
  isDarkMode: PropTypes.bool.isRequired,
  isSelected: PropTypes.bool.isRequired,
  selectionMode: PropTypes.bool.isRequired,
  onPress: PropTypes.func.isRequired,
  onLongPress: PropTypes.func.isRequired,
};

export default React.memo(MessageContent);
