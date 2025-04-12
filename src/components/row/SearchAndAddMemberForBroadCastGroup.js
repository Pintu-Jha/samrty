import { useRoute } from '@react-navigation/native';
import React, { useCallback, useRef, useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import {
  useLazyGetAllContactQuery,
  useLazySearchContactQuery,
} from '../../api/slice/contactSlice';
import * as SvgIcon from '../../assets';
import { textScale } from '../../styles/responsiveStyles';
import { spacing } from '../../styles/spacing';
import { fontNames } from '../../styles/typography';
import Colors from '../../theme/colors';
import colors from '../../utils/colors';
import THEME_COLOR, { DataMode, SearchMode } from '../../utils/constant';
import { getColorForParticipant, goBack } from '../../utils/helperFunctions';
import ContainerComponent from '../common/ContainerComponent';
import DynamicSearch from '../common/DynamicSearch';
import TextComponent from '../common/TextComponent';
import { useTheme } from '../hooks';

const SearchAndAddMemberForBroadCastGroup = () => {
  const {theme} = useTheme();
  const isDarkMode = theme === THEME_COLOR;
  const dynamicSearchRef = useRef(null);
  const route = useRoute();
  const {onSelect} = route.params;

  const [hasSelection, setHasSelection] = useState(false);
  const [selectedContacts, setSelectedContacts] = useState([]);
  const [triggerSearchContact] = useLazySearchContactQuery();
  const [getAllContact] = useLazyGetAllContactQuery();

  /** Fetch Contacts (API call) */
  const fetchSearchResultsAPI = useCallback(
    async (query, page = 1, limit = 20, signal) => {
      try {
        const response = await triggerSearchContact(
          {search_query: query.trim()},
          {signal},
        ).unwrap();

        const results = response.data ?? [];
        const hasMore = results.length === limit;
        const total = results.length;
        return {results, hasMore, total};
      } catch (error) {
        if (error.name === 'AbortError') {
          console.log('Search request aborted');
          return {results: [], hasMore: false};
        }
        console.error('Search Error:', error);
        return {results: [], hasMore: false, error: error.message};
      }
    },
    [triggerSearchContact],
  );

  const fetchDefaultDataAPI = useCallback(
    async (page = 1, limit = 20, signal) => {
      try {
        const response = await getAllContact(
          {
            page,
            limit,
            category: '',
          },
          {signal},
        ).unwrap();
       
        const results = response.message ?? [];
        const hasMore = results.length === limit;
        const total = results.length;
        return {results, hasMore, total};
      } catch (error) {
        if (error.name === 'AbortError') {
          console.log('Default data request aborted');
          return {results: [], hasMore: false};
        }
        console.error('Default Data Error:', error);
        return {results: [], hasMore: false, error: error.message};
      }
    },
    [getAllContact],
  );

  /** Render Contact Avatar */
  const renderAvatar = useCallback(contact => {
    const mobileNo = contact?.name || 'N/A';
    const {backgroundColor, textColor} = getColorForParticipant(
      mobileNo.toString(),
    );
    const firstLetter = contact?.full_name ? contact.full_name.charAt(0) : '?';

    return (
      <View style={[styles.avatarPlaceholder, {backgroundColor}]}>
        <TextComponent
          text={firstLetter}
          color={textColor}
          size={textScale(15)}
        />
      </View>
    );
  }, []);
  const handleSelectConstact = () => {
    if (onSelect) {
      onSelect(selectedContacts);
    }

    // Reset state before navigating back
    setHasSelection(false);
    setSelectedContacts([]);

    goBack();
  };

  /** Handle Contact Selection */
  const handleSelectContact = useCallback(contact => {
    setSelectedContacts(prevSelectedContacts => {
      const isAlreadySelected = prevSelectedContacts.some(
        item => item.mobile === contact.mobile_no,
      );
      if (isAlreadySelected) {
        const updatedContacts = prevSelectedContacts.filter(
          item => item.mobile !== contact.mobile_no,
        );
        setHasSelection(updatedContacts.length > 0);
        return updatedContacts;
      } else {
        const newSelection = [
          ...prevSelectedContacts,
          {name: contact.full_name, mobile: contact.mobile_no},
        ];
        setHasSelection(true);
        return newSelection;
      }
    });
  }, []);

  /** Render Each Contact Item */
  const renderContactItem = useCallback(
    ({item}) => {
      const isSelected = selectedContacts.some(
        contact => contact.mobile === item.mobile_no,
      );
      const backgroundColor = isSelected
        ? colors.green200
        : isDarkMode
        ? Colors.white
        : '#151414';

      return (
        <TouchableOpacity
          style={[styles.contactItem, {backgroundColor}]}
          activeOpacity={0.7}
          onPress={() => handleSelectContact(item)} // Pass the entire `item` object
        >
          {renderAvatar(item)}
          <View style={styles.contactInfo}>
            <TextComponent
              text={item?.full_name || 'Unknown Contact'}
              color={isDarkMode ? Colors.dark.black : Colors.light.white}
              font={fontNames.ROBOTO_FONT_FAMILY_MEDIUM}
              size={textScale(15)}
            />
            <TextComponent
              text={item?.mobile_no}
              color={isDarkMode ? Colors.dark.black : Colors.light.white}
              size={textScale(13)}
            />
          </View>
          {isSelected && (
            <SvgIcon.CheckIcon
              width={spacing.WIDTH_24}
              height={spacing.HEIGHT_24}
              style={styles.checkIcon}
            />
          )}
        </TouchableOpacity>
      );
    },
    [selectedContacts, isDarkMode, handleSelectContact],
  );

  return (
    <ContainerComponent
      noPadding
      useScrollView={false}
      bottomComponent={
        hasSelection && (
          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleSelectConstact}>
            <TextComponent
              text={`Proceed with ${selectedContacts.length} selected contacts`}
            />
          </TouchableOpacity>
        )
      }>
      <DynamicSearch
        ref={dynamicSearchRef}
        data={[]}
        searchKeys={['full_name', 'mobile_no']}
        dataMode={DataMode.REMOTE}
        searchMode={SearchMode.CONTAINS}
        fetchDefaultData={fetchDefaultDataAPI}
        fetchSearchResults={fetchSearchResultsAPI}
        placeholder="Search contacts..."
        isgoBackArrowShow
        renderCustomItem={renderContactItem}
      />
    </ContainerComponent>
  );
};

export default SearchAndAddMemberForBroadCastGroup;

const styles = StyleSheet.create({
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.PADDING_12,
    borderRadius: spacing.RADIUS_8,
  },
  contactInfo: {
    flex: 1,
    marginLeft: spacing.MARGIN_10,
  },
  checkIcon: {
    marginLeft: spacing.MARGIN_10,
  },
  avatarPlaceholder: {
    width: spacing.HEIGHT_40,
    height: spacing.HEIGHT_40,
    borderRadius: spacing.HEIGHT_40 / 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionButton: {
    marginTop: spacing.MARGIN_12,
    padding: spacing.PADDING_10,
    backgroundColor: Colors.default.accent,
    borderRadius: spacing.RADIUS_8,
    alignItems: 'center',
  },
});
