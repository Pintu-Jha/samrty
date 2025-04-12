import React, {useEffect, useMemo, useRef, useState} from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {
  useGetAllTempleteQuery,
  useSendTemplateMutation,
  useUploadeMediaMutation,
} from '../../api/slice/templeteSlice';
import * as SvgIcon from '../../assets';
import {Divider} from '../../styles/commonStyle';
import {textScale} from '../../styles/responsiveStyles';
import {spacing} from '../../styles/spacing';
import {fontNames} from '../../styles/typography';
import Colors from '../../theme/colors';
import colors from '../../utils/colors';
import {pickAndSendMediaMessage} from '../../utils/commonImagePicker';
import THEME_COLOR from '../../utils/constant';
import {CommonToastMessage} from '../../utils/helperFunctions';
import AnimatedComponentToggle from '../common/AnimatedComponentToggale';

import CommonPopupModal from '../common/CommonPopupModal';
import CustomBottomSheetFlatList from '../common/CustomBottomSheetFlatList';
import CustomButton from '../common/CustomButton';
import CustomInput from '../common/CustomInput';
import Loader from '../common/Loader';
import TextComponent from '../common/TextComponent';
import {useTheme} from '../hooks';

const TemaplateItemColum = ({Mobile_No, templateBottomSheetRef}) => {
  const UploadedtoMeta = 'Uploaded to Meta';
  const UploadNow = 'Upload Now';
  const {theme} = useTheme();
  const isDarkMode = theme === THEME_COLOR;

  const secondBottomSheetRef = useRef(null);
  const templateCategoryBottomSheetRef = useRef(null);

  const {data: templeteData, isLoading: isTempleteLoading} =
    useGetAllTempleteQuery();
  const [uploadMidea] = useUploadeMediaMutation();
  const [sendTemplate] = useSendTemplateMutation();

  const [mediaModalVisible, setMediaModalVisible] = useState(false);
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
    headerNames: {},
    isMediaTypeShowMoadl: false,
  });
  const [uiState, setUiState] = useState({
    selectedCategory: 'All',
    activeTemplateId: null,
    isUploading: false,
    uploadingTemplateId: null,
    modalMessage: '',
    subscribeModalVisible: false,
  });

  const handleHeaderNameChange = (templateId, value) => {
    setTemplateState(prev => ({
      ...prev,
      headerNames: {
        ...prev.headerNames,
        [templateId]: value,
      },
    }));
  };

  useEffect(() => {
    if (templeteData?.data) {
      setTemplateData(templeteData.data);
      const categories = templeteData.data
        .map(item => item.template_category)
        .filter(template_category => template_category);

      setFilteredTemplates(categories);
    }
  }, [templeteData]);

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
    secondBottomSheetRef.current?.close();
  };

  const handleCategorySelection = category => {
    if (category === 'All') {
      setTemplateData(templeteData?.data);
    } else {
      const filtered = templateData.filter(
        template => template.template_category === category,
      );
      setTemplateData(filtered);
    }
    templateCategoryBottomSheetRef.current?.close();
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
      } else if (templateState.mediaType === 'Uploaded at Meta') {
        return (
          !templateState.uploadedMediaId ||
          !templateState.headerNames[templateState.template]
        );
      }
      return true; // Enable button if media type conditions are met
    } else {
      // Enable button if header type is not VIDEO or IMAGE and the template name is provided
      return !templateState.template;
    }
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
      mobile: Mobile_No,
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
      const res = await sendTemplate(requestParam).unwrap();
      console.log('API Response:', res);

      if (res?.status_code === 200) {
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
      } else if (res?.status_code === 500) {
        console.log('Status 500 detected, setting modal visible');
        setUiState(prev => ({
          ...prev,
          modalMessage: res?.data?.message,
          subscribeModalVisible: true,
        }));
      }
    } catch (error) {
      console.error('Error during upload:', error);
      CommonToastMessage('error', 'Error', 'Error during upload');
    } finally {
      setUiState(prev => ({...prev, activeTemplateId: null}));
      setUiState(prev => ({...prev, isUploading: false}));
      templateBottomSheetRef.current?.close();
    }
  };
  const RenderHeaderType = ({item}) => {
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
  const RenderHeaderNameInput = ({item}) => {
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
  const RenderMediaTypeSection = ({item}) => {
    if (!['VIDEO', 'IMAGE'].includes(item?.header_type)) return null;

    return (
      <>
        <CustomInput
          required={true}
          value={templateState.mediaType || 'Select Media Type'}
          onPressTextInput={() =>
            setTemplateState(pre => ({
              ...pre,
              isMediaTypeShowMoadl: !pre.isMediaTypeShowMoadl,
            }))
          }
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
  const RenderUploadedSampleSection = ({item}) => {
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
  const renderListHeaderComponent = () => (
    <>
      <View style={styles.headerContainer}>
        <TextComponent
          text={'WhatsApp Template'}
          color={isDarkMode ? Colors.dark.black : Colors.light.white}
          size={textScale(18)}
          font={fontNames.ROBOTO_FONT_FAMILY_BOLD}
          style={{marginVertical: spacing.MARGIN_6, alignSelf: 'center'}}
        />
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <TouchableOpacity
            style={styles.filterIconContainer}
            onPress={() => templateCategoryBottomSheetRef.current?.present()}>
            <SvgIcon.Filter
              height={spacing.HEIGHT_24}
              width={spacing.WIDTH_24}
              color={isDarkMode ? colors.black : colors.white}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => templateBottomSheetRef.current?.close()}>
            <SvgIcon.Wrong
              height={spacing.HEIGHT_24}
              width={spacing.WIDTH_24}
              color={isDarkMode ? colors.black : colors.white}
            />
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
  const renderUploadedSampleItem = ({item}) => (
    <TouchableOpacity
      style={styles.uploadedSampleItem}
      onPress={() => handleUploadedSampleSelect(item)}>
      <TextComponent
        text={item?.title}
        font={fontNames.ROBOTO_FONT_FAMILY_MEDIUM}
      />
    </TouchableOpacity>
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
  const renderUploadedSampleHeader = () => (
    <TextComponent
      text={'Uploaded Header Sample'}
      color={isDarkMode ? Colors.dark.black : Colors.light.white}
      size={textScale(18)}
      style={{alignSelf: 'center'}}
      font={fontNames.ROBOTO_FONT_FAMILY_MEDIUM}
    />
  );
  const renderTemplateCategoryItem = ({item}) => {
    if (!item) return;
    return (
      <TouchableOpacity
        style={[
          styles.templateCategoryButton,
          selectedCategory === item && styles.selectedTemplateCategory,
        ]}
        onPress={() => handleCategorySelection(item)}>
        <TextComponent
          text={item}
          color={
            selectedCategory === item ? Colors.dark.black : Colors.light.white
          }
          style={{textTransform: 'capitalize'}}
          font={fontNames.ROBOTO_FONT_FAMILY_MEDIUM}
        />
      </TouchableOpacity>
    );
  };
  const renderTemplateCategoryHeader = () => (
    <TextComponent
      text={'Select Category'}
      color={isDarkMode ? Colors.dark.black : Colors.light.white}
      size={textScale(18)}
      style={{alignSelf: 'center'}}
      font={fontNames.ROBOTO_FONT_FAMILY_MEDIUM}
    />
  );

  const renderTemplateItem = ({item}) => {
    return (
      <>
        <TouchableOpacity
          style={[styles.whatsAppTemplateContainer]}
          activeOpacity={1}>
          <AnimatedComponentToggle
            tabName={item?.name.replace(/_/g, ' ').toUpperCase()}
            isActive={uiState.activeTemplateId === item?.name}
            containerStyle={{paddingHorizontal: 0}}
            onPress={() => handleSelectTemplateData(item)}>
            <View style={[styles.templateContentContainer]}>
              <TextComponent
                text={item?.template}
                color={Colors.default.black}
              />
            </View>

            <View style={styles.templateDetailsContainer}>
              <RenderHeaderType item={item} />
              <RenderHeaderNameInput item={item} />
              <RenderMediaTypeSection item={item} />
              <RenderUploadedSampleSection item={item} />
            </View>
            <CustomButton
                title={'Send'}
                onPress={handleSubmitTemplate}
                isLoading={uiState.isUploading}
                disabled={isDisableTemplateSubmit}
              />
          </AnimatedComponentToggle>
        </TouchableOpacity>
        <Divider />
      </>
    );
  };

  return (
    <>
      {isTempleteLoading ? (
        <Loader color={Colors.default.primaryText} />
      ) : (
        <CustomBottomSheetFlatList
          ref={templateBottomSheetRef}
          snapPoints={['50%', '80%']}
          data={templateData}
          keyExtractor={item => item?.name?.toString()}
          renderItem={renderTemplateItem}
          ListHeaderComponent={() => renderListHeaderComponent()}
        />
      )}

      <CustomBottomSheetFlatList
        ref={secondBottomSheetRef}
        snapPoints={['60%']}
        data={uploadedHeaderSamples}
        keyExtractor={item => item?.media_id.toString()}
        renderItem={renderUploadedSampleItem}
        ListHeaderComponent={renderUploadedSampleHeader}
        ListEmptyComponent={renderUploadedSampleListEmpty}
      />

      {/* BottomSheet for WhatsApp Template Categories */}
      <CustomBottomSheetFlatList
        snapPoints={['60%']}
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
  },
  templateContentContainer: {
    padding: spacing.PADDING_16,
    backgroundColor: colors.grey200,
    marginVertical: spacing.MARGIN_8,
    borderRadius: spacing.RADIUS_8,
  },
  templateText: {
    fontSize: textScale(14),
    fontFamily: fontNames.POPPINS_FONT_FAMILY_REGULAR,
    color: colors.grey700,
  },
  templateDetailsContainer: {
    marginVertical: spacing.MARGIN_10,
    paddingHorizontal: spacing.PADDING_10,
  },
  headerTypeTitle: {
    fontFamily: fontNames.ROBOTO_FONT_FAMILY_REGULAR,
    fontSize: textScale(18),
    color: colors.black,
    marginVertical: spacing.MARGIN_6,
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
  headerNameTitle: {
    marginVertical: spacing.MARGIN_6,
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
  mediaTypeContainer: {
    position: 'relative',
  },
  mediaTypeText: {
    fontFamily: fontNames.ROBOTO_FONT_FAMILY_REGULAR,
    fontSize: textScale(18),
    color: colors.black,
    marginVertical: spacing.MARGIN_6,
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
  toggleText: {
    borderBottomWidth: 1,
    textAlign: 'center',
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
  uploadedSampleButtonText: {
    color: colors.white,
    fontSize: textScale(16),
    fontFamily: fontNames.POPPINS_FONT_FAMILY_BOLD,
  },
  uploadNowTitle: {
    fontFamily: fontNames.ROBOTO_FONT_FAMILY_BOLD,
    fontSize: textScale(18),
    color: colors.black,
    marginLeft: spacing.MARGIN_12,
  },
  uploadNowButton: {
    backgroundColor: colors.grey500,
    padding: spacing.PADDING_14,
    borderRadius: spacing.RADIUS_8,
    borderWidth: 0,
  },
  uploadNowButtonText: {
    color: colors.white,
    fontSize: textScale(14),
    fontFamily: fontNames.POPPINS_FONT_FAMILY_BOLD,
  },
  submitButton: {
    backgroundColor: colors.green600,
    marginBottom: spacing.MARGIN_10,
    borderWidth: 0,
  },
  submitButtonText: {
    color: colors.white,
    fontSize: textScale(15),
    fontFamily: fontNames.POPPINS_FONT_FAMILY_MEDIUM,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: spacing.MARGIN_20,
  },
  whatsAppTemplateHeader: {
    alignSelf: 'center',
    fontSize: textScale(18),
    color: colors.black,
    fontFamily: fontNames.ROBOTO_FONT_FAMILY_BOLD,
  },
  whatsAppTemplateTopBtnContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: spacing.MARGIN_16,
    marginVertical: spacing.MARGIN_8,
  },
  createTemplateButton: {
    borderRadius: spacing.RADIUS_8,
    padding: spacing.PADDING_6,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.green200,
  },
  filterIconContainer: {
    borderRadius: spacing.RADIUS_16,
    padding: spacing.PADDING_6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  templateCategoryButton: {
    padding: spacing.PADDING_12,
    margin: spacing.MARGIN_8,
    borderRadius: spacing.RADIUS_8,
    backgroundColor: colors.green200,
  },
  selectedTemplateCategory: {
    backgroundColor: colors.grey200,
  },
  categoryTemplateText: {
    fontSize: textScale(14),
    color: colors.black,
    fontFamily: fontNames.POPPINS_FONT_FAMILY_SEMI_BOLD,
    textTransform: 'capitalize',
  },
  filterTitle: {
    fontSize: textScale(18),
    fontFamily: fontNames.POPPINS_FONT_FAMILY_SEMI_BOLD,
    alignSelf: 'center',
  },
  uploadedSampleItem: {
    backgroundColor: colors.green200,
    marginVertical: spacing.PADDING_10,
    borderRadius: spacing.RADIUS_10,
    paddingHorizontal: spacing.PADDING_12,
    paddingVertical: spacing.PADDING_10,
  },
  uploadedSampleItemText: {
    color: colors.white,
    fontSize: textScale(14),
    fontFamily: fontNames.ROBOTO_FONT_FAMILY_MEDIUM,
  },
});
