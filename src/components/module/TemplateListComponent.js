import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Alert,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { useLazyGetAllContactQuery } from '../../api/slice/contactSlice';
import { useLazySearchConatctQuery } from '../../api/slice/searchSlice';
import {
  useGetAllTempleteQuery,
  useSendTemplateToMultipleNumberMutation,
  useUploadeMediaMutation,
} from '../../api/slice/templeteSlice';
import * as SvgIcon from '../../assets';
import { Divider } from '../../styles/commonStyle';
import { textScale } from '../../styles/responsiveStyles';
import { spacing } from '../../styles/spacing';
import { fontNames } from '../../styles/typography';
import Colors from '../../theme/colors';
import colors from '../../utils/colors';
import { pickAndSendMediaMessage } from '../../utils/commonImagePicker';
import THEME_COLOR, { DataMode, SearchMode } from '../../utils/constant';
import {
  CommonToastMessage,
  getColorForParticipant,
  openDrawer,
} from '../../utils/helperFunctions';
import AnimatedComponentToggle from '../common/AnimatedComponentToggale';
import AnimatedModal from '../common/AnimatedModal';
import CommoneHeader from '../common/CommoneHeader';
import CommonPopupModal from '../common/CommonPopupModal';
import CustomBottomSheetFlatList from '../common/CustomBottomSheetFlatList';
import CustomButton from '../common/CustomButton';
import CustomInput from '../common/CustomInput';
import DynamicSearch from '../common/DynamicSearch';
import Loader from '../common/Loader';
import TextComponent from '../common/TextComponent';
import { useTheme } from '../hooks';

const TemaplateItemColum = () => {
  const UploadedtoMeta = 'Uploaded to Meta';
  const UploadNow = 'Upload Now';
  const secondBottomSheetRef = useRef(null);
  const templateCategoryBottomSheetRef = useRef(null);
  const dynamicSearchRef = useRef(null);
  const {theme} = useTheme();
  const isDarkMode = theme === THEME_COLOR;
  const [uploadedHeaderSamples, setUploadedHeaderSamples] = useState([]);
  const [templateData, setTemplateData] = useState([]);
  const [filteredTemplates, setFilteredTemplates] = useState([]);

  const [selectedCategory, setSelectedCategory] = useState('All');
  const [templateState, setTemplateState] = useState({
    template: '',
    headerType: '',
    mediaType: '',
    selectedMedia: null,
    uploadedMediaId: '',
    selectedUploadedSampleTitle: '',
    isMediaTypeShowMoadl: false,
    headerNames: {},
  });
  const [uiState, setUiState] = useState({
    selectedCategory: 'All',
    activeTemplateId: null,
    isUploading: false,
    uploadingTemplateId: null,
    modalMessage: '',
    subscribeModalVisible: false,
  });

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedContacts, setSelectedContacts] = useState([]);

  const {data: templeteData, isLoading: isTempleteLoading} =
    useGetAllTempleteQuery();
  const [triggerSearchContact] = useLazySearchConatctQuery();
  const [uploadMidea] = useUploadeMediaMutation();
  const [sendTemplateToMultiplateNumber] =
    useSendTemplateToMultipleNumberMutation();
  const [getAllContact] = useLazyGetAllContactQuery();

  useEffect(() => {
    if (templeteData?.data) {
      setTemplateData(templeteData.data);

      // Extract unique categories
      const categories = Array.from(
        new Set(
          templeteData.data
            .map(item => item.template_category)
            .filter(template_category => template_category),
        ),
      );

      setFilteredTemplates(categories);
    }
  }, [templeteData]);

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
  // Handle contact selection
  const handleSelectContact = contactMobile => {
    setSelectedContacts(prevSelectedContacts => {
      if (prevSelectedContacts.includes(contactMobile)) {
        // If the contact is already selected, remove it
        return prevSelectedContacts.filter(mobile => mobile !== contactMobile);
      } else {
        // If the contact is not selected, add it, but make sure there are no more than 10 contacts selected
        if (prevSelectedContacts.length < 10) {
          // const selectedContact = contacts.find(
          //   contact => contact.mobile_no === contactMobile,
          // );
          // console.log('Selected Contact Details:', selectedContact);
          return [...prevSelectedContacts, contactMobile];
        } else {
          CommonToastMessage('info', 'Cannot select more than 10 contacts.');
          console.log('Cannot select more than 10 contacts.');
          return prevSelectedContacts;
        }
      }
    });
  };

  const renderContactItem = ({item}) => {
    const isSelected = selectedContacts.includes(item.mobile_no);
    const backgroundColor = isSelected
      ? colors.green200
      : isDarkMode
      ? Colors.white
      : '#151414';
    return (
      <>
        <TouchableOpacity
          style={[styles.contactItem, {backgroundColor}]}
          activeOpacity={0.7}
          onPress={() => handleSelectContact(item.mobile_no)}>
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
        <Divider />
      </>
    );
  };

  const handleHeaderNameChange = (templateId, value) => {
    setTemplateState(prev => ({
      ...prev,
      headerNames: {
        ...prev.headerNames,
        [templateId]: value,
      },
    }));
  };

  const handleUploadHeaderSampleLocally = async () => {
    const result = await pickAndSendMediaMessage();
    setTemplateState(prev => ({
      ...prev,
      selectedMedia: result?.status === 'success' ? result?.data : null,
    }));
    if (result.status !== 'success')
      console.log(result.message || 'Error picking file.');
  };
  const handleUploadHeaderSample = async () => {
    try {
      const response = await uploadMidea({
        header_type: templateState.headerType,
      });
      console.log(response);

      setUploadedHeaderSamples(response?.data);
      secondBottomSheetRef.current?.present();
    } catch (error) {
      console.log('Failed to upload sample header:', error);
    }
  };
  const handleUploadedSampleSelect = item => {
    setTemplateState(prev => ({
      ...prev,
      selectedUploadedSampleTitle: item?.title,
      uploadedMediaId: item?.media_id,
    }));
    secondBottomSheetRef.current?.dismiss();
  };

  const handleCategorySelection = category => {
    setSelectedCategory(category);
    if (category === 'All') {
      setTemplateData(templeteData?.data);
    } else {
      const filtered = templeteData?.data?.filter(
        template => template.template_category === category,
      );
      setTemplateData(filtered);
    }
    templateCategoryBottomSheetRef.current?.dismiss();
  };

  const handleSelectTemplateData = item => {
    setUiState(prevUiState => {
      const isCurrentlyActive = prevUiState.activeTemplateId === item.name;

      setTemplateState(prevTemplateState => ({
        ...prevTemplateState,
        template: isCurrentlyActive ? '' : item?.name,
        headerType: isCurrentlyActive ? '' : item?.header_type,
        mediaType: '',
        selectedMedia: null,
        uploadedMediaId: '',
        headerNames: {},
        selectedUploadedSampleTitle: '',
      }));
      setSelectedContacts([]);
      setIsModalVisible(false);
      return {
        ...prevUiState,
        activeTemplateId: isCurrentlyActive ? null : item.name,
      };
    });
  };
  const isDisableTemplateSubmit = useMemo(() => {
    if (['VIDEO', 'IMAGE'].includes(templateState.headerType)) {
      if (templateState.mediaType === 'Upload Now') {
        return (
          !templateState.selectedMedia?.name ||
          !templateState.headerNames[templateState.template]
        );
      }
      if (templateState.mediaType === 'Uploaded at Meta') {
        return (
          !templateState.uploadedMediaId ||
          !templateState.headerNames[templateState.template]
        );
      }
      return true;
    }
    return !templateState.template;
  }, [
    templateState.mediaType,
    templateState.selectedMedia,
    templateState.uploadedMediaId,
    templateState.headerType,
    templateState.headerNames,
    templateState.template,
  ]);
  const handleSubmitTemplate = async () => {
    const requestParam = {
      media_url:
        templateState.mediaType === 'Uploaded at Meta'
          ? templateState.uploadedMediaId
          : '',
      media_type: templateState.mediaType,
      header_type: ['VIDEO', 'IMAGE'].includes(templateState.headerType)
        ? templateState.headerType
        : '',
      template: templateState.template,
      mobile_numbers: selectedContacts,
      components: '',
      filename: templateState.selectedMedia?.name || '',
      filedata:
        templateState.mediaType === 'Upload Now'
          ? templateState.selectedMedia?.base64String
          : '',
      media_name: templateState.headerNames[templateState.template] || '',
    };
    console.log('Request Param:', requestParam);

    // Validation checks before submitting the template
    if (
      templateState.mediaType === 'Upload Now' &&
      !templateState.selectedMedia?.name
    ) {
      CommonToastMessage('error', 'Error', 'Please upload a file');
      return;
    }

    try {
      setUiState(prev => ({...prev, isUploading: true}));
      const res = await sendTemplateToMultiplateNumber(requestParam);
      console.log('API Response:', res);

      if (res?.data?.status_code === 200) {
        CommonToastMessage('success', 'Success', 'Template sent successfully');
        // Reset template state after successful submission
        setTemplateState({
          template: '',
          headerType: '',
          mediaType: '',
          selectedMedia: null,
          uploadedMediaId: '',
          headerNames: {},
          selectedUploadedSampleTitle: '',
        });
        setSelectedContacts([]);
      } else if (res?.data?.status_code === 500) {
        console.log('Status 500 detected, setting modal visible');
        setUiState(prev => ({
          ...prev,
          modalMessage: res?.data?.message,
          subscribeModalVisible: true,
        }));
        setIsModalVisible(false);
      }
    } catch (error) {
      console.error('Error during upload:', error);
      Alert.alert('Failed to upload file.');
    } finally {
      setUiState(prev => ({
        ...prev,
        isUploading: false,
        activeTemplateId: null,
      }));
      setIsModalVisible(false);
    }
  };
  const renderHeaderType = item => {
    if (!['VIDEO', 'IMAGE'].includes(item?.header_type)) return null;
    return (
      <CustomInput
        label="Header Type"
        placeholder="Header Type"
        value={item?.header_type}
        editable={false}
        inputStyles={{
          color: isDarkMode ? Colors.dark.black : Colors.light.white,
        }}
      />
    );
  };
  const renderHeaderNameInput = item => {
    if (!['VIDEO', 'IMAGE'].includes(item?.header_type)) return null;
    return (
      <CustomInput
        label="Header Name"
        placeholder="Header Name"
        required={true}
        value={templateState.headerNames[templateState.template] || ''}
        onChange={value =>
          handleHeaderNameChange(templateState.template, value)
        }
        inputStyles={{
          color: isDarkMode ? Colors.dark.black : Colors.light.white,
        }}
      />
    );
  };
  const renderMediaTypeSection = item => {
    if (!['VIDEO', 'IMAGE'].includes(item?.header_type)) return null;

    return (
      <>
        <CustomInput
          required={true}
          value={templateState.mediaType || 'Select Media Type'}
          onPressTextInput={() => {
            setTemplateState(pre => ({
              ...pre,
              isMediaTypeShowMoadl: !pre.isMediaTypeShowMoadl,
            }));
          }}
          editable={false}
          inputStyles={{
            color: isDarkMode ? Colors.dark.black : Colors.light.white,
          }}
          label="Media Type"
        />
        {templateState.isMediaTypeShowMoadl &&
          [UploadedtoMeta, UploadNow].map(option => (
            <TouchableOpacity
              key={option}
              onPress={() => {
                setTemplateState(prev => ({
                  ...prev,
                  mediaType: option,
                  isMediaTypeShowMoadl: false,
                }));
              }}
              style={{
                paddingVertical: spacing.PADDING_8,
                backgroundColor: Colors.default.accent,

                borderRadius: spacing.RADIUS_6,
                marginVertical: spacing.MARGIN_6,
              }}>
              <TextComponent
                text={option}
                color={Colors.light.white}
                textAlign={'center'}
                size={textScale(16)}
                font={fontNames.ROBOTO_FONT_FAMILY_MEDIUM}
              />
            </TouchableOpacity>
          ))}
      </>
    );
  };
  const renderUploadedSampleSection = item => {
    if (
      !['VIDEO', 'IMAGE'].includes(item?.header_type) ||
      !templateState.mediaType
    )
      return null;

    return (
      <CustomInput
        required={true}
        value={
          templateState.mediaType === UploadedtoMeta
            ? templateState.selectedUploadedSampleTitle ||
              'Select Uploaded Sample'
            : templateState.selectedMedia?.name || 'Upload File'
        }
        onPressTextInput={
          templateState.mediaType === UploadedtoMeta
            ? handleUploadHeaderSample
            : handleUploadHeaderSampleLocally
        }
        editable={false}
        inputStyles={{
          color: isDarkMode ? Colors.dark.black : Colors.light.white,
        }}
        label={
          templateState.mediaType === UploadedtoMeta
            ? 'Uploaded Header Sample'
            : 'Header Sample'
        }
      />
    );
  };
  const renderUploadedSampleItem = ({item}) => (
    <>
      <TouchableOpacity
        style={styles.uploadedSampleItem}
        onPress={() => handleUploadedSampleSelect(item)}>
        <TextComponent
          text={item?.title}
          color={isDarkMode ? Colors.dark.black : Colors.light.white}
        />
      </TouchableOpacity>
      <Divider />
    </>
  );
  const renderUploadedSampleHeader = () => (
    <TextComponent
      text={'Uploaded Header Sample'}
      style={{alignSelf: 'center', marginBottom: spacing.MARGIN_8}}
      size={textScale(18)}
      color={isDarkMode ? Colors.dark.black : Colors.light.white}
    />
  );
  const renderUploadedSampleListEmpty = () => (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <TextComponent
        text={'Item Not Found'}
        size={textScale(20)}
        color={isDarkMode ? Colors.dark.black : Colors.light.white}
      />
    </View>
  );
  const renderTemplateCategoryItem = ({item}) => {
    return (
      <TouchableOpacity
        style={[
          styles.templateCategoryButton,
          selectedCategory === item && styles.selectedTemplateCategory,
        ]}
        onPress={() => handleCategorySelection(item)}>
        <TextComponent
          text={item}
          style={{textTransform: 'capitalize'}}
          size={textScale(15)}
          font={fontNames.ROBOTO_FONT_FAMILY_MEDIUM}
          color={
            selectedCategory === item
              ? Colors.default.white
              : Colors.default.black
          }
          textAlign={'center'}
        />
      </TouchableOpacity>
    );
  };
  const renderTemplateCategoryHeader = () => (
    <TextComponent
      text={'Select Category'}
      color={isDarkMode ? Colors.dark.black : Colors.light.white}
      style={{alignSelf: 'center', marginBottom: spacing.MARGIN_8}}
      size={textScale(15)}
      font={fontNames.ROBOTO_FONT_FAMILY_MEDIUM}
    />
  );

  const renderFilterTempletesItem = ({item}) => {
    return (
      <TouchableOpacity
        style={[
          styles.whatsAppTemplateContainer,
          {borderColor: isDarkMode ? colors.black : colors.white},
        ]}
        activeOpacity={1}>
        <AnimatedComponentToggle
          tabName={item?.name.replace(/_/g, ' ').toUpperCase()}
          isActive={uiState.activeTemplateId === item?.name}
          containerStyle={{paddingHorizontal: 0}}
          onPress={() => handleSelectTemplateData(item)}
          descrption={item?.template_category}>
          <View style={styles.templateContentContainer}>
            <TextComponent
              text={item?.template}
              size={textScale(15)}
              color={Colors.default.black}
            />
          </View>

          <View style={styles.templateDetailsContainer}>
            {renderHeaderType(item)}
            {renderHeaderNameInput(item)}
            {renderMediaTypeSection(item)}
            {renderUploadedSampleSection(item)}
            <CustomButton
              title={'Send to Contacts'}
              onPress={() => {
                setIsModalVisible(true);
              }}
              disabled={isDisableTemplateSubmit}
            />
          </View>
        </AnimatedComponentToggle>
      </TouchableOpacity>
    );
  };

  const handleRightIconPress = index => {
    const actions = {
      0: () => templateCategoryBottomSheetRef.current?.present(),
      1: () => {},
    };

    const action = actions[index];
    if (action) {
      action();
    } else {
    }
  };

  return (
    <>
      <CommoneHeader
        title="Template"
        showLeftIcon={true}
        leftIcon={SvgIcon.MenuIcon}
        onLeftIconPress={() => openDrawer()}
        showRightIcons={true}
        rightIcons={[SvgIcon.Filter, SvgIcon.ReloadIcon]}
        onRightIconPress={handleRightIconPress}
      />

      {isTempleteLoading ? (
        <Loader />
      ) : (
        <FlatList
          data={templateData}
          renderItem={renderFilterTempletesItem}
          keyExtractor={item => item?.name.toString()}
          contentContainerStyle={{paddingBottom: spacing.PADDING_120}}
        />
      )}

      <CustomBottomSheetFlatList
        ref={secondBottomSheetRef}
        snapPoints={['40%']}
        data={uploadedHeaderSamples}
        keyExtractor={item => item?.media_id.toString()}
        renderItem={renderUploadedSampleItem}
        ListHeaderComponent={renderUploadedSampleHeader}
        ListEmptyComponent={renderUploadedSampleListEmpty}
      />

      {/* BottomSheet for WhatsApp Template Categories */}
      <CustomBottomSheetFlatList
        snapPoints={['40%']}
        ref={templateCategoryBottomSheetRef}
        data={['All', ...filteredTemplates]}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderTemplateCategoryItem}
        ListHeaderComponent={renderTemplateCategoryHeader}
      />

      {/* Common Popup Modal for unsubscribe */}
      <CommonPopupModal
        isVisible={uiState.subscribeModalVisible}
        buttons={[
          {
            text: 'OK',
            color: colors.red600,
            onPress: () => {
              setUiState(prev => ({...prev, subscribeModalVisible: false}));
            },
          },
        ]}
        message={uiState.modalMessage}
        messageColor={colors.red600}
      />
      <AnimatedModal
        isVisible={isModalVisible}
        close={() => setIsModalVisible(false)}
        animationType="bottom-to-top"
        backDropColor="rgba(0, 0, 0, 0.5)"
        modalStyle={{
          width: '100%',
          borderRadius: 0,
          backgroundColor: isDarkMode ? colors.white : colors.black,
          height: '100%',
        }}>
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
          goBackArrowPress={() => setIsModalVisible(false)}
        />
        {selectedContacts.length > 0 && (
          <CustomButton
            title={`Proceed with ${selectedContacts.length} selected contacts`}
            onPress={handleSubmitTemplate}
            isLoading={uiState.isUploading}
          />
        )}
      </AnimatedModal>
    </>
  );
};

export default TemaplateItemColum;

const styles = StyleSheet.create({
  whatsAppTemplateContainer: {
    paddingHorizontal: spacing.PADDING_16,
    marginVertical: spacing.MARGIN_6,
    borderRadius: spacing.RADIUS_12,
    flex: 1,
    borderBottomWidth: 0.2,
  },
  templateContentContainer: {
    padding: spacing.PADDING_16,
    backgroundColor: colors.grey200,
    marginVertical: spacing.MARGIN_8,
    borderRadius: spacing.RADIUS_8,
  },
  templateText: {
    fontSize: textScale(15),
    fontFamily: fontNames.POPPINS_FONT_FAMILY_REGULAR,
    color: colors.grey800,
  },
  templateDetailsContainer: {
    marginVertical: spacing.MARGIN_8,
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    borderRadius: 100,
    padding: spacing.PADDING_12,
    zIndex: 10,
    backgroundColor: '#fff',
    elevation: 5,
  },
  closeButtonText: {
    fontSize: textScale(20),
    color: '#000',
  },
  sendTemplateButton: {
    backgroundColor: colors.green600,
    marginHorizontal: spacing.MARGIN_16,
    borderWidth: 0,
    position: 'absolute',
    bottom: 2,
    width: '90%',
    alignSelf: 'center',
  },
  sendTemplateButtonText: {
    color: colors.white,
    fontSize: textScale(16),
    fontFamily: fontNames.POPPINS_FONT_FAMILY_MEDIUM,
  },
  selectContactsButton: {
    backgroundColor: colors.green600,
    marginVertical: spacing.MARGIN_10,
  },
  selectContactsButtonText: {
    color: colors.white,
    fontSize: textScale(16),
    fontFamily: fontNames.POPPINS_FONT_FAMILY_MEDIUM,
  },
  filterTitle: {
    fontSize: textScale(18),
    fontFamily: fontNames.POPPINS_FONT_FAMILY_SEMI_BOLD,
    alignSelf: 'center',
    marginBottom: spacing.MARGIN_8,
  },
  uploadedSampleItem: {
    backgroundColor: colors.grey100,
    marginVertical: spacing.PADDING_8,
    borderRadius: spacing.RADIUS_10,
    paddingHorizontal: spacing.PADDING_16,
    paddingVertical: spacing.PADDING_12,
  },
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
  avatarPlaceholder: {
    width: spacing.HEIGHT_40,
    height: spacing.HEIGHT_40,
    borderRadius: spacing.HEIGHT_40 / 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noDataText: {
    textAlign: 'center',
    marginTop: spacing.MARGIN_12,
    color: colors.grey600,
    fontSize: textScale(15),
    fontFamily: fontNames.POPPINS_FONT_FAMILY_REGULAR,
  },
  flatListContainer: {
    paddingBottom: spacing.PADDING_24,
  },
  addContactBtnContainer: {
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: spacing.RADIUS_8,
    padding: spacing.PADDING_6,
    marginLeft: spacing.MARGIN_8,
    elevation: 2,
  },
  categoryTemplateText: {
    fontSize: textScale(15),
    color: colors.black,
    fontFamily: fontNames.POPPINS_FONT_FAMILY_SEMI_BOLD,
    textTransform: 'capitalize',
  },
  headerTypeButton: {
    backgroundColor: colors.grey500,
    borderWidth: 0,
  },
  headerTypeButtonText: {
    color: colors.white,
    fontSize: textScale(16),
    fontFamily: fontNames.POPPINS_FONT_FAMILY_BOLD,
  },
  headerNameInput: {
    borderWidth: 1,
    padding: spacing.PADDING_12,
    borderColor: colors.grey600,
    borderRadius: spacing.RADIUS_8,
    color: colors.black,
    fontSize: textScale(16),
    fontFamily: fontNames.ROBOTO_FONT_FAMILY_MEDIUM,
  },
  bottomCompStyle: {
    backgroundColor: colors.grey500,
    borderRadius: spacing.RADIUS_8,
    borderWidth: 0,
  },
  bottomCompTextStyle: {
    color: colors.white,
    fontSize: textScale(16),
    fontFamily: fontNames.POPPINS_FONT_FAMILY_BOLD,
  },
  headerTypeTitle: {
    fontFamily: fontNames.ROBOTO_FONT_FAMILY_REGULAR,
    fontSize: textScale(18),
    color: colors.black,
    marginVertical: spacing.MARGIN_6,
  },
  headerNameTitle: {
    fontFamily: fontNames.ROBOTO_FONT_FAMILY_REGULAR,
    fontSize: textScale(18),
    color: colors.black,
    marginVertical: spacing.MARGIN_6,
  },
  mediaTypeText: {
    fontFamily: fontNames.ROBOTO_FONT_FAMILY_REGULAR,
    fontSize: textScale(18),
    color: colors.black,
    marginVertical: spacing.MARGIN_6,
  },
  uploadedHeaderSampleTitle: {
    fontFamily: fontNames.ROBOTO_FONT_FAMILY_REGULAR,
    fontSize: textScale(18),
    color: colors.black,
    marginVertical: spacing.MARGIN_6,
  },
  uploadedSampleButton: {
    backgroundColor: colors.grey500,
    padding: spacing.PADDING_14,
    borderRadius: spacing.RADIUS_8,
    borderWidth: 0,
  },
  uploadNowButton: {
    backgroundColor: colors.grey500,
    padding: spacing.PADDING_14,
    borderRadius: spacing.RADIUS_8,
    borderWidth: 0,
  },
  uploadedSampleButtonText: {
    color: colors.white,
    fontSize: textScale(16),
    fontFamily: fontNames.POPPINS_FONT_FAMILY_BOLD,
  },
  uploadNowButtonText: {
    color: colors.white,
    fontSize: textScale(14),
    fontFamily: fontNames.POPPINS_FONT_FAMILY_BOLD,
  },
  uploadedtoggleText: {
    borderBottomWidth: 1,
    textAlign: 'center',
    marginVertical: spacing.MARGIN_6,
  },
  avatarText: {
    fontSize: textScale(15),
  },
  contactName: {
    fontFamily: fontNames.POPPINS_FONT_FAMILY_MEDIUM,
    fontSize: textScale(15),
    color: colors.black,
  },
  contactMobile: {
    fontFamily: fontNames.POPPINS_FONT_FAMILY_REGULAR,
    fontSize: textScale(13),
    color: colors.black,
  },
  templateCategoryButton: {
    padding: spacing.PADDING_12,
    margin: spacing.MARGIN_8,
    borderRadius: spacing.RADIUS_8,
    backgroundColor: colors.grey200,
  },
  selectedTemplateCategory: {
    backgroundColor: colors.green,
  },
});
