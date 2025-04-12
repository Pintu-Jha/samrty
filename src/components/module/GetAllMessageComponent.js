import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { useLazyGetAllMessageListQuery } from '../../api/slice/messageSlice';
import * as SvgIcon from '../../assets';
import NavigationString from '../../navigations/navigationString';
import { textScale } from '../../styles/responsiveStyles';
import { spacing } from '../../styles/spacing';
import Colors from '../../theme/colors';
import colors from '../../utils/colors';
import THEME_COLOR from '../../utils/constant';
import { debounce, navigate, openDrawer } from '../../utils/helperFunctions';
import AllGetMessageListColum from '../colums/AllGetMessageListColum';
import CommoneHeader from '../common/CommoneHeader';
import LoadingScreen from '../common/Loader';
import TextComponent from '../common/TextComponent';
import { useTheme } from '../hooks';

const ITEM_HEIGHT = 80;
const PAGE_SIZE = 100;

const GetAllMessageComponent = () => {
  const {theme} = useTheme();
  const isDarkMode = theme === THEME_COLOR;

  const [selectedFilter, setSelectedFilter] = useState('All');
  const [messages, setMessages] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingStates, setLoadingStates] = useState({
    initial: true,
    refresh: false,
    loadMore: false,
  });

  const [triggerGetMessages] = useLazyGetAllMessageListQuery();

  const fetchMessages = useCallback(
    async (currentPage, reset = false, loadingType = 'initial') => {
      // Update loading state
      setLoadingStates(prev => ({...prev, [loadingType]: true}));

      try {
        const response = await triggerGetMessages({
          page: currentPage,
          page_size: PAGE_SIZE,
        }).unwrap();

        const chats = response?.message?.chats || [];
        const apiTotalPages = response?.message?.total_pages || 0;

        setHasMore(currentPage < apiTotalPages);
        setMessages(prevMessages =>
          reset ? chats : [...prevMessages, ...chats],
        );
      } catch (error) {
        console.error('Failed to fetch messages:', error);
        setHasMore(false);
      } finally {
        // Reset loading state
        setLoadingStates(prev => ({
          ...prev,
          initial: false,
          [loadingType]: false,
        }));
      }
    },
    [triggerGetMessages],
  );

  useEffect(() => {
    fetchMessages(1, true);
  }, []);

  const handleFilterChange = useCallback(
    filter => {
      setSelectedFilter(filter);
      setPage(1);
      setHasMore(true);
      fetchMessages(1, true);
    },
    [fetchMessages],
  );

  const handleRefresh = useCallback(() => {
    if (loadingStates.refresh) return;
    setPage(1);
    setHasMore(true);
    fetchMessages(1, true, 'refresh');
  }, [fetchMessages, loadingStates.refresh]);

  const loadMoreMessages = useCallback(
    debounce(() => {
      if (!hasMore || loadingStates.loadMore) return;
      const nextPage = page + 1;
      setPage(nextPage);
      fetchMessages(nextPage, false, 'loadMore');
    }, 300),
    [hasMore, page, fetchMessages, loadingStates.loadMore],
  );

  // Memoized filtered data
  const filteredData = useMemo(() => {
    return messages.filter(message => {
      switch (selectedFilter) {
        case 'Unread':
          return message.unread_messages > 0;
        case 'All':
          return true;
        case 'Favourites':
          return message.is_favourite;
        case 'Archived':
          return message.is_archived;
        default:
          return false;
      }
    });
  }, [messages, selectedFilter]);

  const handleCommonBarRightIconPress = index => {
    const actions = {
      0: () => navigate(NavigationString.searchMessage),
      1: () => handleRefresh(),
    };
    actions[index]?.();
  };

  const FilterButton = memo(({filter, selectedFilter, onPress}) => (
    <TouchableOpacity
      onPress={onPress}
      hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
      style={[
        styles.filterButton,
        selectedFilter === filter ? styles.selectedButton : null,
      ]}>
      <TextComponent
        text={filter}
        color={
          selectedFilter === filter ? Colors.light.white : Colors.dark.black
        }
      />
    </TouchableOpacity>
  ));

  const renderFooter = () => {
    if (loadingStates.loadMore) {
      return (
        <View style={styles.footerLoadingContainer}>
          <ActivityIndicator size="large" color={colors.green600} />
        </View>
      );
    }
    return null;
  };

  const renderListEmptyComponent = () => (
    <View style={styles.emptyListContainer}>
      <TextComponent
        text={'No messages found'}
        size={textScale(16)}
        color={isDarkMode ? Colors.dark.black : Colors.light.white}
      />
    </View>
  );

  return (
    <>
      <CommoneHeader
        title="Messages"
        showLeftIcon
        leftIcon={SvgIcon.MenuIcon}
        onLeftIconPress={openDrawer}
        showRightIcons
        rightIcons={[SvgIcon.Search, SvgIcon.ReloadIcon]}
        onRightIconPress={handleCommonBarRightIconPress}
      />
      <View style={styles.container}>
        {loadingStates.initial ? (
          <LoadingScreen />
        ) : (
          <FlatList
            data={filteredData}
            keyExtractor={item => item?.message_id?.toString()}
            renderItem={({item}) => <AllGetMessageListColum item={item} />}
            onEndReached={loadMoreMessages}
            onEndReachedThreshold={0.5}
            ListFooterComponent={renderFooter}
            ListEmptyComponent={renderListEmptyComponent}
            contentContainerStyle={styles.listContentContainer}
            refreshing={loadingStates.refresh}
            onRefresh={handleRefresh}
            removeClippedSubviews={true}
            maxToRenderPerBatch={10}
            windowSize={21}
            getItemLayout={(data, index) => ({
              length: ITEM_HEIGHT,
              offset: ITEM_HEIGHT * index,
              index,
            })}
            ListHeaderComponent={
              <View style={styles.listContainer}>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.scrollContainer}>
                  <View style={styles.filterContainer}>
                    {['All', 'Unread'].map(filter => (
                      <FilterButton
                        key={filter}
                        filter={filter}
                        selectedFilter={selectedFilter}
                        onPress={() => handleFilterChange(filter)}
                      />
                    ))}
                  </View>
                </ScrollView>
              </View>
            }
          />
        )}
      </View>
    </>
  );
};

export default GetAllMessageComponent;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: spacing.PADDING_8,
    paddingVertical: spacing.PADDING_4,
  },
  filterButton: {
    paddingVertical: spacing.PADDING_6,
    paddingHorizontal: spacing.PADDING_12,
    borderRadius: spacing.RADIUS_20,
    backgroundColor: colors.grey100,
    marginRight: spacing.MARGIN_8,
  },
  selectedButton: {
    backgroundColor: '#4caf50',
  },
  footerLoadingContainer: {
    paddingVertical: spacing.PADDING_20,
    alignItems: 'center',
  },
  scrollContainer: {
    flexGrow: 1,
  },
  listContentContainer: {
    paddingBottom: spacing.PADDING_16,
    paddingHorizontal: spacing.PADDING_8,
  },
  listContainer: {
    flexGrow: 1,
    marginVertical: spacing.MARGIN_4,
  },
  emptyListContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing.MARGIN_20,
  },
  emptyListText: {
    fontSize: textScale(16),
    color: colors.grey500,
  },
});
