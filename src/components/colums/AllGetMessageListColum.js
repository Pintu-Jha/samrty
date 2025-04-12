import React from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from 'react-native';
import * as SvgIcon from '../../assets';
import navigationString from '../../navigations/navigationString';
import {Divider} from '../../styles/commonStyle';
import {textScale} from '../../styles/responsiveStyles';
import {spacing} from '../../styles/spacing';
import {fontNames} from '../../styles/typography';
import Colors from '../../theme/colors';
import colors from '../../utils/colors';
import {
  formatTimestampForMessageList,
  getColorForParticipant,
  navigate,
} from '../../utils/helperFunctions';
import TextComponent from '../common/TextComponent';
import {useTheme} from '../hooks';

const AllGetMessageListColum = ({item}) => {
  const {backgroundColor, textColor} = getColorForParticipant(
    item.message_id.toString(),
  );
  const {theme} = useTheme();
  const commonColor = 'light';
  const isOutgoing = item?.type === 'Outgoing';
  const {width} = useWindowDimensions();
  const isTablet = width >= 768; // Example breakpoint for tablet width

  // Status icons definition
  const statusIcons = {
    read: {
      type: 'svg',
      component: SvgIcon.DoubleCheckIcon,
      color: colors.blue800,
    },
    failed: {type: 'svg', component: SvgIcon.Wrong, color: colors.redA700},
    delivered: {
      type: 'svg',
      component: SvgIcon.DoubleCheckIcon,
      color: colors.green900,
    },
    sent: {type: 'svg', component: SvgIcon.CheckIcon, color: colors.black},
  };
  // Get the status icon based on the message status
  const statusIcon = item?.status ? statusIcons[item.status] : null;
  const StatusIconComponent = statusIcon?.component;

  // Function to render user avatar
  const renderAvatar = () => {
    const contactInitial = item?.contact
      ? item.contact.trim().slice(0, 1).toUpperCase()
      : item?.mobile_no?.replace(/\D/g, '').slice(-10, -9) || '?';

    return (
      <View style={[styles.userDPStyle, {backgroundColor}]}>
        <TextComponent text={contactInitial} color={textColor} />
      </View>
    );
  };

  // Function to render the message preview text
  const renderMessagePreview = () => {
    if (!item?.message) return '';

    const trimmedMessage = item.message.trim().replace(/\n/g, ' ');
    if (trimmedMessage.startsWith('{')) return 'Flow Response';

    return trimmedMessage.length > 16
      ? `${trimmedMessage.slice(0, 16)}...`
      : trimmedMessage;
  };

  return (
    <>
      <TouchableOpacity
        style={[
          styles.messageListContainer,
          isTablet && styles.tabletContainer,
        ]}
        onPress={() =>
          navigate(navigationString.ChatScreen, {
            Mobile_No: item?.mobile_no,
            title: item?.contact || item?.mobile_no,
            unreadMessages: item?.unread_messages,
            contact: item?.contact,
          })
        }
        activeOpacity={0.8}>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <View style={{flexDirection: 'row', flex: 1}}>
            {renderAvatar()}
            <View style={{flex: 1}}>
              <TextComponent
                text={
                  item?.contact ||
                  item?.mobile_no?.replace(/\D/g, '').slice(-10)
                }
                color={theme === commonColor ? colors.black : colors.white}
                numberOfLines={1}
                size={isTablet ? textScale(18) : textScale(14)}
              />
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                {statusIcon && isOutgoing && statusIcon.type === 'svg' && (
                  <StatusIconComponent
                    color={statusIcon.color}
                    width={spacing.WIDTH_20}
                    height={spacing.HEIGHT_20}
                  />
                )}
                <TextComponent
                  text={renderMessagePreview()}
                  color={
                    theme === commonColor
                      ? Colors.dark.black
                      : Colors.light.grey
                  }
                  size={textScale(12)}
                  style={{opacity: 0.8}}
                />
              </View>
            </View>
          </View>
          <View style={styles.timestampContainer}>
            <TextComponent
              text={formatTimestampForMessageList(item?.creation)}
              color={
                theme === commonColor ? Colors.dark.black : Colors.light.grey
              }
              size={textScale(12)}
              font={fontNames.ROBOTO_FONT_FAMILY_MEDIUM}
            />
            {item?.unread_messages > 0 && (
              <View
                style={{
                  backgroundColor: colors.green700,
                  borderRadius: spacing.WIDTH_18 / 2,
                  width: spacing.WIDTH_18,
                  height: spacing.WIDTH_18,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <TextComponent
                  text={item.unread_messages}
                  textAlign={'center'}
                  color={Colors.default.white}
                  size={textScale(10)}
                  font={fontNames.ROBOTO_FONT_FAMILY_MEDIUM}
                />
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>
      <Divider />
    </>
  );
};

export default AllGetMessageListColum;

const styles = StyleSheet.create({
  messageListContainer: {
    marginHorizontal: spacing.MARGIN_8,
    paddingVertical:spacing.PADDING_6
  },
  tabletContainer: {
    paddingHorizontal: spacing.PADDING_20,
  },
  contactNameTextStyle: {
    fontFamily: fontNames.ROBOTO_FONT_FAMILY_MEDIUM,
    fontSize: textScale(15),
    color: colors.black,
    flex: 1,
  },
  tabletContactName: {
    fontSize: textScale(18),
  },
  messageDescriptionStyle: {
    fontFamily: fontNames.ROBOTO_FONT_FAMILY_MEDIUM,
    fontSize: textScale(12),
    color: colors.white,
  },
  formatTimestampStyle: {
    fontFamily: fontNames.ROBOTO_FONT_FAMILY_MEDIUM,
    fontSize: textScale(12),
    color: colors.white,
  },
  userDPStyle: {
    width: spacing.HEIGHT_40,
    height: spacing.HEIGHT_40,
    borderRadius: spacing.HEIGHT_40 / 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.MARGIN_10,
  },
  unreadMessagesStyle: {
    fontFamily: fontNames.POPPINS_FONT_FAMILY_MEDIUM,
    fontSize: textScale(10),
    color: colors.white,
    textAlign: 'center',
  },
  timestampContainer: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  divider: {
    height: 0.5,
    marginVertical: spacing.MARGIN_6,
    backgroundColor: colors.grey300,
  },
});
