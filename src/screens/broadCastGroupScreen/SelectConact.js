import React, { useCallback, useRef, useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { useLazySearchContactQuery } from '../../api/slice/contactSlice';
import * as SvgIcon from '../../assets';
import ContainerComponent from '../../components/common/ContainerComponent';
import CustomButton from '../../components/common/CustomButton';
import DynamicSearch from '../../components/common/DynamicSearch';
import TextComponent from '../../components/common/TextComponent';
import { useTheme } from '../../components/hooks';
import NavigationString from '../../navigations/navigationString';
import { textScale } from '../../styles/responsiveStyles';
import { spacing } from '../../styles/spacing';
import { fontNames } from '../../styles/typography';
import Colors from '../../theme/colors';
import colors from '../../utils/colors';
import THEME_COLOR from '../../utils/constant';
import { getColorForParticipant, replace } from '../../utils/helperFunctions';

const SelectContact = () => {
  const {theme} = useTheme();
  const isDarkMode = theme === THEME_COLOR;
  const dynamicSearchRef = useRef(null);

  const [hasSelection, setHasSelection] = useState(false);
  const [selectedContacts, setSelectedContacts] = useState([]);
  const [triggerSearchContact] = useLazySearchContactQuery();

  /** Fetch Contacts (API call) */
  const handleFetchSearchResults = useCallback(
    async (text, abortSignal) => {
      if (abortSignal?.aborted) return [];

      try {
        const {data} = await triggerSearchContact({
          search_query: text,
          page: 1,
          limit: 30,
        }).unwrap();
        return data || [];
      } catch (err) {
        console.error('Error fetching contacts:', err);
        return [];
      }
    },
    [triggerSearchContact],
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

  const handleSelectConstact = () => (
    setHasSelection(false),
    setSelectedContacts([]),
    replace(NavigationString.DrawerBar, {
      screen: NavigationString.broadCastGroupScreen,
      params: {contact: selectedContacts},
    })
  );

  /** Handle Contact Selection */
  const handleSelectContact = useCallback(contactMobile => {
    setSelectedContacts(prevSelected => {
      const isSelected = prevSelected.includes(contactMobile);
      const updatedSelection = isSelected
        ? prevSelected.filter(mobile => mobile !== contactMobile)
        : [...prevSelected, contactMobile];

      setHasSelection(updatedSelection.length > 0);
      return updatedSelection;
    });
  }, []);

  /** Render Each Contact Item */
  const renderContactItem = useCallback(
    ({item}) => {
      const id = item?.name;
      if (!id) return null;

      const isSelected = selectedContacts.includes(id);
      const backgroundColor = isSelected
        ? colors.green200
        : isDarkMode
        ? Colors.white
        : '#151414';

      return (
        <TouchableOpacity
          style={[styles.contactItem, {backgroundColor}]}
          activeOpacity={0.7}
          onPress={() => handleSelectContact(id)}>
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
          <CustomButton
            title={`Proceed with ${selectedContacts.length} selected contacts`}
            onPress={handleSelectConstact}
          />
        )
      }>
      <DynamicSearch
        ref={dynamicSearchRef}
        data={[]} // Initially empty
        searchKeys={['full_name', 'mobile_no', 'custom_category']}
        useRemoteSearch
        fetchSearchResults={handleFetchSearchResults}
        placeholder="Search contacts..."
        debounceTime={400}
        minCharacters={1}
        maxResults={50}
        isgoBackArrowShow
        renderCustomItem={renderContactItem}
      />
    </ContainerComponent>
  );
};

export default SelectContact;

const styles = StyleSheet.create({
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.PADDING_12,
    borderRadius: spacing.RADIUS_8,
    marginVertical: spacing.MARGIN_4,
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
