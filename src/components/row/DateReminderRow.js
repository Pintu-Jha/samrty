import React, {useEffect, useRef, useState} from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import Toast from 'react-native-toast-message';
import {
  useLazyGetDateFieldQuery,
  useLazyGetDocFieldForVariableQuery,
  useLazyGetPhoneFieldsQuery,
  useLazyGetRepetitionFrequencyQuery,
  useLazyGetSingleDateAlertQuery,
  useLazyGetTimeUnitQuery,
  useLazyGetTriggerTimeQuery,
  useLazyGetWhatsappTemplateQuery,
  useLazySubmitNewDateAlertQuery,
  useUpdateNewDateAlertMutation,
} from '../../api/slice/dateReminderSlice';
import * as SvgIcon from '../../assets';
import {textScale} from '../../styles/responsiveStyles';
import {spacing} from '../../styles/spacing';
import {fontNames} from '../../styles/typography';
import Colors from '../../theme/colors';
import {pickAndSendMediaMessage} from '../../utils/commonImagePicker';
import {formatDateTime, goBack} from '../../utils/helperFunctions';
import CommoneHeader from '../common/CommoneHeader';
import ContainerComponent from '../common/ContainerComponent';
import CustomBottomSheetFlatList from '../common/CustomBottomSheetFlatList';
import CustomButton from '../common/CustomButton';
import CustomDatePicker from '../common/CustomDatePicker';
import CustomInput from '../common/CustomInput';
import LoadingScreen from '../common/Loader';
import TextComponent from '../common/TextComponent';
import {useTheme} from '../hooks';

const DateReminderRow = ({route}) => {
  // ref
  const templateRef = useRef(null);
  const repetitionFrequencyRef = useRef(null);
  const timeUnitRef = useRef(null);
  const triggerTimeRef = useRef(null);
  const phoneFeildRef = useRef(null);
  const dateFeildRef = useRef(null);
  const varialbleMessageVaribleFeildRef = useRef(null);
  const editeVariableFeildRef = useRef(null);

  const {alretName} = route?.params || {};

  const {theme} = useTheme();
  const isDarkMode = theme === THEME_COLOR;

  const [alertState, setAlertState] = useState({
    name: '',
    title: '',
    document_type: '',
    date_field: '',
    map_recipient: '',
    triger_time: '',
    time_value: '',
    time_unit: '',
    scheduler_time: null,
    repetition_frequency: '',
    template: '',
    message: '',
    header_type: '',
    header_name: '',
    media_type: '',
    isMediaTypeShowMoadl: false,
    filename: '',
    filedata: '',
    sample_values: [],
  });
  const [isSavedReminder, setIsSavedReminder] = useState(
    alertState.docstatus === 0,
  );
  const [tempVariableMessageRowIndex, setTempVariableMessageRowIndex] =
    useState(Number);

  const [triggerDateReminder, {isLoading: isLoadingDateReminder}] =
    useLazyGetSingleDateAlertQuery();
  const [trigerSaveDateReminder, {isLoading: isLoadingSaveDateReminder}] =
    useUpdateNewDateAlertMutation();
  const [triggerSumbitDateReminder, {isLoading: isLoadingSumbitDateReminder}] =
    useLazySubmitNewDateAlertQuery();
  const [triggerTemplate, {data: templateData, isLoading: isLoadingTemplate}] =
    useLazyGetWhatsappTemplateQuery();
  const [
    triggerRepetitionFrequency,
    {data: repqtitionFrequencyData, isLoading: isLoadingRepetitionFrequency},
  ] = useLazyGetRepetitionFrequencyQuery();
  const [
    triggerTimeUnit,
    {data: timeUnitData, isLoading: isLoadingTimeUnitData},
  ] = useLazyGetTimeUnitQuery();
  const [
    triggerTime,
    {data: triggertimeData, isLoading: isLoadingTriggerTime},
  ] = useLazyGetTriggerTimeQuery();
  const [
    triggerPhonefeild,
    {data: phoneFeildData, isLoading: isLoadingPhoneFeild},
  ] = useLazyGetPhoneFieldsQuery();
  const [
    triggerDateFeild,
    {data: datefeildData, isLoading: isLoadingDateFeild},
  ] = useLazyGetDateFieldQuery();
  const [
    triggerGetDocFeild,
    {data: feildNameVariable, isLoading: isLoadingvarialbleMessageVaribleFeild},
  ] = useLazyGetDocFieldForVariableQuery();

  const fetchDateReminder = async id => {
    try {
      const response = await triggerDateReminder(id).unwrap();
      const firstItem = response.data[0];
      const sample_values = Array.isArray(firstItem?.send_message_variables)
        ? firstItem.send_message_variables.map(item => ({
            variable: item.template_variable || '',
            field_name: item.field_name || '',
            // ref_doctype: item.ref_doctype || '',
          }))
        : [];
      const modifiedData = {
        ...firstItem,
        sample_values,
      };
      if (modifiedData.send_message_variables) {
        delete modifiedData.send_message_variables;
      }
      setAlertState(modifiedData);
    } catch (error) {
      console.error('Error fetching date reminder:', error);
    }
  };

  useEffect(() => {
    fetchDateReminder(alretName);
  }, [alretName]);

  const updateField = (field, value) => {
    setAlertState(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const editVariableRow = index => {
    setTempVariableMessageRowIndex(index);
    editeVariableFeildRef.current?.present();
  };

  const updateRow = (index, key, value) => {
    setAlertState(prevState => {
      const updatedSampleValues = [...prevState.sample_values];
      updatedSampleValues[index][key] = value;
      return {...prevState, sample_values: updatedSampleValues};
    });
  };

  const saveDateReminder = async () => {
    const formattedTime = formatDateTime(alertState.scheduler_time, 'time');

    try {
      const payload = {
        name: alertState.name,
        title: alertState.title,
        document_type: alertState.document_type,
        date_field: alertState.date_field,
        map_recipient: alertState.map_recipient,
        triger_time: alertState.triger_time,
        time_value: alertState.time_value,
        time_unit: alertState.time_unit,
        scheduler_time: formattedTime,
        repetition_frequency: alertState.repetition_frequency,
        template: alertState.template,
        header_name: alertState.header_name,
        media_type: alertState.media_type,
        filename: alertState.filename || '',
        filedata: alertState.filedata || '',
        sample_values: alertState.sample_values,
      };

      const response = await trigerSaveDateReminder(payload).unwrap();
      if (response?.status_code === 200) {
        Toast.show({
          type: 'success',
          text1: 'success',
          text2: response?.message,
        });
        setIsSavedReminder(true);
        await triggerDateReminder(alretName);
        console.log('Save successful:', response);
      }
      if (response?.status_code === 400) {
        Toast.show({
          type: 'warning',
          text1: 'Warning',
          text2: response?.message,
        });
      }
    } catch (error) {
      console.error('Error saving date reminder:', error);
    }
  };
  const submitDateReminder = async () => {
    try {
      const response = await triggerSumbitDateReminder({
        name: alertState?.name,
      }).unwrap();
      fetchDateReminder(alretName);
      console.log('Submit successful:', response);
    } catch (error) {
      console.error('Error submitting date reminder:', error);
    }
  };
  const handleFunctionCall = type => {
    switch (type) {
      case 'documentType':
        triggerAllDoctype();
        break;
      case 'timeUnit':
        triggerTimeUnit({doctype: 'Contact'});
        break;
      case 'trigerTime':
        triggerTime();
        break;
      case 'repetitionFrequency':
        triggerRepetitionFrequency({doctype: 'Contact'});
        break;
      case 'template':
        triggerTemplate();
        break;
      case 'field_name':
        triggerGetDocFeild({doctype: 'Contact'});
        break;
      case 'dateFeild':
        triggerDateFeild({doctype: 'Contact'});
        break;
      case 'phoneFeild':
        triggerPhonefeild({doctype: 'Contact'});
        break;
    }
  };

  const custmizeRowVariable = item => {
    if (!Array.isArray(item) || item.length === 0 || item[0] === null) {
      console.log(
        'Invalid input: item must not be null or an empty array.',
        item,
      );
      return [];
    }

    const sampleValuesString = item[0];

    const transformedValues = sampleValuesString.split(',').map(value => ({
      variable: value.trim(),
      field_name: '',
      ref_doctype: alertState.document_type,
    }));

    setAlertState(prevState => {
      const updatedState = {...prevState, sample_values: transformedValues};
      return updatedState;
    });
  };

  return (
    <>
      <CommoneHeader
        title={alertState?.title}
        leftIcon={SvgIcon.BackIcon}
        onLeftIconPress={goBack}
        showLeftIcon
      />
      {isLoadingDateReminder ? (
        <LoadingScreen />
      ) : (
        <ContainerComponent useScrollView={true}>
          <CustomInput
            label="Title"
            required={true}
            editable={alertState?.docstatus === 0}
            value={alertState?.title || ''}
            onChange={text => {
              updateField('title', text);
            }}
            inputStyles={{
              color: isDarkMode ? Colors.dark.black : Colors.light.white,
            }}
            showSecondChildren={alertState?.docstatus === 0 && alertState.title}
            SecondChildren={
              <TouchableOpacity
                onPress={() => setAlertState(prev => ({...prev, title: ''}))}>
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
            value={alertState?.document_type}
            onPressTextInput={() => {}}
            inputStyles={{
              color: isDarkMode ? Colors.dark.black : Colors.light.white,
            }}
          />
          {alertState?.document_type && (
            <>
              <CustomInput
                label="Date Field"
                required={true}
                editable={false}
                value={alertState?.date_field}
                onPressTextInput={() => {
                  if (alertState?.docstatus === 0) {
                    handleFunctionCall('dateFeild');
                    dateFeildRef.current?.present();
                  }
                }}
                inputStyles={{
                  color: isDarkMode ? Colors.dark.black : Colors.light.white,
                }}
                showSecondChildren={
                  alertState?.docstatus === 0 && alertState.date_field
                }
                SecondChildren={
                  <TouchableOpacity
                    onPress={() => {
                      handleFunctionCall('dateFeild');
                      dateFeildRef.current?.present();
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
                label="Recipient Mobile Field"
                required={true}
                editable={false}
                value={alertState?.map_recipient}
                onPressTextInput={() => {
                  if (alertState?.docstatus === 0) {
                    handleFunctionCall('phoneFeild');
                    phoneFeildRef.current?.present();
                  }
                }}
                inputStyles={{
                  color: isDarkMode ? Colors.dark.black : Colors.light.white,
                }}
                showSecondChildren={
                  alertState?.docstatus === 0 && alertState.map_recipient
                }
                SecondChildren={
                  <TouchableOpacity
                    onPress={() => {
                      handleFunctionCall('phoneFeild');
                      phoneFeildRef.current?.present();
                    }}>
                    <SvgIcon.EditIcon
                      color={
                        isDarkMode ? Colors.dark.black : Colors.light.white
                      }
                    />
                  </TouchableOpacity>
                }
              />
            </>
          )}

          {alertState?.time_unit && (
            <CustomInput
              label="Time Unit"
              required={true}
              editable={false}
              value={alertState?.time_unit}
              onPressTextInput={() => {
                if (alertState?.docstatus === 0) {
                  handleFunctionCall('timeUnit'),
                    timeUnitRef.current?.present();
                }
              }}
              inputStyles={{
                color: isDarkMode ? Colors.dark.black : Colors.light.white,
              }}
              showSecondChildren={
                alertState?.docstatus === 0 && alertState.time_unit
              }
              SecondChildren={
                <TouchableOpacity
                  onPress={() => {
                    handleFunctionCall('timeUnit'),
                      timeUnitRef.current?.present();
                  }}>
                  <SvgIcon.EditIcon
                    color={isDarkMode ? Colors.dark.black : Colors.light.white}
                  />
                </TouchableOpacity>
              }
            />
          )}
          {alertState?.time_unit && (
            <CustomInput
              label="Triger Time"
              required={true}
              editable={false}
              value={alertState?.triger_time}
              onPressTextInput={() => {
                if (alertState?.docstatus === 0) {
                  handleFunctionCall('trigerTime');
                  triggerTimeRef.current?.present();
                }
              }}
              inputStyles={{
                color: isDarkMode ? Colors.dark.black : Colors.light.white,
              }}
              showSecondChildren={
                alertState?.docstatus === 0 && alertState.triger_time
              }
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
            editable={alertState?.docstatus === 0}
            value={String(alertState?.time_value) || ''}
            onChange={text => updateField('time_value', text)}
            inputStyles={{
              color: isDarkMode ? Colors.dark.black : Colors.light.white,
            }}
            showSecondChildren={
              alertState?.docstatus === 0 && String(alertState?.time_value)
            }
            SecondChildren={
              <TouchableOpacity
                onPress={() =>
                  setAlertState(prev => ({...prev, time_value: ''}))
                }>
                <SvgIcon.Wrong
                  color={isDarkMode ? Colors.dark.black : Colors.light.white}
                />
              </TouchableOpacity>
            }
          />

          {alertState?.docstatus === 0 ? (
            <CustomDatePicker
              label="Sechedule Time"
              required={true}
              onChange={time => updateField('scheduler_time', time)}
              hour12={false}
              mode="time"
              display="default"
              selectedDate={alertState.scheduler_time}
            />
          ) : (
            <CustomInput
              label="Scheduler Time"
              required={true}
              editable={false}
              value={alertState?.scheduler_time}
              inputStyles={{
                color: isDarkMode ? Colors.dark.black : Colors.light.white,
              }}
            />
          )}
          <CustomInput
            label="Repetition Frequency"
            required={true}
            editable={false}
            value={alertState?.repetition_frequency}
            onPressTextInput={() => {
              if (alertState?.docstatus === 0) {
                handleFunctionCall('repetitionFrequency');
                repetitionFrequencyRef.current?.present();
              }
            }}
            inputStyles={{
              color: isDarkMode ? Colors.dark.black : Colors.light.white,
            }}
            showSecondChildren={
              alertState?.docstatus === 0 && alertState.repetition_frequency
            }
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
            required={true}
            editable={false}
            value={alertState?.template}
            onPressTextInput={() => {
              if (alertState?.docstatus === 0) {
                handleFunctionCall('template');
                templateRef.current?.present();
              }
            }}
            inputStyles={{
              color: isDarkMode ? Colors.dark.black : Colors.light.white,
            }}
            showSecondChildren={
              alertState?.docstatus === 0 && alertState.template
            }
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
              borderColor: isDarkMode ? Colors.dark.black : Colors.light.white,
              opacity: 0.9,
            }}>
            <TextComponent
              text={alertState?.message}
              color={!isDarkMode ? Colors.light.white : Colors.dark.black}
              lineHeight={20}
              font={fontNames.ROBOTO_FONT_FAMILY_REGULAR}
            />
          </View>
          <CustomInput
            label="Header Type"
            required={true}
            editable={false}
            value={alertState?.header_type}
            inputStyles={{
              color: isDarkMode ? Colors.dark.black : Colors.light.white,
            }}
          />
          <CustomInput
            label="Header Name"
            required={true}
            editable={alertState?.docstatus === 0}
            value={alertState?.header_name}
            onChange={text => updateField('header_name', text)}
            inputStyles={{
              color: isDarkMode ? Colors.dark.black : Colors.light.white,
            }}
            showSecondChildren={
              alertState?.docstatus === 0 && alertState?.header_name
            }
            SecondChildren={
              <TouchableOpacity
                onPress={() =>
                  setAlertState(prev => ({...prev, header_name: ''}))
                }>
                <SvgIcon.Wrong
                  color={isDarkMode ? Colors.dark.black : Colors.light.white}
                />
              </TouchableOpacity>
            }
          />
          <CustomInput
            required={true}
            value={alertState.media_type || 'Select'}
            onPressTextInput={() => {
              if (alertState?.docstatus === 0) {
                setAlertState(pre => ({
                  ...pre,
                  isMediaTypeShowMoadl: !pre.isMediaTypeShowMoadl,
                }));
              }
            }}
            editable={false}
            inputStyles={{
              color: isDarkMode ? Colors.dark.black : Colors.light.white,
            }}
            label="Media Type"
          />
          {alertState.isMediaTypeShowMoadl &&
            ['Uploaded to Meta', 'Upload Now'].map(option => (
              <TouchableOpacity
                key={option}
                onPress={() => {
                  setAlertState(prev => ({
                    ...prev,
                    media_type: option,
                    isMediaTypeShowMoadl: false,
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

          {alertState.media_type === 'Upload Now' && (
            <CustomInput
              required={true}
              value={alertState.filename || 'Select'}
              onPressTextInput={async () => {
                if (alertState.docstatus === 0) {
                  const result = await pickAndSendMediaMessage();

                  setAlertState(pre => ({
                    ...pre,
                    filedata: result.data?.base64String,
                    filename: result.data?.name,
                  }));
                }
              }}
              editable={false}
              inputStyles={{
                color: isDarkMode ? Colors.dark.black : Colors.light.white,
              }}
              label="Header Sample"
            />
          )}

          {alertState?.sample_values?.length > 0 &&
            alertState.sample_values[0] !== null && (
              <>
                <TextComponent
                  text={'Send Message Variables'}
                  size={textScale(18)}
                  color={isDarkMode ? Colors.dark.black : Colors.light.white}
                  textAlign={'center'}
                  style={{marginBottom: spacing.MARGIN_10}}
                />
                <View style={styles.tableHeader}>
                  <TextComponent
                    text="Template Variable"
                    color={isDarkMode ? Colors.dark.black : Colors.light.white}
                    fontWeight="bold"
                    style={[styles.tableCell, styles.headerCell]}
                  />
                  <TextComponent
                    text="Field Name"
                    color={isDarkMode ? Colors.dark.black : Colors.light.white}
                    fontWeight="bold"
                    style={[styles.tableCell, styles.headerCell]}
                  />
                </View>

                {alertState?.sample_values.map((variable, index) => (
                  <View key={index} style={styles.tableRow}>
                    <TextComponent
                      text={variable.variable}
                      color={
                        isDarkMode ? Colors.dark.black : Colors.light.white
                      }
                      style={styles.tableCell}
                    />
                    <TextComponent
                      text={variable.field_name || 'N/A'}
                      color={
                        isDarkMode ? Colors.dark.black : Colors.light.white
                      }
                      style={styles.tableCell}
                    />
                    {alertState?.docstatus === 0 && (
                      <TouchableOpacity onPress={() => editVariableRow(index)}>
                        <SvgIcon.EditIcon
                          color={
                            isDarkMode ? Colors.dark.black : Colors.light.white
                          }
                        />
                      </TouchableOpacity>
                    )}
                  </View>
                ))}
              </>
            )}
          {alertState?.docstatus === 0 && (
            <CustomButton
              title={!isSavedReminder ? 'Save' : 'Sumbit'}
              onPress={!isSavedReminder ? saveDateReminder : submitDateReminder}
              isLoading={
                isLoadingSaveDateReminder || isLoadingSumbitDateReminder
              }
              disabled={alertState?.docstatus === 1}
            />
          )}
        </ContainerComponent>
      )}

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
                updateField('header_type', item?.header_type);
                updateField('message', item?.template);
                updateField('template', item?.actual_name);
                updateField('sample_values', [item?.sample_values]);
                custmizeRowVariable([item?.sample_values]);
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
                updateField('repetition_frequency', item);
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
                updateField('time_unit', item);
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
                updateField('triger_time', item);
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
                updateField('map_recipient', item?.fieldname);
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
                updateField('date_field', item?.fieldname);
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
        ref={editeVariableFeildRef}
        snapPoints={['70%']}
        data={[1]}
        renderItem={() => {
          return (
            <View style={{paddingHorizontal: spacing.PADDING_16}}>
              <CustomInput
                value={
                  alertState?.sample_values[tempVariableMessageRowIndex]
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
                  alertState?.sample_values[tempVariableMessageRowIndex]
                    ?.field_name
                }
                placeholder="Field name"
                label="Field name"
                editable={false}
                onPressTextInput={text => {
                  handleFunctionCall('field_name');
                  setTempVariableMessageRowIndex(tempVariableMessageRowIndex);
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
                      setTempVariableMessageRowIndex(
                        tempVariableMessageRowIndex,
                      );
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
                value={alertState.document_type}
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
                  tempVariableMessageRowIndex,
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
    </>
  );
};

export default DateReminderRow;

const styles = StyleSheet.create({
  container: {
    padding: spacing.PADDING_16,
    backgroundColor: Colors.default.background,
  },
  header: {
    marginBottom: spacing.MARGIN_16,
  },
  tableHeader: {
    flexDirection: 'row',
    paddingBottom: spacing.PADDING_8,
    paddingHorizontal: spacing.PADDING_8,
  },
  tableRow: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: Colors.default.black,
    paddingVertical: spacing.PADDING_8,
    paddingHorizontal: spacing.PADDING_8,
  },
  tableCell: {
    flex: 1,
    fontSize: textScale(14),
  },
  headerCell: {
    fontWeight: 'bold',
  },
  modalItem: {
    paddingVertical: spacing.PADDING_8,
    paddingHorizontal: spacing.PADDING_16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.grey,
  },
});
