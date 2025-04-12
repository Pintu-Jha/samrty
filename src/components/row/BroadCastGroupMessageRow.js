import React from 'react';
import { Linking, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useFetchMessageStatusAndDetailsQuery } from '../../api/slice/broadCastMessageSlice';
import * as SvgIcon from '../../assets';
import NavigationString from '../../navigations/navigationString';
import { textScale } from '../../styles/responsiveStyles';
import { spacing } from '../../styles/spacing';
import { fontNames } from '../../styles/typography';
import Colors from '../../theme/colors';
import { navigate } from '../../utils/helperFunctions';
import ImageZoomViewer from '../common/ImageViewer';
import TextComponent from '../common/TextComponent';
import { useAppSelector } from '../hooks';

const BroadCastGroupMessageRow = ({message}) => {
  const selectedDomain = useAppSelector(
    state => state.domains?.selectedDomain?.domain,
  );
  const {data} = useFetchMessageStatusAndDetailsQuery(message?.name);

  const statusCount = data?.data?.status_count || {};
  const details = data?.data?.details || [];
  const isImage =
    message?.header_sample?.startsWith('/files/') ||
    /\.(jpeg|jpg|png)$/i.test(message?.header_sample);

  return (
    <View
      style={{
        marginBottom: spacing.PADDING_16,
        maxWidth: '80%',
        alignSelf: 'flex-end',
      }}>
      {isImage && message?.header_sample && (
        <ImageZoomViewer
          baseUrl={selectedDomain}
          message={message?.header_sample}
          thumbnailStyle={styles.imageMessage}
          resizeMode="cover"
        />
      )}
      <View
        style={[
          styles.messageCard,
          {
            backgroundColor: Colors.default.messageOutgoing,
            alignSelf: 'flex-end',
          },
        ]}>
        {/* Message Details */}
        <MessageDetails message={{sent_message: details[0]?.sent_message}} />

        {/* Status Counts */}
        <View style={[styles.statusContainer]}>
          {['sent', 'failed', 'delivered', 'Success', 'read'].map(
            (status, index) => (
              <TouchableOpacity
                key={index}
                style={styles.statusRow}
                onPress={() =>
                  navigate(
                    NavigationString.BroadCastGroupMessageConatctDetailsScreen,
                    {
                      broadcast_name: message.name,
                      status: status.toLowerCase(),
                    },
                  )
                }>
                <TextComponent
                  text={`${status.charAt(0).toUpperCase() + status.slice(1)}`}
                  color={Colors.default.primaryColor}
                  size={textScale(16)}
                  font={fontNames.ROBOTO_FONT_FAMILY_LIGHT}
                />
                <View style={{alignItems: 'center', flexDirection: 'row'}}>
                  <TextComponent
                    text={statusCount[status] || 0}
                    color={Colors.default.primaryColor}
                    size={textScale(16)}
                    font={fontNames.ROBOTO_FONT_FAMILY_LIGHT}
                  />
                  <SvgIcon.RightArrow color={Colors.default.primaryColor} />
                </View>
              </TouchableOpacity>
            ),
          )}
        </View>
      </View>
    </View>
  );
};

export default BroadCastGroupMessageRow;

const MessageDetails = ({message}) => {
  const content = message?.sent_message || 'No message content';
  const parseMessage = text => {
    const urlRegex =
      /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/gi;

    const phoneRegex = /(?<!\d)(\+?\d{10,12})(?!\d)/g;

    const parts = [];
    let lastIndex = 0;

    // Find all matches first
    const matches = [
      ...text.matchAll(urlRegex),
      ...text.matchAll(phoneRegex),
    ].sort((a, b) => a.index - b.index);

    matches.forEach(match => {
      // Add text before the match
      if (match.index > lastIndex) {
        parts.push({
          type: 'text',
          value: text.slice(lastIndex, match.index),
        });
      }

      // Determine if it's a URL or phone number
      const isUrl = match[0].match(urlRegex);
      parts.push({
        type: isUrl ? 'url' : 'phone',
        value: match[0],
      });

      lastIndex = match.index + match[0].length;
    });

    // Add remaining text
    if (lastIndex < text.length) {
      parts.push({
        type: 'text',
        value: text.slice(lastIndex),
      });
    }

    return parts;
  };

  const handleLinkPress = url => {
    const formattedUrl = url.toLowerCase().startsWith('http')
      ? url
      : `https://${url}`;
    Linking.openURL(formattedUrl).catch(err => {
      console.error('Failed to open URL:', err);
    });
  };

  const handlePhonePress = phoneNumber => {
    // Remove any non-digit characters from phone number
    const cleanNumber = phoneNumber.replace(/\D/g, '');
    Linking.openURL(`tel:${cleanNumber}`).catch(err => {
      console.error('Failed to open phone dialer:', err);
    });
  };

  const renderPart = (part, index) => {
    switch (part.type) {
      case 'text':
        return (
          <TextComponent
            text={part.value}
            key={index}
            color={Colors.default.black}
            size={textScale(16)}
            font={fontNames.ROBOTO_FONT_FAMILY_BOLD}
          />
        );

      case 'url':
        return (
          <TextComponent
            text={part.value}
            key={index}
            color={Colors.default.blue}
            size={textScale(16)}
            onPress={() => handleLinkPress(part.value)}
            font={fontNames.ROBOTO_FONT_FAMILY_BOLD}
          />
        );

      case 'phone':
        return (
          <TextComponent
            text={part.value}
            key={index}
            color={Colors.default.blue}
            size={textScale(16)}
            onPress={() => handlePhonePress(part.value)}
            font={fontNames.ROBOTO_FONT_FAMILY_BOLD}
          />
        );

      default:
        return null;
    }
  };

  const parsedContent = parseMessage(content);

  return (
    <View>{parsedContent.map((part, index) => renderPart(part, index))}</View>
  );
};

const styles = StyleSheet.create({
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.PADDING_8,
  },

  messageCard: {
    backgroundColor: Colors.default.white,
    borderRadius: spacing.RADIUS_8,
    padding: spacing.PADDING_16,
    opacity: 0.8,
  },
  imageMessage: {
    width: '100%',
    height: undefined,
    aspectRatio: 3 / 4,
    borderRadius: spacing.RADIUS_8,
  },
  statusContainer: {
    paddingVertical: spacing.PADDING_8,
    borderRadius: spacing.RADIUS_8,
    opacity: 0.8,
  },
});
