import { useNavigation } from '@react-navigation/native';
import React, { useCallback, useRef, useState } from 'react';
import { Alert, FlatList, TouchableOpacity, View } from 'react-native';
import {
  useCreateNewGroupMutation,
  useGetBroadCastGroupQuery,
  useLazyGetCriteriaQuery,
  useLazyGetLogicalQperatorQuery,
  useLazyGetOperatorQuery,
} from '../../api/slice/broadCastGroupSlice';
import { useLazyGetAllContactQuery } from '../../api/slice/contactSlice';
import { useLazySearchConatctQuery } from '../../api/slice/searchSlice';
import * as SvgIcon from '../../assets/index';
import DynamicFiltersRow from '../../components/colums/broadCastGroup/DynamicFiltersRow';
import GroupInfo from '../../components/colums/broadCastGroup/GroupInfo';
import GroupListEmpty from '../../components/colums/broadCastGroup/GroupListEmpty';
import ListFooterComponent from '../../components/colums/broadCastGroup/ListFooterComponent';
import { styles } from '../../components/colums/broadCastGroup/styles';
import BroadCastGroupColum from '../../components/colums/BroadCastGroupColum';
import AnimatedModal from '../../components/common/AnimatedModal';
import CommonHeader from '../../components/common/CommoneHeader';
import ContainerComponent from '../../components/common/ContainerComponent';
import CustomBottomSheetFlatList from '../../components/common/CustomBottomSheetFlatList';
import CustomButton from '../../components/common/CustomButton';
import DynamicSearch from '../../components/common/DynamicSearch';
import LoadingScreen from '../../components/common/Loader';
import TextComponent from '../../components/common/TextComponent';
import { useTheme } from '../../components/hooks';
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
  openDrawer,
} from '../../utils/helperFunctions';

const ListHeaderComponent = ({
  groupName,
  title,
  setCreateGroup,
  isDarkMode,
  selectedContacts,
  isContactBtn,
  setIsSearchModalVisible,
  setIsDynamicFilters,
}) => {
  return (
    <View>
      <TextComponent
        text={'Create New Group'}
        color={isDarkMode ? Colors.dark.black : Colors.light.white}
        size={textScale(16)}
        style={{alignSelf: 'center', marginVertical: spacing.MARGIN_4}}
        font={fontNames.ROBOTO_FONT_FAMILY_MEDIUM}
      />
      <GroupInfo
        groupName={groupName}
        title={title}
        setCreateGroup={setCreateGroup}
      />
      {isContactBtn && (
        <CustomButton
          title={
            selectedContacts?.size
              ? `Selected Contacts ${selectedContacts?.size}`
              : 'Select Contacts'
          }
          onPress={() => {
            setIsSearchModalVisible(true);
            setIsDynamicFilters(false);
          }}
          buttonStyle={{marginHorizontal: spacing.MARGIN_10}}
        />
      )}
    </View>
  );
};

const BroadCastGroup = () => {
  const navigation = useNavigation();
  const clearContact = () => {
    navigation.setParams({contact: undefined});
  };

  const {theme} = useTheme();
  const isDarkMode = theme === THEME_COLOR;
  const createGroupRef = useRef(null);
  const isMounted = useRef(true);
  const dynamicFiltersSubOptionRef = useRef(null);
  const dynamicSearchRef = useRef(null);

  const {
    data: GetBroadCastGroup,
    isLoading: isLoadingGetBroadCast,
    isError: isErrorGetBroadCast,
    refetch: refetchBroadCastGroup,
  } = useGetBroadCastGroupQuery();

  // Lazy query triggers
  const [triggerGetCriteria] = useLazyGetCriteriaQuery();
  const [triggerGetOperator] = useLazyGetOperatorQuery();
  const [triggerGetLogicalQperator] = useLazyGetLogicalQperatorQuery();

  const [createNewGroup] = useCreateNewGroupMutation();
  const [triggerSearchContact] = useLazySearchConatctQuery();
  const [getAllContact] = useLazyGetAllContactQuery();

  // State variables
  const [createGroup, setCreateGroup] = useState({
    title: '',
    groupName: '',
  });
  const [isCreatingGroup, setIsCreatingGroup] = useState(false);
  const [isDynamicFilters, setIsDynamicFilters] = useState(true);
  const [isContactBtn, setIsContactBtn] = useState(true);
  const [dynamicFilters, setDynamicFilters] = useState([]);
  const [dynamicFiltersSubOption, setDynamicFiltersSubOption] = useState([]);
  const [dynamicSelectedFilterType, setDynamicSelectedFilterType] =
    useState('');
  const [selectedFilterIndex, setSelectedFilterIndex] = useState(null);

  const [isSearchModalVisible, setIsSearchModalVisible] = useState(false);
  const [selectedContacts, setSelectedContacts] = useState(new Set());

  // Reset form function enhanced to clear selected contacts and reset isContactBtn
  const resetForm = useCallback(() => {
    setIsDynamicFilters(true);
    clearContact();
    setDynamicFilters([]);
    setCreateGroup({title: '', groupName: ''});
    setSelectedContacts(new Set());
    setIsContactBtn(true);
  }, []);

  // Create group handler
  const createGroupHandler = async () => {
    if (!createGroup.groupName.trim()) {
      CommonToastMessage('info', 'Please enter a group name.');
      return;
    }
    if (!createGroup.title.trim()) {
      CommonToastMessage('info', 'Please enter a title.');
      return;
    }
    setIsCreatingGroup(true);

    try {
      let payload = {
        group_name: createGroup.groupName.trim(),
        title: createGroup.title.trim(),
      };

      if (dynamicFilters.length > 0) {
        payload = {
          ...payload,
          is_dynamic_group: 1,
          dynamic_filters: dynamicFilters.map(filter => ({
            filter_on_field: filter.filterOnField,
            criteria: filter.operator,
            value: filter.value,
            logical_operator: filter.logicalOperator,
          })),
        };
      } else {
        const formattedContacts = Array.from(selectedContacts).map(contact => ({
          group_member: contact.trim(),
        }));

        payload = {
          ...payload,
          is_dynamic_group: 0,
          contacts: formattedContacts,
        };
      }
      console.log(payload);

      const response = await createNewGroup(payload);

      if (!isMounted.current) return;

      if (response.data?.status_code === 200) {
        CommonToastMessage('success', 'Group created successfully');
        createGroupRef.current?.dismiss();
        resetForm();
        refetchBroadCastGroup();
      } else {
        CommonToastMessage('error', response.data?.message);
      }
    } catch (error) {
      if (!isMounted.current) return;
      console.error('Error creating group:', error);
      Alert.alert(
        'Error',
        error.message || 'An error occurred while creating the group.',
      );
    } finally {
      if (isMounted.current) {
        setIsCreatingGroup(false);
      }
    }
  };

  // Add filter row
  const addFilterRow = () => {
    if (isContactBtn) {
      setIsContactBtn(false);
    }
    setDynamicFilters(prevFilters => [
      ...prevFilters,
      {filterOnField: '', operator: '', value: '', logicalOperator: ''},
    ]);
  };

  // Improved dynamic filter API call handler
  const handleDynamicFilterApiCall = async (filterType, index) => {
    try {
      let result;
      switch (filterType) {
        case 'filterOnField':
          result = await triggerGetCriteria();
          break;
        case 'operator':
          result = await triggerGetOperator();
          break;
        case 'logicalOperator':
          result = await triggerGetLogicalQperator();
          break;
        default:
          return;
      }

      if (result?.data?.status_code === 200) {
        setDynamicFiltersSubOption(result.data.data);
        setDynamicSelectedFilterType(filterType);
        setSelectedFilterIndex(index);
        dynamicFiltersSubOptionRef.current?.present();
      } else if (result?.data?.status_code === 404) {
        CommonToastMessage('info', result.data.message);
      }
    } catch (error) {
      console.error(`Error fetching ${filterType} options:`, error);
      CommonToastMessage('error', `Failed to fetch ${filterType} options`);
    }
  };

  // Handle option selection
  const handleSelectOption = option => {
    setDynamicFilters(prevFilters => {
      const updatedFilters = [...prevFilters];
      if (selectedFilterIndex !== null) {
        updatedFilters[selectedFilterIndex][dynamicSelectedFilterType] =
          option.name || option;
      }
      return updatedFilters;
    });
    dynamicFiltersSubOptionRef.current?.dismiss();
  };

  // Handle filter change
  const handleFilterChange = (index, key, value) => {
    setDynamicFilters(prevFilters => {
      const updatedFilters = [...prevFilters];
      updatedFilters[index] = {
        ...updatedFilters[index],
        [key]: value,
      };
      return updatedFilters;
    });
  };
  const handleRemoveRow = index => {
    if (dynamicFilters.length === 1) {
      setIsContactBtn(true);
    }
    setDynamicFilters(prevFilters => prevFilters.filter((_, i) => i !== index));
  };

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

  const handleSelectContact = contact => {
    setSelectedContacts(prevSelected => {
      // Create a new Set instance to trigger a re-render
      const newSelected = new Set(prevSelected);

      if (newSelected.has(contact.name)) {
        // If the contact is already selected, remove it
        newSelected.delete(contact.name);
      } else {
        // If the contact is not selected and we haven't reached the limit, add it
        if (newSelected.size < 10) {
          newSelected.add(contact.name);
        } else {
          CommonToastMessage('info', 'Cannot select more than 10 contacts.');
          console.log('Cannot select more than 10 contacts.');
        }
      }
      return newSelected;
    });
  };

  const renderAvatar = contact => {
    const {backgroundColor, textColor} = getColorForParticipant(
      contact.mobile_no.toString(),
    );
    const firstLetter = contact.full_name ? contact.full_name.charAt(0) : '?';
    return (
      <View
        style={[styles.avatarPlaceholder, {backgroundColor: backgroundColor}]}>
        <TextComponent
          text={firstLetter}
          color={textColor}
          size={textScale(15)}
        />
      </View>
    );
  };

  const renderContactItem = ({item}) => {
    // Use the Set for O(1) lookup
    const isSelected = selectedContacts.has(item.name);
    const backgroundColor = isSelected
      ? colors.green200
      : isDarkMode
      ? Colors.white
      : '#151414';

    return (
      <TouchableOpacity
        style={[styles.contactItem, {backgroundColor}]}
        activeOpacity={0.7}
        onPress={() => handleSelectContact(item)}>
        {renderAvatar(item)}
        <View style={styles.contactInfo}>
          <TextComponent
            text={item?.full_name}
            color={isDarkMode ? Colors.dark.black : Colors.light.white}
            size={textScale(15)}
            font={fontNames.ROBOTO_FONT_FAMILY_MEDIUM}
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
            style={{marginLeft: 'auto'}}
          />
        )}
      </TouchableOpacity>
    );
  };

  return (
    <>
      <ContainerComponent noPadding useScrollView={false}>
        <View style={styles.container}>
          <CommonHeader
            title={'Broadcast Group'}
            showLeftIcon={true}
            leftIcon={SvgIcon.MenuIcon}
            onLeftIconPress={openDrawer}
            showRightIcons={true}
            rightIcons={[SvgIcon.ReloadIcon]}
            onRightIconPress={refetchBroadCastGroup}
          />

          {isLoadingGetBroadCast ? (
            <LoadingScreen />
          ) : (
            <FlatList
              data={GetBroadCastGroup?.data}
              keyExtractor={item => item?.name?.toString()}
              renderItem={({item}) => <BroadCastGroupColum item={item} />}
              ListEmptyComponent={
                <GroupListEmpty
                  isErrorGetBroadCast={isErrorGetBroadCast}
                  isDarkMode={isDarkMode}
                />
              }
            />
          )}
        </View>
      </ContainerComponent>
      <CustomButton
        title={`Create Group`}
        onPress={() => {
          resetForm();
          createGroupRef.current?.present();
        }}
        iconLeft={
          <SvgIcon.AddICon
            color={colors.white}
            width={spacing.WIDTH_30}
            height={spacing.HEIGHT_30}
          />
        }
        buttonStyle={styles.createGroupButton}
      />

      <CustomBottomSheetFlatList
        ref={createGroupRef}
        snapPoints={['90%']}
        enableDynamicSizing={false}
        data={dynamicFilters}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({item, index}) => (
          <DynamicFiltersRow
            index={index}
            filter={item}
            isDarkMode={false}
            onFilterChange={handleFilterChange}
            onDynamicFilterApiCall={filterType =>
              handleDynamicFilterApiCall(filterType, index)
            }
            onRemoveRow={handleRemoveRow}
          />
        )}
        contentContainerStyle={styles.contentContainer}
        ListHeaderComponent={
          <ListHeaderComponent
            groupName={createGroup.groupName}
            title={createGroup.title}
            setCreateGroup={setCreateGroup}
            setIsDynamicFilters={setIsDynamicFilters}
            isDarkMode={isDarkMode}
            selectedContacts={selectedContacts}
            isContactBtn={isContactBtn}
            setIsSearchModalVisible={setIsSearchModalVisible}
          />
        }
        ListFooterComponent={
          <ListFooterComponent
            isDynamicFilters={isDynamicFilters}
            dynamicFilters={dynamicFilters}
            addFilterRow={addFilterRow}
            createGroupHandler={createGroupHandler}
            isCreatingGroup={isCreatingGroup}
            selectedContacts={selectedContacts}
          />
        }
      />

      <AnimatedModal
        isVisible={isSearchModalVisible}
        close={() => setIsSearchModalVisible(false)}
        animationType="bottom-to-top"
        modalStyle={{
          width: '100%',
          borderRadius: 0,
          backgroundColor: isDarkMode ? colors.white : colors.black,
          height: '100%',
        }}>
        <DynamicSearch
          ref={dynamicSearchRef}
          data={[]}
          dataMode={DataMode.REMOTE}
          searchMode={SearchMode.CONTAINS}
          searchKeys={['full_name', 'mobile_no']}
          fetchSearchResults={fetchSearchResultsAPI}
          fetchDefaultData={fetchDefaultDataAPI}
          placeholder="Search contacts..."
          minCharacters={1}
          isgoBackArrowShow
          renderCustomItem={renderContactItem}
          goBackArrowPress={() => setIsSearchModalVisible(false)}
        />
        {selectedContacts.size > 0 && (
          <CustomButton
            title={`Proceed with ${selectedContacts.size} selected contacts`}
            onPress={() => setIsSearchModalVisible(false)}
          />
        )}
      </AnimatedModal>

      <CustomBottomSheetFlatList
        ref={dynamicFiltersSubOptionRef}
        data={dynamicFiltersSubOption}
        snapPoints={['60%']}
        keyExtractor={(item, index) => {
          if (item.hasOwnProperty('name')) {
            return `criteria-${item.name
              .toLowerCase()
              .replace(/\s+/g, '-')}-${index}`;
          }

          if (typeof item === 'string') {
            return `operator-${item
              .toLowerCase()
              .replace(/\s+/g, '-')}-${index}`;
          }
          return `item-${index}`;
        }}
        renderItem={({item}) => {
          return (
            <>
              <TouchableOpacity
                style={{
                  paddingHorizontal: spacing.PADDING_10,
                  paddingVertical: spacing.PADDING_16,
                }}
                onPress={() => handleSelectOption(item)}>
                <TextComponent
                  text={item.name || item}
                  size={textScale(16)}
                  color={isDarkMode ? Colors.dark.black : Colors.light.white}
                  font={fontNames.ROBOTO_FONT_FAMILY_MEDIUM}
                />
              </TouchableOpacity>
              <Divider />
            </>
          );
        }}
        ListHeaderComponent={
          <TextComponent
            text={dynamicSelectedFilterType}
            size={textScale(16)}
            color={isDarkMode ? Colors.dark.black : Colors.light.white}
            font={fontNames.ROBOTO_FONT_FAMILY_MEDIUM}
            textAlign={'center'}
            style={{
              paddingVertical: spacing.PADDING_10,
              textTransform: 'capitalize',
            }}
          />
        }
      />
    </>
  );
};

export default BroadCastGroup;
