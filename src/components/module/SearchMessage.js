import React, { useCallback, useEffect, useRef, useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { useLazyGetNextActionsQuery } from '../../api/slice/chatSlice';
import { useLazyGetAllMessageListQuery } from '../../api/slice/messageSlice';
import { useLazySearchMessageQuery } from '../../api/slice/searchSlice';
import NavigationString from '../../navigations/navigationString';
import { Divider } from '../../styles/commonStyle';
import { textScale } from '../../styles/responsiveStyles';
import { spacing } from '../../styles/spacing';
import { fontNames } from '../../styles/typography';
import Colors from '../../theme/colors';
import colors from '../../utils/colors';
import THEME_COLOR, { DataMode } from '../../utils/constant';
import {
  formatTimestamp,
  getColorForParticipant,
  navigate,
} from '../../utils/helperFunctions';
import ContainerComponent from '../common/ContainerComponent';
import CustomBottomSheetFlatList from '../common/CustomBottomSheetFlatList';
import DynamicSearch from '../common/DynamicSearch';
import TextComponent from '../common/TextComponent';
import { useTheme } from '../hooks';

const SearchMessage = () => {
  const getActionBottomSheetRef = useRef(null);
  const dynamicSearchRef = useRef(null);

  const {theme} = useTheme();
  const isDarkMode = theme === THEME_COLOR;
  const [nextActions, setNextActions] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState('');
  const [triggerSearchMessage] = useLazySearchMessageQuery();
  const [getAllMessage] = useLazyGetAllMessageListQuery();
  const [getNextActions] = useLazyGetNextActionsQuery();

  useEffect(() => {
    if (dynamicSearchRef.current?.refreshSearch) {
      dynamicSearchRef.current.refreshSearch();
    }
  }, [selectedFilter]);

  const fetchSearchResultsAPI = useCallback(
    async (query, page = 1, limit = 20 , signal) => {
      try {
        const payload = {
          search_query: query.trim(),
          action: selectedFilter,
          status_date: '',
        };

        
        const response = await triggerSearchMessage(payload, {signal}).unwrap();
        const results = response.data ?? [];
        const hasMore = results.length === limit;
        const total = results.length;

        return {
          results,
          hasMore,
          total,
        };
      } catch (error) {
        if (error.name === 'AbortError') {
          console.log('Search request aborted');
          return {results: [], hasMore: false};
        }
        console.error('Search Error:', error);
        return {results: [], hasMore: false, error: error.message};
      }
    },
    [triggerSearchMessage, selectedFilter],
  );

  const fetchDefaultDataAPI = useCallback(
    async (page = 1, page_size = 20, signal) => {
      try {
        const response = await getAllMessage(
          {
            page,
            page_size,
          },
          {signal},
        ).unwrap();

        const results = Array.isArray(response)
          ? response
          : response?.message?.chats;
        const total_pages = response.message?.total_pages;
        const hasMore = page < total_pages;
        const total = results.length;

        return {
          results,
          hasMore,
          total,
        };
      } catch (error) {
        if (error.name === 'AbortError') {
          console.log('Default data request aborted');
          return {results: [], hasMore: false};
        }
        console.error('Default Data Error:', error);
        return {results: [], hasMore: false, error: error.message};
      }
    },
    [getAllMessage],
  );

  const renderItem = ({item}) => {
    const contactInitial = item?.contact
      ? item.contact.trim().slice(0, 1).toUpperCase()
      : item?.mobile_no?.replace(/\D/g, '').slice(-10, -9) || '?';

    const renderMessagePreview = () => {
      if (!item?.message) return '';

      const trimmedMessage = item.message.trim().replace(/\n/g, ' ');
      if (trimmedMessage.startsWith('{')) return 'Flow Response';

      return trimmedMessage.length > 16
        ? `${trimmedMessage.slice(0, 16)}...`
        : trimmedMessage;
    };

    const {backgroundColor, textColor} = getColorForParticipant(
      item?.mobile_no?.toString(),
    );
    return (
      <>
        <TouchableOpacity
          style={styles.messageListContainer}
          onPress={() =>
            navigate(NavigationString.ChatScreen, {
              Mobile_No: item?.mobile_no,
              title: item?.contact || item?.mobile_no,
              unreadMessages: item?.unread_messages,
              contact: item?.contact,
            })
          }
          activeOpacity={0.8}>
          <View style={styles.itemContainer}>
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <View style={{flexDirection: 'row', flex: 1}}>
                <View style={[styles.userDPStyle, {backgroundColor}]}>
                  <TextComponent
                    text={contactInitial}
                    size={textScale(15)}
                    color={textColor}
                  />
                </View>
                <View style={{marginLeft: spacing.MARGIN_6, flex: 1}}>
                  <TextComponent
                    text={
                      item?.contact ||
                      item?.mobile_no?.replace(/\D/g, '').slice(-10)
                    }
                    size={textScale(15)}
                    color={isDarkMode ? Colors.dark.black : Colors.light.white}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                    flex={1}
                    font={fontNames.ROBOTO_FONT_FAMILY_MEDIUM}
                  />

                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    {/* {statusIcon && isOutgoing && statusIcon.type === 'svg' && (
                  <StatusIconComponent
                    color={statusIcon.color}
                    width={20}
                    height={20}
                  />
                )} */}
                    <TextComponent
                      text={renderMessagePreview()}
                      color={
                        isDarkMode ? Colors.dark.black : Colors.light.white
                      }
                    />
                  </View>
                </View>
              </View>
              <View style={styles.timestampContainer}>
                {item?.unread_messages > 0 && (
                  <TextComponent
                    text={item.unread_messages}
                    color={isDarkMode ? Colors.dark.black : Colors.light.white}
                    size={textScale(12)}
                    style={{
                      borderRadius: spacing.WIDTH_24 / 2,
                      width: spacing.WIDTH_24,
                      height: spacing.WIDTH_24,
                      backgroundColor: colors.green700,
                      textAlignVertical: 'center',
                    }}
                    textAlign={'center'}
                  />
                )}
                <TextComponent
                  text={formatTimestamp(item?.creation)}
                  color={isDarkMode ? Colors.dark.black : Colors.light.white}
                  size={textScale(12)}
                  font={fontNames.ROBOTO_FONT_FAMILY_BOLD}
                />
              </View>
            </View>
          </View>
        </TouchableOpacity>
        <Divider />
      </>
    );
  };

  // handle get next action
  const handleGetNextAction = async item => {
    setSelectedFilter(item);

    if (getActionBottomSheetRef.current) {
      getActionBottomSheetRef.current.dismiss();
    }
  };

  // render get next action item
  const renderGetNextActionItem = ({item}) => {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        style={[
          styles.getNextActionContainer,
          {
            backgroundColor:
              selectedFilter === item?.action ? colors.green : colors.green200,
          },
        ]}
        onPress={() => handleGetNextAction(item?.action)}>
        <TextComponent
          text={item?.action}
          font={fontNames.ROBOTO_FONT_FAMILY_MEDIUM}
          color={
            selectedFilter === item?.action
              ? Colors.default.white
              : Colors.default.black
          }
          textAlign={'center'}
        />
      </TouchableOpacity>
    );
  };

  // render get next action list empty component
  const renderGetNextActionListEmptyComponent = () => {
    return (
      <View style={styles.emptyActionText}>
        <TextComponent text="No actions found" />
      </View>
    );
  };

  // handle click filter
  const handleClickFilter = async () => {
    const response = await getNextActions().unwrap();
    setNextActions(response.data);
    if (getActionBottomSheetRef.current) {
      getActionBottomSheetRef.current.present();
    }
  };
  const renderListHeaderComponent = () => (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        padding: spacing.PADDING_16,
        position: 'relative',
      }}>
      <View style={{flex: 1}} />

      <TextComponent
        text={'Filter by action'}
        font={fontNames.ROBOTO_FONT_FAMILY_MEDIUM}
        style={{
          marginBottom: spacing.MARGIN_10,
          textAlign: 'center',
          flex: 1,
        }}
        color={isDarkMode ? Colors.dark.black : Colors.light.white}
      />

      <TouchableOpacity
        style={{flex: 1, alignItems: 'flex-end'}}
        onPress={() => {
          setSelectedFilter('');
          if (getActionBottomSheetRef.current) {
            getActionBottomSheetRef.current.dismiss();
          }
        }}>
        <TextComponent
          text="Remove Filter"
          font={fontNames.ROBOTO_FONT_FAMILY_MEDIUM}
          style={{marginBottom: spacing.MARGIN_10}}
          color={selectedFilter ? Colors.default.accent : Colors.default.black}
        />
      </TouchableOpacity>
    </View>
  );

  return (
    <>
      <ContainerComponent noPadding useScrollView={false}>
        <DynamicSearch
          key={selectedFilter}
          ref={dynamicSearchRef}
          data={[]}
          dataMode={DataMode.REMOTE}
          searchKeys={[
            'creation',
            'unread_messages',
            'message',
            'contact',
            'mobile_no',
          ]}
          fetchDefaultData={fetchDefaultDataAPI}
          fetchSearchResults={fetchSearchResultsAPI}
          placeholder="Search message..."
          isgoBackArrowShow={true}
          renderCustomItem={renderItem}
          isFilterShow={true}
          onClickFilter={handleClickFilter}
          selectedFilter={selectedFilter}
        />
      </ContainerComponent>

      <CustomBottomSheetFlatList
        ref={getActionBottomSheetRef}
        snapPoints={['40%', '80%']}
        data={nextActions}
        keyExtractor={(item, index) =>
          item?.name?.toString() || index.toString()
        }
        renderItem={renderGetNextActionItem}
        ListHeaderComponent={renderListHeaderComponent}
        ListEmptyComponent={renderGetNextActionListEmptyComponent}
        contentContainerStyle={{paddingBottom: spacing.PADDING_20}}
      />
    </>
  );
};

export default SearchMessage;

const styles = StyleSheet.create({
  avatar: {
    width: spacing.HEIGHT_40,
    height: spacing.HEIGHT_40,
    borderRadius: spacing.HEIGHT_40 / 2,
  },
  avatarPlaceholder: {
    width: spacing.HEIGHT_40,
    height: spacing.HEIGHT_40,
    borderRadius: spacing.HEIGHT_40 / 2,
    backgroundColor: '#00796b',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: textScale(18),
    color: '#fff',
  },

  itemContainer: {
    paddingVertical: spacing.PADDING_4,
  },
  messageListContainer: {
    marginVertical: spacing.MARGIN_4,
    justifyContent: 'space-around',
  },
  contactNameTextStyle: {
    fontFamily: fontNames.POPPINS_FONT_FAMILY_MEDIUM,
    fontSize: textScale(15),
    color: colors.black,
    flex: 1,
  },
  timestampContainer: {
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  unreadMessagesStyle: {
    fontFamily: fontNames.POPPINS_FONT_FAMILY_MEDIUM,
    fontSize: textScale(12),
    color: colors.white,
    backgroundColor: colors.green700,
    borderRadius: spacing.WIDTH_24 / 2,
    width: spacing.WIDTH_24,
    height: spacing.WIDTH_24,
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  formatTimestampStyle: {
    fontFamily: fontNames.ROBOTO_FONT_FAMILY_BOLD,
    fontSize: textScale(12),
    color: colors.grey700,
  },
  userDPStyle: {
    width: spacing.WIDTH_40,
    height: spacing.WIDTH_40,
    borderRadius: spacing.WIDTH_40 / 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.grey300,
  },
  getNextActionContainer: {
    padding: spacing.PADDING_16,
    borderRadius: spacing.RADIUS_12,
    backgroundColor: colors.green200,
    marginVertical: spacing.MARGIN_6,
    marginHorizontal: spacing.MARGIN_16,
  },
  emptyActionText: {
    fontSize: textScale(16),
    color: colors.black,
    textAlign: 'center',
    marginTop: spacing.MARGIN_16,
  },
});
