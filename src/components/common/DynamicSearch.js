import React, {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useMemo,
  useRef,
  useState
} from 'react';
import {
  ActivityIndicator,
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import * as SvgIcon from '../../assets';
import { textScale } from '../../styles/responsiveStyles';
import { spacing } from '../../styles/spacing';
import { fontNames } from '../../styles/typography';
import Colors from '../../theme/colors';
import THEME_COLOR, { DataMode, SearchMode } from '../../utils/constant';
import { goBack } from '../../utils/helperFunctions';
import { useTheme } from '../hooks';
import { useSearch } from '../hooks/useSearch';
import TextComponent from './TextComponent';

const PAGE_SIZE = 20;

const DynamicSearch = forwardRef(
  (
    {
      data,
      searchKeys = ['title'],
      dataMode = DataMode.LOCAL,
      fetchSearchResults,
      fetchDefaultData,
      transformResult,
      uniqueKey = 'id',
      searchMode = SearchMode.CONTAINS,
      caseSensitive = false,
      minCharacters = 1,
      enableCache = true,
      cacheStrategy = 'memory',
      placeholder = 'Search...',
      customStyles = {},
      accentColor,
      backgroundColor,
      textColor,
      sortResults = true,
      filterFunction,
      autoFocus = false,
      optimizeRendering = true,
      isgoBackArrowShow = false,
      isFilterShow = false,
      showsVerticalScrollIndicator = false,
      searchInputProps = {},
      initialNumToRender = PAGE_SIZE,
      maxToRenderPerBatch = 10,
      windowSize = 5,
      renderCustomItem,
      renderEmptyState,
      emptyResultsText = 'No results found',
      loadingText = 'Searching...',
      networkErrorText = 'Network error',
      onResultPress,
      onSearchChange,
      onFocus,
      onBlur,
      onError,
      onClear,
      onInitialLoad,
      onClickFilter,
      goBackArrowPress = () => goBack(),
      selectedFilter,
      accessibilityLabel = 'Search input',
      accessibilityHint = 'Enter text to search',
      timeout = 10000,
      retryCount = 3,
      retryDelay = 1000,
    },
    ref,
  ) => {
    const {theme: appTheme} = useTheme();
    const isDarkMode = appTheme === THEME_COLOR;
    const searchInputRef = useRef(null);
    const [isFocused, setIsFocused] = useState(false);

    // Memoize props to prevent unnecessary rerenders
    const memoizedSearchKeys = useMemo(() => searchKeys, [searchKeys]);
    const memoizedCustomStyles = useMemo(() => customStyles, [customStyles]);

    const {
      searchQuery,
      setSearchQuery,
      searchResults,
      isLoading,
      isLoadingMore,
      isLoadingMoreDefaultData,
      error,
      hasMoreData,
      loadMoreResults,
      defaultData,
      hasMoreDefaultData,
      loadMoreDefaultData,
      isConnected,
    } = useSearch({
      initialData: data,
      searchKeys: memoizedSearchKeys,
      searchMode,
      caseSensitive,
      filterFunction,
      sortResults,
      dataMode,
      fetchDefaultData,
      fetchSearchResults,
      transformResult,
      enableCache,
      cacheStrategy,
      timeout,
      retryCount,
      retryDelay,
      onSearchChange,
      onError,
      onInitialLoad,
      minCharacters,
      selectedFilter,
    });

    // Expose methods through ref so the parent can update the query externally.
    useImperativeHandle(ref, () => ({
      focus: () => searchInputRef.current?.focus(),
      blur: () => searchInputRef.current?.blur(),
      clear: handleClearSearch,
      getSearchQuery: () => searchQuery,
      // Expose a method to set the search query externally.
      setQuery: query => {
        setSearchQuery(query);
        searchInputRef.current?.clear();
      },
      getSearchResults: () => searchResults,
    }));

    const handleSearch = useCallback(
      text => {
        setSearchQuery(text);
      },
      [setSearchQuery],
    );

    const handleFocus = useCallback(() => {
      setIsFocused(true);
      onFocus?.();
    }, [onFocus]);

    const handleBlur = useCallback(() => {
      setIsFocused(false);
      onBlur?.();
    }, [onBlur]);

    const handleClearSearch = useCallback(() => {
      setSearchQuery('');
      searchInputRef.current?.clear();
      onClear?.();
    }, [setSearchQuery, onClear]);

    const handleResultPress = useCallback(
      item => {
        Keyboard.dismiss();
        onResultPress?.(item);
      },
      [onResultPress],
    );

    const defaultRenderItem = useCallback(
      ({item}) => (
        <TouchableOpacity
          style={[styles.resultItem, memoizedCustomStyles.resultItem]}
          onPress={() => handleResultPress(item)}
          activeOpacity={0.7}>
          {memoizedSearchKeys.map((key, index) => (
            <View
              key={`${item[uniqueKey] || index}-${key}`}
              style={styles.resultTextContainer}>
              <TextComponent
                text={String(item[key] || '')}
                color={textColor || Colors.default.black}
                size={textScale(16)}
                font={fontNames.ROBOTO_FONT_FAMILY_REGULAR}
                style={styles.resultText}
              />
            </View>
          ))}
        </TouchableOpacity>
      ),
      [
        memoizedSearchKeys,
        memoizedCustomStyles,
        handleResultPress,
        uniqueKey,
        textColor,
      ],
    );

    const EmptyState = useCallback(() => {
      if (renderEmptyState) {
        return renderEmptyState({error, searchQuery, minCharacters});
      }

      if (error) {
        return (
          <View style={styles.emptyContainer}>
            <TextComponent
              text={error}
              style={[styles.errorText, memoizedCustomStyles.errorText]}
              color={Colors.default.error}
              size={textScale(14)}
              font={fontNames.ROBOTO_FONT_FAMILY_REGULAR}
              textAlign={'center'}
            />
          </View>
        );
      }

      if (!isConnected && dataMode === DataMode.REMOTE) {
        return (
          <View style={styles.emptyContainer}>
            <TextComponent
              text={networkErrorText}
              style={[styles.errorText, memoizedCustomStyles.errorText]}
              color={Colors.default.error}
              size={textScale(14)}
              font={fontNames.ROBOTO_FONT_FAMILY_REGULAR}
              textAlign={'center'}
            />
          </View>
        );
      }

      return (
        <View style={styles.emptyContainer}>
          <TextComponent
            text={
              searchQuery.length < minCharacters
                ? `Enter at least ${minCharacters} characters to search`
                : emptyResultsText
            }
            style={[styles.emptyText, memoizedCustomStyles.emptyText]}
            color={Colors.default.grey}
            size={textScale(14)}
            font={fontNames.ROBOTO_FONT_FAMILY_REGULAR}
            textAlign={'center'}
          />
        </View>
      );
    }, [
      error,
      searchQuery,
      minCharacters,
      isConnected,
      dataMode,
      renderEmptyState,
      memoizedCustomStyles,
      emptyResultsText,
      networkErrorText,
    ]);

    const loadingMoreIndicator = searchQuery
      ? isLoadingMore
      : isLoadingMoreDefaultData;

    const ListFooter = useCallback(() => {
      if (loadingMoreIndicator) {
        return (
          <View style={styles.footerContainer}>
            <ActivityIndicator
              size="large"
              color={accentColor || Colors.default.accent}
            />
          </View>
        );
      }
      return null;
    }, [isLoadingMore, isLoadingMoreDefaultData, accentColor]);

    const currentData =
      searchQuery || selectedFilter ? searchResults : defaultData;
    const handleLoadMore = searchQuery ? loadMoreResults : loadMoreDefaultData;
    const hasMore = searchQuery ? hasMoreData : hasMoreDefaultData;
    const showSearchLoader = isLoading && searchQuery.length > 0;

    return (
      <KeyboardAvoidingView
        style={[
          styles.container,
          memoizedCustomStyles.container,
          {backgroundColor},
        ]}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}>
        <View style={styles.headerContainer}>
          {isgoBackArrowShow && (
            <TouchableOpacity
              onPress={goBackArrowPress}
              style={styles.backButton}
              accessibilityLabel="Go back">
              <SvgIcon.BackIcon
                width={spacing.WIDTH_24}
                height={spacing.HEIGHT_24}
                color={isDarkMode ? Colors.dark.black : Colors.light.white}
              />
            </TouchableOpacity>
          )}

          <View style={styles.searchWrapper}>
            <TouchableOpacity
              activeOpacity={1}
              style={[
                styles.searchContainer,
                memoizedCustomStyles.searchContainer,
                isFocused && styles.searchContainerFocused,
                {
                  backgroundColor: isDarkMode
                    ? Colors.light.white
                    : Colors.dark.black,
                },
              ]}
              onPress={() => searchInputRef.current?.focus()}>
              <TextInput
                {...searchInputProps}
                ref={searchInputRef}
                style={[
                  styles.searchInput,
                  memoizedCustomStyles.searchInput,
                  {color: isDarkMode ? Colors.dark.black : Colors.light.white},
                ]}
                placeholder={placeholder}
                placeholderTextColor={Colors.default.grey}
                value={searchQuery}
                onChangeText={handleSearch}
                onFocus={handleFocus}
                onBlur={handleBlur}
                autoCapitalize="none"
                autoCorrect={false}
                clearButtonMode="while-editing"
                allowFontScaling={false}
                autoFocus={autoFocus}
                returnKeyType="search"
                enablesReturnKeyAutomatically={true}
                accessibilityLabel={accessibilityLabel}
                accessibilityHint={accessibilityHint}
              />
              {searchQuery.trim().length > 0 && !showSearchLoader && (
                <TouchableOpacity
                  onPress={handleClearSearch}
                  hitSlop={{top: 10, right: 10, bottom: 10, left: 10}}
                  accessibilityLabel="Clear search">
                  <SvgIcon.Wrong
                    color={!isDarkMode ? Colors.light.white : Colors.dark.black}
                  />
                </TouchableOpacity>
              )}
              {showSearchLoader && (
                <ActivityIndicator
                  style={styles.loader}
                  size="small"
                  color={accentColor || Colors.default.accent}
                />
              )}
            </TouchableOpacity>
          </View>

          {isFilterShow && (
            <TouchableOpacity
              onPress={onClickFilter}
              style={styles.filterButton}
              accessibilityLabel="Filter results">
              <SvgIcon.Filter
                width={spacing.WIDTH_24}
                height={spacing.HEIGHT_24}
                color={
                  selectedFilter
                    ? accentColor || Colors.default.accent
                    : isDarkMode
                    ? Colors.dark.black
                    : Colors.light.white
                }
              />
            </TouchableOpacity>
          )}
        </View>

        <FlatList
          data={currentData}
          renderItem={renderCustomItem || defaultRenderItem}
          keyExtractor={(item, index) => String(item[uniqueKey] || index)}
          style={[styles.resultsList, memoizedCustomStyles.resultsList]}
          contentContainerStyle={[
            styles.resultsContent,
            !currentData?.length && styles.emptyResultsContent,
          ]}
          ListEmptyComponent={EmptyState}
          ListFooterComponent={ListFooter}
          onEndReached={hasMore ? handleLoadMore : null}
          onEndReachedThreshold={0.5}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          onScrollBeginDrag={Keyboard.dismiss}
          initialNumToRender={initialNumToRender}
          maxToRenderPerBatch={maxToRenderPerBatch}
          windowSize={windowSize}
          removeClippedSubviews={Platform.OS === 'android' && optimizeRendering}
          showsVerticalScrollIndicator={showsVerticalScrollIndicator}
        />
      </KeyboardAvoidingView>
    );
  },
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.PADDING_16,
    paddingVertical: spacing.PADDING_8,
  },
  backButton: {
    marginRight: spacing.MARGIN_16,
  },
  searchWrapper: {
    flex: 1,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.PADDING_12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.default.grey,
  },
  searchContainerFocused: {
    borderColor: Colors.default.accent,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: textScale(16),
    fontFamily: fontNames.ROBOTO_FONT_FAMILY_REGULAR,
    paddingRight: spacing.PADDING_8,
  },
  loader: {
    marginLeft: spacing.MARGIN_8,
  },
  filterButton: {
    marginLeft: spacing.MARGIN_16,
  },
  resultsList: {
    flex: 1,
  },
  resultsContent: {
    padding: spacing.PADDING_16,
  },
  emptyResultsContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  resultItem: {
    paddingVertical: spacing.PADDING_12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.default.border,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  resultTextContainer: {
    flex: 1,
    marginRight: spacing.MARGIN_8,
  },
  resultText: {
    fontSize: textScale(16),
    fontFamily: fontNames.ROBOTO_FONT_FAMILY_REGULAR,
    flexWrap: 'wrap',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.PADDING_16,
  },
  errorText: {
    fontSize: textScale(14),
    fontFamily: fontNames.ROBOTO_FONT_FAMILY_REGULAR,
    color: Colors.default.error,
    marginBottom: spacing.MARGIN_8,
  },
  emptyText: {
    fontSize: textScale(14),
    fontFamily: fontNames.ROBOTO_FONT_FAMILY_REGULAR,
    color: Colors.default.grey,
  },
  footerContainer: {
    paddingVertical: spacing.PADDING_16,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default DynamicSearch;
