import React, { useEffect, useRef, useState } from 'react';
import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';
import Toast from 'react-native-toast-message';
import {
  useCreateNewDateAlertMutation,
  useLazyGetAllDoctypeQuery,
  useLazyGetDateFieldQuery,
  useLazyGetDocFieldForVariableQuery,
  useLazyGetPhoneFieldsQuery,
  useLazyGetRepetitionFrequencyQuery,
  useLazyGetTimeUnitQuery,
  useLazyGetTriggerTimeQuery,
  useLazyGetWhatsappTemplateQuery,
} from '../../api/slice/dateReminderSlice';
import * as SvgIcon from '../../assets';
import CommoneHeader from '../../components/common/CommoneHeader';
import ContainerComponent from '../../components/common/ContainerComponent';
import CustomBottomSheetFlatList from '../../components/common/CustomBottomSheetFlatList';
import CustomButton from '../../components/common/CustomButton';
import CustomDatePicker from '../../components/common/CustomDatePicker';
import CustomInput from '../../components/common/CustomInput';
import TextComponent from '../../components/common/TextComponent';
import { useTheme } from '../../components/hooks';
import { textScale } from '../../styles/responsiveStyles';
import { spacing } from '../../styles/spacing';
import { fontNames } from '../../styles/typography';
import Colors from '../../theme/colors';
import { pickAndSendMediaMessage } from '../../utils/commonImagePicker';
import THEME_COLOR from '../../utils/constant';
import { CommonToastMessage, formatDateTime, goBack } from '../../utils/helperFunctions';

const CreateReminder = () => {
  const {theme} = useTheme();
  const isDarkMode = theme === THEME_COLOR;

  // ref
  const docTypeRef = useRef(null);
  const timeUnitRef = useRef(null);
  const triggerTimeRef = useRef(null);
  const repetitionFrequencyRef = useRef(null);
  const templateRef = useRef(null);
  const varialbleMessageVaribleFeildRef = useRef(null);
  const dateFeildRef = useRef(null);
  const phoneFeildRef = useRef(null);
  const editeVariableFeildRef = useRef(null);
  // apis calls

  const [
    triggerAllDoctype,
    {data: allDocTypeData, isLoading: isLoadingAllDocType},
  ] = useLazyGetAllDoctypeQuery();
  const [
    triggerDateFeild,
    {data: datefeildData, isLoading: isLoadingDateFeild},
  ] = useLazyGetDateFieldQuery();
  const [
    triggerPhonefeild,
    {data: phoneFeildData, isLoading: isLoadingPhoneFeild},
  ] = useLazyGetPhoneFieldsQuery();
  const [
    triggerTimeUnit,
    {data: timeUnitData, isLoading: isLoadingTimeUnitData},
  ] = useLazyGetTimeUnitQuery();
  const [
    triggerTime,
    {data: triggertimeData, isLoading: isLoadingTriggerTime},
  ] = useLazyGetTriggerTimeQuery();
  const [
    triggerRepetitionFrequency,
    {data: repqtitionFrequencyData, isLoading: isLoadingRepetitionFrequency},
  ] = useLazyGetRepetitionFrequencyQuery();
  const [triggerTemplate, {data: templateData, isLoading: isLoadingTemplate}] =
    useLazyGetWhatsappTemplateQuery();
  const [
    triggerGetDocFeild,
    {data: feildNameVariable, isLoading: isLoadingvarialbleMessageVaribleFeild},
  ] = useLazyGetDocFieldForVariableQuery();

  const [createReminder, {isLoading: isLoadingCreateReminder}] =
    useCreateNewDateAlertMutation();

  const [formState, setFormState] = useState({
    title: '',
    documentType: 'Contact',
    dateFeild: '',
    phoneFeild: '',
    timeUnit: '',
    timeValue: '',
    schedulerTime: '',
    repetitionFrequency: '',
    headerType: '',
    trigerTime: '',
    template: '',
    headerName: '',
    media_type: '',
    isMediaTypeShowMoadl: false,
    filename: '',
    filedata: '',
    sample_values: [],
    selectedRowIndexVariable: null,
    isShowEditeModal: false,
  });

  useEffect(() => {
    let parsedSampleValues = [];

    if (formState.template?.sample_values) {
      if (typeof formState.template.sample_values === 'string') {
        const splitValues = formState.template.sample_values.split(',');
        parsedSampleValues = splitValues.map(value => ({
          variable: value.trim(),
          field_name: '',
        }));
      } else if (Array.isArray(formState.template.sample_values)) {
        parsedSampleValues = formState.template.sample_values;
      }
    }

    // Always set `sample_values`, even if `parsedSampleValues` is empty
    setFormState(prevState => ({
      ...prevState,
      sample_values: parsedSampleValues,
    }));
  }, [formState.template]);

  const updateRow = (index, key, value) => {
    setFormState(prevState => {
      const updatedSampleValues = [...prevState.sample_values];
      updatedSampleValues[index][key] = value;
      return {...prevState, sample_values: updatedSampleValues};
    });
  };

  const handleFunctionCall = type => {
    switch (type) {
      case 'documentType':
        triggerAllDoctype();
        break;
      case 'timeUnit':
        triggerTimeUnit({doctype: formState.documentType});
        break;
      case 'trigerTime':
        triggerTime();
        break;
      case 'repetitionFrequency':
        triggerRepetitionFrequency({doctype: formState.documentType});
        break;
      case 'template':
        triggerTemplate();
        break;
      case 'field_name':
        triggerGetDocFeild({doctype: formState.documentType});
        break;
      case 'dateFeild':
        triggerDateFeild({doctype: formState.documentType});
        break;
      case 'phoneFeild':
        triggerPhonefeild({doctype: formState.documentType});
        break;
    }
  };

 
  const isDissableForm =
    formState.title &&
    formState.dateFeild &&
    formState.phoneFeild &&
    formState.timeUnit &&
    formState.timeValue &&
    formState.trigerTime &&
    formState.schedulerTime &&
    formState.repetitionFrequency &&
    formState.template;

    
  const handleCreateNewReminder = async () => {
    const formattedTime = formatDateTime(formState.schedulerTime,'time');
    const payload = {
      title: formState.title,
      document_type: formState.documentType,
      date_field: formState.dateFeild,
      map_recipient: formState.phoneFeild,
      triger_time: formState.trigerTime,
      time_value: formState.timeValue,
      time_unit: formState.timeUnit,
      scheduler_time: formattedTime,
      repetition_frequency: formState.repetitionFrequency,
      template: formState.template?.name,
      header_name: formState.headerName,
      media_type: formState.media_type,
      filename: formState.filename,
      filedata: formState.filedata,
      sample_values: formState.sample_values,
    };

    try {
      const res = await createReminder(payload).unwrap();
      if (res?.status_code === 200) {
        CommonToastMessage('success', res?.message);
        setFormState({
          dateFeild: '',
          documentType: 'Contact',
          headerName: '',
          headerType: '',
          phoneFeild: '',
          repetitionFrequency: '',
          sample_values: [],
          schedulerTime: '',
          selectedRowIndexVariable: null,
          template: '',
          timeUnit: '',
          timeValue: '',
          title: '',
          trigerTime: '',
        });
      }
    } catch (error) {
      console.log(error);
      setFormState({
        dateFeild: '',
        documentType: 'contact',
        headerName: '',
        headerType: '',
        phoneFeild: '',
        repetitionFrequency: '',
        sample_values: [],
        schedulerTime: '',
        selectedRowIndexVariable: null,
        template: '',
        timeUnit: '',
        timeValue: '',
        title: '',
        trigerTime: '',
      });
    }
  };

  const editVariableRow = index => {
    editeVariableFeildRef.current?.present();
    setFormState(prev => ({
      ...prev,
      selectedRowIndexVariable: index,
    }));
  };
  

  return (
    <>
      <CommoneHeader
        title={'Create Reminders'}
        showLeftIcon={true}
        leftIcon={SvgIcon.BackIcon}
        onLeftIconPress={goBack}
      />
      <ContainerComponent useScrollView={true}>
        <CustomInput
          label="Title"
          required={true}
          placeholder="Title"
          value={formState.title}
          onChange={text => setFormState(prev => ({...prev, title: text}))}
          inputStyles={{
            color: isDarkMode ? Colors.dark.black : Colors.light.white,
          }}
          showSecondChildren={formState.title}
          SecondChildren={
            <TouchableOpacity
              onPress={() => setFormState(prev => ({...prev, title: ''}))}>
              <SvgIcon.Wrong
                color={isDarkMode ? Colors.dark.black : Colors.light.white}
              />
            </TouchableOpacity>
          }
        />
        <CustomInput
          label="Document Type"
          required={true}
          editable={false}
          placeholder="Document Type"
          value={formState.documentType}
          onPressTextInput={() => {
            // handleFunctionCall('documentType');
            // docTypeRef.current?.present();
          }}
          inputStyles={{
            color: isDarkMode ? Colors.dark.black : Colors.light.white,
          }}
        />

        {formState.documentType && (
          <>
            <CustomInput
              label="Date Feild"
              required={true}
              editable={false}
              placeholder="Date Feild"
              value={formState.dateFeild}
              onPressTextInput={() => {
                handleFunctionCall('dateFeild');
                dateFeildRef.current?.present();
              }}
              inputStyles={{
                color: isDarkMode ? Colors.dark.black : Colors.light.white,
              }}
              showSecondChildren={true}
              SecondChildren={
                <TouchableOpacity
                  onPress={() => {
                    handleFunctionCall('dateFeild');
                    dateFeildRef.current?.present();
                  }}>
                  <SvgIcon.EditIcon
                    color={isDarkMode ? Colors.dark.black : Colors.light.white}
                  />
                </TouchableOpacity>
              }
            />
            <CustomInput
              label="Phone Feild"
              required={true}
              editable={false}
              placeholder="Phone Feild"
              value={formState.phoneFeild}
              onPressTextInput={() => {
                handleFunctionCall('phoneFeild');
                phoneFeildRef.current?.present();
              }}
              inputStyles={{
                color: isDarkMode ? Colors.dark.black : Colors.light.white,
              }}
              showSecondChildren={true}
              SecondChildren={
                <TouchableOpacity
                  onPress={() => {
                    handleFunctionCall('phoneFeild');
                    phoneFeildRef.current?.present();
                  }}>
                  <SvgIcon.EditIcon
                    color={isDarkMode ? Colors.dark.black : Colors.light.white}
                  />
                </TouchableOpacity>
              }
            />
          </>
        )}
        <CustomInput
          label="Time Unit"
          required={true}
          editable={false}
          placeholder="Time Unit"
          value={formState.timeUnit}
          onPressTextInput={() => {
            handleFunctionCall('timeUnit'), timeUnitRef.current?.present();
          }}
          inputStyles={{
            color: isDarkMode ? Colors.dark.black : Colors.light.white,
          }}
          showSecondChildren={true}
          SecondChildren={
            <TouchableOpacity
              onPress={() => {
                handleFunctionCall('timeUnit'), timeUnitRef.current?.present();
              }}>
              <SvgIcon.EditIcon
                color={isDarkMode ? Colors.dark.black : Colors.light.white}
              />
            </TouchableOpacity>
          }
        />

        {formState.timeUnit && (
          <CustomInput
            label="Triger Time"
            required={true}
            editable={false}
            placeholder="Triger Time"
            value={formState.trigerTime}
            onPressTextInput={() => {
              handleFunctionCall('trigerTime');
              triggerTimeRef.current?.present();
            }}
            inputStyles={{
              color: isDarkMode ? Colors.dark.black : Colors.light.white,
            }}
            showSecondChildren={true}
            SecondChildren={
              <TouchableOpacity
                onPress={() => {
                  handleFunctionCall('trigerTime');
                  triggerTimeRef.current?.present();
                }}>
                <SvgIcon.EditIcon
                  color={isDarkMode ? Colors.dark.black : Colors.light.white}
                />
              </TouchableOpacity>
            }
          />
        )}

        <CustomInput
          label="Time Value"
          required={true}
          placeholder="Time Value"
          value={formState.timeValue}
          onChange={text => setFormState(prev => ({...prev, timeValue: text}))}
          inputStyles={{
            color: isDarkMode ? Colors.dark.black : Colors.light.white,
          }}
          type={'numeric'}
          showSecondChildren={formState.timeValue}
          SecondChildren={
            <TouchableOpacity
              onPress={() => setFormState(prev => ({...prev, timeValue: ''}))}>
              <SvgIcon.Wrong
                color={isDarkMode ? Colors.dark.black : Colors.light.white}
              />
            </TouchableOpacity>
          }
        />

        <CustomDatePicker
          label="Sechedule Time"
          required={true}
          onChange={time => {
            setFormState(prev => ({
              ...prev,
              schedulerTime: time,
            }));
          }}
          hour12={false}
          mode="time"
          display="default"
          selectedDate={formState.schedulerTime}
        />

        <CustomInput
          label="Repetition Frequency"
          required={true}
          editable={false}
          placeholder="Repetition Frequency"
          value={formState.repetitionFrequency}
          onPressTextInput={() => {
            handleFunctionCall('repetitionFrequency');
            repetitionFrequencyRef.current?.present();
          }}
          inputStyles={{
            color: isDarkMode ? Colors.dark.black : Colors.light.white,
          }}
          showSecondChildren={true}
          SecondChildren={
            <TouchableOpacity
              onPress={() => {
                handleFunctionCall('repetitionFrequency');
                repetitionFrequencyRef.current?.present();
              }}>
              <SvgIcon.EditIcon
                color={isDarkMode ? Colors.dark.black : Colors.light.white}
              />
            </TouchableOpacity>
          }
        />
        <CustomInput
          label="Template"
          placeholder="Template"
          required={true}
          editable={false}
          value={formState.template?.actual_name}
          onPressTextInput={() => {
            handleFunctionCall('template');
            templateRef.current?.present();
          }}
          inputStyles={{
            color: isDarkMode ? Colors.dark.black : Colors.light.white,
          }}
          showSecondChildren={true}
          SecondChildren={
            <TouchableOpacity
              onPress={() => {
                handleFunctionCall('template');
                templateRef.current?.present();
              }}>
              <SvgIcon.EditIcon
                color={isDarkMode ? Colors.dark.black : Colors.light.white}
              />
            </TouchableOpacity>
          }
        />

        {formState.template && (
          <>
            <TextComponent
              text="Message"
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
                borderColor: isDarkMode
                  ? Colors.dark.black
                  : Colors.light.white,
                opacity: 0.9,
              }}>
              <TextComponent
                text={formState.template?.template}
                color={!isDarkMode ? Colors.light.white : Colors.dark.black}
                lineHeight={20}
                font={fontNames.ROBOTO_FONT_FAMILY_REGULAR}
              />
            </View>

            <CustomInput
              label="Header Type"
              placeholder="Header Type"
              value={formState.template?.header_type}
              editable={false}
              inputStyles={{
                color: isDarkMode ? Colors.dark.black : Colors.light.white,
              }}
            />
            <CustomInput
              label="Header Name"
              placeholder="Header Name"
              required={true}
              value={formState.headerName}
              onChange={text =>
                setFormState(prev => ({...prev, headerName: text}))
              }
              inputStyles={{
                color: isDarkMode ? Colors.dark.black : Colors.light.white,
              }}
              showSecondChildren={formState.headerName}
              SecondChildren={
                <TouchableOpacity
                  onPress={() =>
                    setFormState(prev => ({...prev, headerName: ''}))
                  }>
                  <SvgIcon.Wrong
                    color={isDarkMode ? Colors.dark.black : Colors.light.white}
                  />
                </TouchableOpacity>
              }
            />

            <CustomInput
              required={true}
              value={formState.media_type || 'Select'}
              onPressTextInput={() => {
                setFormState(pre => ({
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
            {formState.isMediaTypeShowMoadl &&
              ['Uploaded to Meta', 'Upload Now'].map(option => (
                <TouchableOpacity
                  key={option}
                  onPress={() => {
                    setFormState(prev => ({
                      ...prev,
                      media_type: option,
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

            {formState.media_type === 'Upload Now' && (
              <CustomInput
                required={true}
                value={formState.filename || 'Select'}
                onPressTextInput={async () => {
                  const result = await pickAndSendMediaMessage();
                  setFormState(pre => ({
                    ...pre,
                    filedata: result.data?.base64String,
                    filename: result.data?.name,
                  }));
                }}
                editable={false}
                inputStyles={{
                  color: isDarkMode ? Colors.dark.black : Colors.light.white,
                }}
                label="Header Sample"
              />
            )}

            {formState.sample_values.length > 0 && (
              <>
                <TextComponent
                  text={'Send Message Variables'}
                  textAlign={'center'}
                  size={textScale(16)}
                  color={isDarkMode ? Colors.dark.black : Colors.light.white}
                  font={fontNames.ROBOTO_FONT_FAMILY_BOLD}
                  style={{marginVertical: spacing.MARGIN_8}}
                />
                <FlatList
                  data={formState.sample_values}
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={({item, index}) => (
                    <View style={styles.row}>
                      {/* Template Variable Input */}
                      <CustomInput
                        value={item.variable}
                        placeholder="Enter Variable"
                        label="Template Variable"
                        editable={false}
                        inputStyles={{
                          color: isDarkMode
                            ? Colors.dark.black
                            : Colors.light.white,
                        }}
                      />

                      <CustomInput
                        value={item.field_name}
                        placeholder="Field Name"
                        label="Field Name"
                        editable={false}
                        onPressTextInput={() => editVariableRow(index)}
                        inputStyles={{
                          color: isDarkMode
                            ? Colors.dark.black
                            : Colors.light.white,
                        }}
                        showSecondChildren={true}
                        SecondChildren={
                          <TouchableOpacity
                            onPress={() => editVariableRow(index)}>
                            <SvgIcon.EditIcon
                              color={
                                isDarkMode
                                  ? Colors.dark.black
                                  : Colors.light.white
                              }
                            />
                          </TouchableOpacity>
                        }
                      />
                    </View>
                  )}
                />
              </>
            )}
          </>
        )}

        <CustomButton
          title={'Create Reminder'}
          onPress={handleCreateNewReminder}
          disabled={!isDissableForm}
          isLoading={isLoadingCreateReminder}
          style={{marginVertical: spacing.MARGIN_12}}
        />
        <View style={{marginVertical: spacing.MARGIN_30}} />
      </ContainerComponent>

      <CustomBottomSheetFlatList
        ref={editeVariableFeildRef}
        snapPoints={['70%']}
        data={[1]}
        renderItem={() => {
          return (
            <View style={{paddingHorizontal: spacing.PADDING_16}}>
              <TextComponent
                text={`Editing Row ${formState.selectedRowIndexVariable + 1}`}
                textAlign={'center'}
                size={textScale(18)}
              />
              <CustomInput
                value={
                  formState.sample_values[formState.selectedRowIndexVariable]
                    ?.variable
                }
                placeholder="Enter Variable"
                label="Template Variable"
                editable={false}
                inputStyles={{
                  color: isDarkMode ? Colors.dark.black : Colors.light.white,
                }}
              />
              <CustomInput
                value={
                  formState.sample_values[formState.selectedRowIndexVariable]
                    ?.field_name
                }
                placeholder="Field name"
                label="Field name"
                editable={false}
                onPressTextInput={text => {
                  handleFunctionCall('field_name');
                  setFormState(prev => ({
                    ...prev,
                    selectedRowIndexVariable:
                      formState.selectedRowIndexVariable,
                  }));
                  varialbleMessageVaribleFeildRef.current?.present();
                }}
                inputStyles={{
                  color: isDarkMode ? Colors.dark.black : Colors.light.white,
                }}
                showSecondChildren={true}
                SecondChildren={
                  <TouchableOpacity
                    onPress={() => {
                      handleFunctionCall('field_name');
                      setFormState(prev => ({
                        ...prev,
                        selectedRowIndexVariable:
                          formState.selectedRowIndexVariable,
                      }));
                      varialbleMessageVaribleFeildRef.current?.present();
                    }}>
                    <SvgIcon.EditIcon
                      color={
                        isDarkMode ? Colors.dark.black : Colors.light.white
                      }
                    />
                  </TouchableOpacity>
                }
              />
              <CustomInput
                value={formState.documentType}
                placeholder="Ref Doctype"
                label="Ref Doctype"
                editable={false}
                // onPressTextInput={text => handleFunctionCall('documentType')}
                inputStyles={{
                  color: isDarkMode ? Colors.dark.black : Colors.light.white,
                }}
              />
              <CustomButton
                title={'Save'}
                onPress={() => editeVariableFeildRef.current?.dismiss()}
              />
            </View>
          );
        }}
      />

      <CustomBottomSheetFlatList
        ref={docTypeRef}
        snapPoints={['50%']}
        data={allDocTypeData?.data}
        keyExtractor={item => item.name}
        loading={isLoadingAllDocType}
        renderItem={(item, index) => {
          return (
            <TouchableOpacity
              key={index}
              onPress={() => {
                setFormState(prev => ({
                  ...prev,
                  documentType: item?.item?.name,
                }));
                docTypeRef.current?.dismiss();
              }}
              style={[styles.modalItem]}>
              <TextComponent
                text={item?.item?.name}
                textAlign="center"
                size={textScale(16)}
                font={fontNames.ROBOTO_FONT_FAMILY_MEDIUM}
                color={isDarkMode ? Colors.dark.black : Colors.light.white}
              />
            </TouchableOpacity>
          );
        }}
        ListEmptyComponent={
          <TextComponent
            text={'Document type not availabe'}
            color={isDarkMode ? Colors.dark.black : Colors.light.white}
            size={textScale(16)}
          />
        }
      />

      <CustomBottomSheetFlatList
        ref={timeUnitRef}
        snapPoints={['50%']}
        data={timeUnitData?.data?.filter(item => item.trim() !== '') || []}
        loading={isLoadingTimeUnitData}
        keyExtractor={item => item}
        renderItem={({item, index}) => {
          return (
            <TouchableOpacity
              key={index}
              onPress={() => {
                setFormState(prev => ({
                  ...prev,
                  timeUnit: item,
                }));
                timeUnitRef.current?.dismiss();
              }}
              style={[styles.modalItem]}>
              <TextComponent
                text={item}
                textAlign="center"
                size={textScale(16)}
                font={fontNames.ROBOTO_FONT_FAMILY_MEDIUM}
                color={isDarkMode ? Colors.dark.black : Colors.light.white}
              />
            </TouchableOpacity>
          );
        }}
        ListEmptyComponent={
          <TextComponent
            text={'Time Unit not availabe'}
            color={isDarkMode ? Colors.dark.black : Colors.light.white}
            size={textScale(16)}
          />
        }
      />
      <CustomBottomSheetFlatList
        ref={triggerTimeRef}
        snapPoints={['50%']}
        data={triggertimeData?.data?.filter(item => item.trim() !== '') || []}
        loading={isLoadingTriggerTime}
        keyExtractor={item => item}
        renderItem={({item, index}) => {
          return (
            <TouchableOpacity
              key={index}
              onPress={() => {
                setFormState(prev => ({
                  ...prev,
                  trigerTime: item,
                }));
                triggerTimeRef.current?.dismiss();
              }}
              style={[styles.modalItem]}>
              <TextComponent
                text={item}
                textAlign="center"
                size={textScale(16)}
                font={fontNames.ROBOTO_FONT_FAMILY_MEDIUM}
                color={isDarkMode ? Colors.dark.black : Colors.light.white}
              />
            </TouchableOpacity>
          );
        }}
        ListEmptyComponent={
          <TextComponent
            text={'Time Unit not availabe'}
            color={isDarkMode ? Colors.dark.black : Colors.light.white}
            size={textScale(16)}
          />
        }
      />
      <CustomBottomSheetFlatList
        ref={repetitionFrequencyRef}
        snapPoints={['50%']}
        data={
          repqtitionFrequencyData?.data?.filter(item => item.trim() !== '') ||
          []
        }
        loading={isLoadingRepetitionFrequency}
        keyExtractor={item => item}
        renderItem={({item, index}) => {
          return (
            <TouchableOpacity
              key={index}
              onPress={() => {
                setFormState(prev => ({
                  ...prev,
                  repetitionFrequency: item,
                }));
                repetitionFrequencyRef.current?.dismiss();
              }}
              style={[styles.modalItem]}>
              <TextComponent
                text={item}
                textAlign="center"
                size={textScale(16)}
                font={fontNames.ROBOTO_FONT_FAMILY_MEDIUM}
                color={isDarkMode ? Colors.dark.black : Colors.light.white}
              />
            </TouchableOpacity>
          );
        }}
        ListEmptyComponent={
          <TextComponent
            text={'RepetitionFrequency not availabe'}
            color={isDarkMode ? Colors.dark.black : Colors.light.white}
            size={textScale(16)}
          />
        }
      />
      <CustomBottomSheetFlatList
        ref={templateRef}
        snapPoints={['50%']}
        data={templateData?.data}
        loading={isLoadingTemplate}
        keyExtractor={item => item?.name.toString()}
        renderItem={({item, index}) => {
          return (
            <TouchableOpacity
              key={index}
              onPress={() => {
                setFormState(prev => ({
                  ...prev,
                  template: item,
                }));
                templateRef.current?.dismiss();
              }}
              style={[styles.modalItem]}>
              <TextComponent
                text={item?.actual_name}
                textAlign="center"
                size={textScale(16)}
                font={fontNames.ROBOTO_FONT_FAMILY_MEDIUM}
                color={isDarkMode ? Colors.dark.black : Colors.light.white}
              />
            </TouchableOpacity>
          );
        }}
        ListEmptyComponent={
          <TextComponent
            text={'Template not availabe'}
            color={isDarkMode ? Colors.dark.black : Colors.light.white}
            size={textScale(16)}
          />
        }
      />
      <CustomBottomSheetFlatList
        ref={varialbleMessageVaribleFeildRef}
        snapPoints={['50%']}
        data={feildNameVariable?.data}
        loading={isLoadingvarialbleMessageVaribleFeild}
        keyExtractor={item => item?.fieldname.toString()}
        renderItem={({item, index}) => {
          return (
            <TouchableOpacity
              key={index}
              onPress={() => {
                updateRow(
                  formState.selectedRowIndexVariable,
                  'field_name',
                  item.fieldname,
                );
                varialbleMessageVaribleFeildRef.current?.dismiss();
              }}
              style={[styles.modalItem]}>
              <TextComponent
                text={item?.label}
                textAlign="center"
                size={textScale(16)}
                font={fontNames.ROBOTO_FONT_FAMILY_MEDIUM}
                color={isDarkMode ? Colors.dark.black : Colors.light.white}
              />
            </TouchableOpacity>
          );
        }}
        ListEmptyComponent={
          <TextComponent
            text={'feild not availabe'}
            color={isDarkMode ? Colors.dark.black : Colors.light.white}
            size={textScale(16)}
          />
        }
      />
      <CustomBottomSheetFlatList
        ref={dateFeildRef}
        snapPoints={['50%']}
        data={datefeildData?.data}
        loading={isLoadingDateFeild}
        keyExtractor={item => item?.fieldname.toString()}
        renderItem={({item, index}) => {
          return (
            <TouchableOpacity
              key={index}
              onPress={() => {
                setFormState(prev => ({
                  ...prev,
                  dateFeild: item?.fieldname,
                }));
                dateFeildRef.current?.dismiss();
              }}
              style={[styles.modalItem]}>
              <TextComponent
                text={item?.label}
                textAlign="center"
                size={textScale(16)}
                font={fontNames.ROBOTO_FONT_FAMILY_MEDIUM}
                color={isDarkMode ? Colors.dark.black : Colors.light.white}
              />
            </TouchableOpacity>
          );
        }}
        ListEmptyComponent={
          <TextComponent
            text={'Date feild not availabe'}
            color={isDarkMode ? Colors.dark.black : Colors.light.white}
            size={textScale(16)}
          />
        }
      />
      <CustomBottomSheetFlatList
        ref={phoneFeildRef}
        snapPoints={['50%']}
        data={phoneFeildData?.data}
        loading={isLoadingPhoneFeild}
        keyExtractor={item => item?.fieldname.toString()}
        renderItem={({item, index}) => {
          return (
            <TouchableOpacity
              key={index}
              onPress={() => {
                setFormState(prev => ({
                  ...prev,
                  phoneFeild: item?.fieldname,
                }));
                phoneFeildRef.current?.dismiss();
              }}
              style={[styles.modalItem]}>
              <TextComponent
                text={item?.label}
                textAlign="center"
                size={textScale(16)}
                font={fontNames.ROBOTO_FONT_FAMILY_MEDIUM}
                color={isDarkMode ? Colors.dark.black : Colors.light.white}
              />
            </TouchableOpacity>
          );
        }}
        ListEmptyComponent={
          <TextComponent
            text={'Phone feild not availabe'}
            color={isDarkMode ? Colors.dark.black : Colors.light.white}
            size={textScale(16)}
          />
        }
      />
    </>
  );
};

export default CreateReminder;

const styles = StyleSheet.create({
  inputContainer: {
    paddingHorizontal: spacing.PADDING_16,
    paddingVertical: spacing.PADDING_10,
  },

  modalItem: {
    paddingVertical: spacing.PADDING_8,
    paddingHorizontal: spacing.PADDING_16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.grey,
  },

  row: {
    marginBottom: 10,
  },
  input: {
    marginHorizontal: 5,
    width: '50%',
  },
  deleteButton: {
    backgroundColor: '#e74c3c',
    padding: 10,
    borderRadius: 5,
  },
  deleteButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  addButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#4CAF50',
    borderRadius: 5,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
