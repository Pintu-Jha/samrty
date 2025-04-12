import React, { useCallback, useRef, useState } from 'react';
import { StyleSheet, TouchableOpacity, Vibration, View } from 'react-native';
import {
  useDeleteContactMutation,
  useLazyGetAllContactQuery,
} from '../../api/slice/contactSlice';
import { useLazySearchConatctQuery } from '../../api/slice/searchSlice';
import NavigationString from '../../navigations/navigationString';
import { Divider } from '../../styles/commonStyle';
import { textScale } from '../../styles/responsiveStyles';
import { spacing } from '../../styles/spacing';
import { fontNames } from '../../styles/typography';
import Colors from '../../theme/colors';
import colors from '../../utils/colors';
import THEME_COLOR, { DataMode, SearchMode } from '../../utils/constant';
import {
  CommonToastMessage,
  getColorForParticipant,
  navigate,
} from '../../utils/helperFunctions';
import AnimatedModal from '../common/AnimatedModal';
import CommonPopupModal from '../common/CommonPopupModal';
import ContainerComponent from '../common/ContainerComponent';
import DynamicSearch from '../common/DynamicSearch';
import TextComponent from '../common/TextComponent';
import { useTheme } from '../hooks';

const SearchContact = () => {
  const {theme} = useTheme();
  const isDarkMode = theme === THEME_COLOR;
  const [selectedContacts, setSelectedContacts] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isDeleteMode, setIsDeleteMode] = useState(false);
  const [triggerSearchContact] = useLazySearchConatctQuery();
  const [deleteContact] = useDeleteContactMutation();
  const [getAllContact] = useLazyGetAllContactQuery();
  const dynamicSearchRef = useRef(null);

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
  const renderAvatar = contact => {
    const {backgroundColor, textColor} = getColorForParticipant(
      contact.mobile_no.toString(),
    );
    const firstLetter = contact.full_name ? contact.full_name.charAt(0) : '?';
    return (
      <View style={[styles.avatarPlaceholder, {backgroundColor}]}>
        <TextComponent
          text={firstLetter}
          color={textColor}
          size={textScale(18)}
        />
      </View>
    );
  };

  const renderItem = ({item}) => {
    const isSelected = selectedContacts.some(
      selectedItem => selectedItem.mobile_no === item.mobile_no,
    );
    const isSelectionMode = selectedContacts.length > 0;

    const handleSelectContact = () => {
      setSelectedContacts(prevSelectedContacts => {
        // If the item is already selected, deselect it
        if (
          prevSelectedContacts.length > 0 &&
          prevSelectedContacts[0].mobile_no === item.mobile_no
        ) {
          return [];
        }
        setIsModalVisible(true);
        return [
          {
            name: item.full_name,
            mobile_no: item.mobile_no,
          },
        ];
      });
    };

    const handlePress = () => {
      if (isSelectionMode) {
        handleSelectContact();
      } else {
        navigate(NavigationString.ContactListDetailsRowScreen, {
          contactName: item?.full_name,
          mobileNo: item?.mobile_no,
        });
      }
    };

    const handleLongPress = () => {
      if (!isSelected) {
        Vibration.vibrate([50, 100]);
        handleSelectContact();
      }
    };

    return (
      <>
        <TouchableOpacity
          style={[
            styles.contactItem,
            isSelected && styles.selectedContactBackground,
          ]}
          onPress={handlePress}
          onLongPress={handleLongPress}
          activeOpacity={0.7}>
          {renderAvatar(item)}
          <View style={[styles.contactInfo]}>
            <TextComponent
              text={item?.full_name}
              color={isDarkMode ? Colors.dark.black : Colors.light.white}
              size={textScale(15)}
              font={fontNames.ROBOTO_FONT_FAMILY_MEDIUM}
            />
            {item?.company_name && (
              <TextComponent
                text={item?.company_name}
                color={isDarkMode ? Colors.dark.black : Colors.light.white}
                size={textScale(13)}
                font={fontNames.ROBOTO_FONT_FAMILY_MEDIUM}
              />
            )}
            {item?.custom_category && (
              <TextComponent
                text={item?.custom_category}
                color={isDarkMode ? Colors.dark.black : Colors.light.white}
                font={fontNames.ROBOTO_FONT_FAMILY_LIGHT}
                size={textScale(12)}
              />
            )}
          </View>
        </TouchableOpacity>
        <Divider />
      </>
    );
  };

  const handleDeletePress = () => {
    setIsDeleteMode(true);
    setIsModalVisible(false);
  };

  const handleConfirmDeletePress = async () => {
    try {
      const names = selectedContacts.reduce((acc, {name}) => {
        acc.push(name);
        return acc;
      }, []);
      const res = await deleteContact({contact_names: names});
      setSelectedContacts([]);
      setIsDeleteMode(false);
      if (res.data?.status_code === 200) {
        CommonToastMessage('success', res.data?.message);
        setSearchQuery('');
      }
    } catch (error) {
      console.log(error);
      setIsDeleteMode(false);
    }
  };

  const handleCancelDeletePress = () => {
    setSelectedContacts([]);
    setIsDeleteMode(false);
  };

  return (
    <>
      <ContainerComponent noPadding useScrollView={false}>
        <DynamicSearch
          ref={dynamicSearchRef}
          data={[]}
          dataMode={DataMode.REMOTE}
          searchMode={SearchMode.CONTAINS}
          searchKeys={['full_name', 'company_name', 'custom_category']}
          fetchDefaultData={fetchDefaultDataAPI}
          fetchSearchResults={fetchSearchResultsAPI}
          placeholder="Search contacts..."
          isgoBackArrowShow={true}
          renderCustomItem={renderItem}
        />
      </ContainerComponent>
      <CommonPopupModal
        isVisible={isDeleteMode}
        buttons={[
          {
            text: 'Cancel',
            color: colors.red600,
            onPress: handleCancelDeletePress,
          },
          {
            text: 'Delete',
            color: colors.green600,
            onPress: handleConfirmDeletePress,
          },
        ]}
        message="Are you sure you want to Delete"
      />
      <AnimatedModal
        isVisible={isModalVisible}
        close={() => {
          setIsModalVisible(false), setSelectedContacts([]);
        }}
        animationType="none"
        top={spacing.HEIGHT_216}
        left={spacing.HEIGHT_128}
        backDropColor="rgba(255,255,255, 0.3)">
        <TouchableOpacity
          style={{
            backgroundColor: colors.red600,
            opacity: 0.8,
          }}
          activeOpacity={0.8}
          onPress={handleDeletePress}>
          <TextComponent
            text={'Delete Contact'}
            size={textScale(16)}
            color={Colors.default.white}
            font={fontNames.ROBOTO_FONT_FAMILY_BOLD}
            style={{
              paddingHorizontal: spacing.PADDING_16,
              paddingVertical: spacing.PADDING_10,
            }}
          />
        </TouchableOpacity>
      </AnimatedModal>
    </>
  );
};

export default SearchContact;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchInput: {
    height: spacing.HEIGHT_50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: spacing.RADIUS_8,
    paddingHorizontal: spacing.PADDING_16,
    marginBottom: spacing.MARGIN_16,
    color: colors.black,
    flex: 1,
    margin: spacing.MARGIN_16,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.PADDING_6,
  },
  contactInfo: {
    marginLeft: spacing.MARGIN_10,
  },
  contactName: {
    fontSize: textScale(18),
    fontWeight: 'bold',
  },
  avatar: {
    width: spacing.HEIGHT_40,
    height: spacing.HEIGHT_40,
    borderRadius: spacing.HEIGHT_40 / 2,
  },
  avatarPlaceholder: {
    width: spacing.HEIGHT_40,
    height: spacing.HEIGHT_40,
    borderRadius: spacing.HEIGHT_40 / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: textScale(18),
    color: colors.white,
  },
  selectedContactBackground: {
    backgroundColor: colors.green400,
  },
});
