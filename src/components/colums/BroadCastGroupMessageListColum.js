import React, {useRef, useState} from 'react';
import {FlatList, StyleSheet, TouchableOpacity, View} from 'react-native';
import Toast from 'react-native-toast-message';
import {useGetBroadCastGroupQuery} from '../../api/slice/broadCastGroupSlice';
import {
  useLazyFetchBroadCastMessageTemplateQuery,
  useLazyUploadeMediaQuery,
  useSendBroadCastMessageMutation,
} from '../../api/slice/broadCastMessageSlice';
import * as SvgIcon from '../../assets';
import {textScale} from '../../styles/responsiveStyles';
import {spacing} from '../../styles/spacing';
import {fontNames} from '../../styles/typography';
import Colors from '../../theme/colors';
import {pickAndSendMediaMessage} from '../../utils/commonImagePicker';
import THEME_COLOR from '../../utils/constant';
import {formatDateTime, goBack} from '../../utils/helperFunctions';
import CustomHeader from '../common/CommoneHeader';
import ContainerComponent from '../common/ContainerComponent';
import CustomBottomSheetFlatList from '../common/CustomBottomSheetFlatList';
import CustomButton from '../common/CustomButton';
import CustomDatePicker from '../common/CustomDatePicker';
import CustomInput from '../common/CustomInput';
import LoadingScreen from '../common/Loader';
import TextComponent from '../common/TextComponent';
import {useTheme} from '../hooks';
import BroadCastGroupMessageRow from '../row/BroadCastGroupMessageRow';

const SelectHeaderName = ({
  selectedBroadCastMessageData,
  setSelectedBroadCastMessageData,
  isDarkMode,
}) => {
  return (
    <CustomInput
      required={true}
      placeholder={'Enter Header Name'}
      value={selectedBroadCastMessageData.header_name}
      onChange={text => {
        setSelectedBroadCastMessageData(prev => ({
          ...prev,
          header_name: text,
        }));
      }}
      inputStyles={{
        color: isDarkMode ? Colors.dark.black : Colors.light.white,
      }}
      label="Header Name"
    />
  );
};

const BroadcastMessagesList = ({route}) => {
  const {theme} = useTheme();
  const isDarkMode = theme === THEME_COLOR;
  const sendBroadCastRef = useRef(null);
  const selectTempleteRef = useRef(null);
  const uploadedHeaderSamples = useRef(null);
  const {groupName} = route?.params;
  const {data, isLoading, isError, refetch} = useGetBroadCastGroupQuery();
  const [
    fetchBroadCastMessageTemplate,
    {
      data: BroadCastMessageTemplate,
      isLoading: BroadCastMessageTemplateIsLoading,
    },
  ] = useLazyFetchBroadCastMessageTemplateQuery();
  
  const [
    triggerCreateWaBroadcastMessage,
    {isLoading: isLoadingCreateWABroadCastMessage},
  ] = useSendBroadCastMessageMutation();
  const [uploadMidea] = useLazyUploadeMediaQuery();

  const [selectedBroadCastMessageData, setSelectedBroadCastMessageData] =
    useState({
      template: '',
      whenToSend: '',
      iswhenToSendModalShow: false,
      mediaTypeModal: false,
      mediaType: '',
      header_name: '',
      uploadedFileData: null,
      uploadedFileName: '',
      scheduletime: '',
      scheduledate: '',
      selectedUploadedSampleTitle: '',
      uploadedMediaId: '',
    });
  const [uploadedHeaderSampleData, setUploadedHeaderSampleData] = useState([]);

  if (isError) {
    return (
      <View style={styles.center}>
        <TextComponent
          text={'Failed to load messages. Please try again.'}
          color={Colors.default.error}
          size={textScale(16)}
          font={fontNames.ROBOTO_FONT_FAMILY_BOLD}
          textAlign={'center'}
        />
      </View>
    );
  }

  const messageList = data?.data.find(group => group.name === groupName);

  const SelectMessageTemplateName = () => {
    return (
      <CustomInput
        required={true}
        value={selectedBroadCastMessageData.template?.actual_name || 'Select'}
        onPressTextInput={() => {
          setSelectedBroadCastMessageData(pre => ({...pre, template: ''}));
          selectTempleteRef.current?.present();
        }}
        editable={false}
        inputStyles={{
          color: isDarkMode ? Colors.dark.black : Colors.light.white,
        }}
        label="Select Message Template"
        multiline
      />
    );
  };

  const SelectWhenToSendMessageTemplate = () => {
    return (
      <CustomInput
        required={true}
        value={selectedBroadCastMessageData.whenToSend || 'Select'}
        onPressTextInput={() => {
          setSelectedBroadCastMessageData(pre => ({...pre, whenToSend: ''})),
            setSelectedBroadCastMessageData(pre => ({
              ...pre,
              iswhenToSendModalShow:
                !selectedBroadCastMessageData.iswhenToSendModalShow,
            }));
        }}
        editable={false}
        inputStyles={{
          color: isDarkMode ? Colors.dark.black : Colors.light.white,
        }}
        label=" When to Send"
      />
    );
  };

  const SelectedMessageTemplate = () => {
    return (
      <>
        <TextComponent
          text="Message Template"
          color={isDarkMode ? Colors.dark.black : Colors.light.white}
          style={{marginLeft: spacing.MARGIN_6}}
        />
        <View
          style={{
            marginVertical: spacing.MARGIN_12,
            backgroundColor: isDarkMode
              ? Colors.light.white
              : Colors.dark.black,
            padding: spacing.PADDING_16,
            borderRadius: spacing.RADIUS_8,
            borderWidth: 1,
            borderColor: isDarkMode ? Colors.dark.black : Colors.light.white,
            opacity: 0.9,
          }}>
          <TextComponent
            text={selectedBroadCastMessageData.template?.template}
            color={!isDarkMode ? Colors.light.white : Colors.dark.black}
            lineHeight={20}
            font={fontNames.ROBOTO_FONT_FAMILY_REGULAR}
          />
        </View>
      </>
    );
  };
  const SelectHeaderType = () => {
    return (
      <CustomInput
        placeholder={selectedBroadCastMessageData.template?.header_type}
        editable={false}
        inputStyles={{
          color: isDarkMode ? Colors.dark.black : Colors.light.white,
        }}
        label="Header Type"
        multiline
      />
    );
  };

  const SelectMediaType = () => {
    return (
      <CustomInput
        required={true}
        value={selectedBroadCastMessageData.mediaType || 'Select'}
        onPressTextInput={() => {
          setSelectedBroadCastMessageData(pre => ({...pre, whenToSend: ''})),
            setSelectedBroadCastMessageData(pre => ({
              ...pre,
              mediaTypeModal: !selectedBroadCastMessageData.mediaTypeModal,
            }));
        }}
        editable={false}
        inputStyles={{
          color: isDarkMode ? Colors.dark.black : Colors.light.white,
        }}
        label="Media Type"
      />
    );
  };
  const renderUploadedSampleHeader = () => (
    <TextComponent
      text={'Uploaded Header Sample'}
      color={isDarkMode ? Colors.dark.black : Colors.light.white}
      size={textScale(16)}
      textAlign={'center'}
    />
  );
  const handleUploadedSampleSelect = item => {
    setSelectedBroadCastMessageData(prev => ({
      ...prev,
      selectedUploadedSampleTitle: item?.title,
      uploadedMediaId: item?.media_id,
    }));
    uploadedHeaderSamples.current?.dismiss();
  };

  const renderUploadedSampleItem = ({item}) => (
    <TouchableOpacity
      style={styles.uploadedSampleItem}
      onPress={() => handleUploadedSampleSelect(item)}>
      <TextComponent
        text={item?.title}
        color={Colors.default.black}
        size={textScale(16)}
      />
    </TouchableOpacity>
  );

  const SelectUploadedHeaderSample = () => {
    return (
      <CustomInput
        required={true}
        value={selectedBroadCastMessageData.mediaType || 'Select'}
        onPressTextInput={async () => {
          try {
            const response = await uploadMidea({
              header_type: selectedBroadCastMessageData.template?.header_type,
            });
            setUploadedHeaderSampleData(response.data);
            uploadedHeaderSamples.current?.present();
          } catch (error) {
            console.log('Failed to upload sample header:', error);
          }
        }}
        editable={false}
        inputStyles={{
          color: isDarkMode ? Colors.dark.black : Colors.light.white,
        }}
        label="Uploaded Header Sample"
      />
    );
  };
  const SelectMediaID = () => {
    return (
      <CustomInput
        required={true}
        value={selectedBroadCastMessageData.uploadedMediaId || 'Select'}
        editable={false}
        inputStyles={{
          color: isDarkMode ? Colors.dark.black : Colors.light.white,
        }}
        label="Media ID"
      />
    );
  };
  const SelectHeaderSample = () => {
    return (
      <CustomInput
        required={true}
        value={selectedBroadCastMessageData.uploadedFileName || 'Select'}
        onPressTextInput={async () => {
          const result = await pickAndSendMediaMessage();
          setSelectedBroadCastMessageData(pre => ({
            ...pre,
            uploadedFileData: result.data?.base64String,
            uploadedFileName: result.data?.name,
          }));
        }}
        editable={false}
        inputStyles={{
          color: isDarkMode ? Colors.dark.black : Colors.light.white,
        }}
        label="Header Sample"
      />
    );
  };

  const renderSelectTempleteItem = ({item}) => {
    return (
      <TouchableOpacity
        style={styles.templateListContainer}
        onPress={() => {
          setSelectedBroadCastMessageData(prev => ({
            ...prev,
            template: item,
          }));
          selectTempleteRef.current?.dismiss();
        }}>
        <TextComponent
          text={item?.actual_name.replace(/_/g, ' ')}
          size={textScale(16)}
          color={Colors.light.white}
          font={fontNames.ROBOTO_FONT_FAMILY_MEDIUM}
        />
      </TouchableOpacity>
    );
  };

  const ListHeaderComponentSelectTemplete = () => (
    <TextComponent
      text={'Select Template'}
      color={isDarkMode ? Colors.dark.black : Colors.light.white}
      textAlign={'center'}
      size={textScale(16)}
      font={fontNames.ROBOTO_FONT_FAMILY_BOLD}
    />
  );
  const createWABrodcast = async () => {
    try {
      const SecheduleTime = formatDateTime(
        selectedBroadCastMessageData.scheduletime,
        'time',
      );
      const SecheduleDate = formatDateTime(
        selectedBroadCastMessageData.scheduledate,
        'date',
      );

      const finalSchedule = `${SecheduleDate} ${SecheduleTime}`
      const payload = {
        group: groupName,
        message_template: selectedBroadCastMessageData.template?.actual_name,
        header_name: selectedBroadCastMessageData.header_name,
        media_type: selectedBroadCastMessageData.mediaType,
        // uploaded_header_sample:selectedBroadCastMessageData.uploadedFileData,
        filename: selectedBroadCastMessageData.uploadedFileName,
        filedata: selectedBroadCastMessageData.uploadedFileData,
        when_to_send: selectedBroadCastMessageData.whenToSend,
        schedule_date_and_time: finalSchedule,
      };
     
    
      const res = await triggerCreateWaBroadcastMessage(payload).unwrap();
      console.log(res);

      if (res?.status_code === 200) {
        refetch();
        sendBroadCastRef.current?.dismiss();
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: res?.message,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <ContainerComponent
        noPadding
        useScrollView={false}
        bottomComponent={
          <CustomButton
            title={'Send Message'}
            onPress={() => {
              sendBroadCastRef.current?.present();
              fetchBroadCastMessageTemplate();
            }}
            isLoading={BroadCastMessageTemplateIsLoading}
          />
        }>
        <CustomHeader
          title={groupName}
          showLeftIcon={true}
          leftIcon={SvgIcon.BackIcon}
          onLeftIconPress={goBack}
          showRightIcons={true}
          rightIcons={[SvgIcon.ReloadIcon]}
          onRightIconPress={refetch}
        />

        {isLoading ? (
          <LoadingScreen />
        ) : (
          <FlatList
            data={messageList?.brodcasted_records}
            keyExtractor={item => item.name.toString()}
            renderItem={({item}) => <BroadCastGroupMessageRow message={item} />}
            contentContainerStyle={{paddingBottom: spacing.PADDING_16}}
            ListEmptyComponent={
              <TextComponent
                text={`No messages found for ${groupName}`}
                color={isDarkMode ? Colors.dark.black : Colors.light.white}
                textAlign={'center'}
                size={textScale(16)}
                font={fontNames.ROBOTO_FONT_FAMILY_BOLD}
              />
            }
            inverted
          />
        )}
      </ContainerComponent>

      <CustomBottomSheetFlatList
        ref={sendBroadCastRef}
        snapPoints={['90%']}
        enableDynamicSizing={false}
        onDismiss={() => setSelectedBroadCastMessageData({})}
        data={[1]}
        renderItem={() => (
          <>
            <TextComponent
              text={`Send WhatsApp Broadcasting to ${groupName}`}
              color={isDarkMode ? Colors.dark.black : Colors.light.white}
              textAlign={'center'}
              size={textScale(16)}
              font={fontNames.ROBOTO_FONT_FAMILY_BOLD}
            />
            <View
              style={{
                marginHorizontal: spacing.MARGIN_16,
                marginVertical: spacing.MARGIN_12,
              }}>
              <SelectMessageTemplateName />
              <SelectedMessageTemplate />
              {selectedBroadCastMessageData.template?.actual_name && (
                <>
                  {selectedBroadCastMessageData.template?.header_type && (
                    <SelectHeaderType />
                  )}
                  <SelectHeaderName
                    selectedBroadCastMessageData={selectedBroadCastMessageData}
                    setSelectedBroadCastMessageData={
                      setSelectedBroadCastMessageData
                    }
                    isDarkMode={isDarkMode}
                  />
                  <SelectMediaType />
                </>
              )}
              {selectedBroadCastMessageData.mediaTypeModal &&
                ['Uploaded to Meta', 'Upload Now'].map(option => (
                  <TouchableOpacity
                    key={option}
                    onPress={() => {
                      setSelectedBroadCastMessageData(prev => ({
                        ...prev,
                        mediaType: option,
                        mediaTypeModal: false,
                      }));
                    }}
                    style={{
                      paddingVertical: spacing.PADDING_8,
                      backgroundColor: Colors.default.primaryColor,
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

              {selectedBroadCastMessageData.mediaType ===
                'Uploaded to Meta' && (
                <>
                  <SelectUploadedHeaderSample />
                  <SelectMediaID />
                </>
              )}

              {selectedBroadCastMessageData.mediaType === 'Upload Now' && (
                <SelectHeaderSample />
              )}

              <SelectWhenToSendMessageTemplate />
              {selectedBroadCastMessageData.iswhenToSendModalShow &&
                ['Now', 'Schedule'].map(option => (
                  <TouchableOpacity
                    key={option}
                    onPress={() => {
                      setSelectedBroadCastMessageData(prev => ({
                        ...prev,
                        whenToSend: option,
                        iswhenToSendModalShow: false,
                      }));
                    }}
                    style={{
                      paddingVertical: spacing.PADDING_8,
                      backgroundColor: Colors.default.primaryColor,

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

              {selectedBroadCastMessageData.whenToSend === 'Schedule' && (
                <>
                  <CustomDatePicker
                    label="Sechedule Date"
                    onChange={date =>
                      setSelectedBroadCastMessageData(prev => ({
                        ...prev,
                        scheduledate: date,
                      }))
                    }
                    display="default"
                    required={true}
                    selectedDate={selectedBroadCastMessageData.scheduledate}
                  />
                  <CustomDatePicker
                    label="Sechedule Time"
                    onChange={time =>
                      setSelectedBroadCastMessageData(prev => ({
                        ...prev,
                        scheduletime: time,
                      }))
                    }
                    hour12={false}
                    mode="time"
                    display="default"
                    required={true}
                    selectedDate={selectedBroadCastMessageData.scheduletime}
                  />
                </>
              )}

              <CustomButton
                title={'Create WA Broadcast'}
                onPress={createWABrodcast}
                isLoading={isLoadingCreateWABroadCastMessage}
                disabled={
                  !selectedBroadCastMessageData.template?.actual_name ||
                  !selectedBroadCastMessageData.whenToSend ||
                  !selectedBroadCastMessageData.header_name ||
                  !selectedBroadCastMessageData.mediaType ||
                  (selectedBroadCastMessageData.mediaType ===
                    'Uploaded to Meta' &&
                    !selectedBroadCastMessageData.uploadedFileData) ||
                  (selectedBroadCastMessageData.mediaType === 'Upload Now' &&
                    !selectedBroadCastMessageData.uploadedFileData)
                }
              />
            </View>
          </>
        )}
      />
      <CustomBottomSheetFlatList
        ref={selectTempleteRef}
        snapPoints={['90%']}
        data={BroadCastMessageTemplate?.data}
        renderItem={renderSelectTempleteItem}
        ListHeaderComponent={ListHeaderComponentSelectTemplete}
      />
      <CustomBottomSheetFlatList
        ref={uploadedHeaderSamples}
        snapPoints={['40%']}
        data={uploadedHeaderSampleData}
        keyExtractor={item => item?.media_id.toString()}
        renderItem={renderUploadedSampleItem}
        ListHeaderComponent={renderUploadedSampleHeader}
        ListEmptyComponent={
          <TextComponent
            text={'No uploaded header samples found'}
            color={isDarkMode ? Colors.dark.black : Colors.light.white}
            textAlign={'center'}
            size={textScale(16)}
            font={fontNames.ROBOTO_FONT_FAMILY_BOLD}
          />
        }
      />
    </>
  );
};

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  templateListContainer: {
    marginVertical: spacing.MARGIN_4,
    marginHorizontal: spacing.MARGIN_4,
    padding: spacing.PADDING_10,
    borderRadius: spacing.RADIUS_6,
    backgroundColor: Colors.default.primaryColor,
  },
  uploadedSampleItem: {
    backgroundColor: Colors.default.white,
    marginVertical: spacing.PADDING_8,
    borderRadius: spacing.RADIUS_10,
    paddingHorizontal: spacing.PADDING_16,
    paddingVertical: spacing.PADDING_12,
  },
});

export default BroadcastMessagesList;
