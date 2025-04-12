import DateTimePicker from '@react-native-community/datetimepicker';
import React from 'react';
import {Platform, StyleSheet, TouchableOpacity, View} from 'react-native';
import * as SvgIcon from '../../../assets'; // Adjust the import based on your structure
import {textScale} from '../../../styles/responsiveStyles';
import {spacing} from '../../../styles/spacing';
import {fontNames} from '../../../styles/typography';
import Colors from '../../../theme/colors';
import CustomButton from '../../common/CustomButton';
import CustomInput from '../../common/CustomInput';
import TextComponent from '../../common/TextComponent';
import { useTheme } from '../../hooks';
import THEME_COLOR from '../../../utils/constant'

const EditProjectForm = ({
  editFormState,
  editFormStateDisplay,
  handleEditInputChange,
  handleEditProject,
  isLoadingEditProject,
  
  setShowStartPicker,
  setShowEndPicker,
  showStartPicker,
  showEndPicker,
  handleDateChange,
  getValidDate,
  openNestedBottomSheet,
  triggerGetProjectType,
  triggerGetProjectScheme,
  triggerGetAllStatus,
  setEditFormState,
  setEditFormStateDisplay,
  isEditProjectCode,
}) => {
  const {theme} = useTheme()
  const isDarkMode = theme === THEME_COLOR
  return (
    <View style={styles.formContainer}>
      <TextComponent
        text={'Edit Project'}
        size={textScale(16)}
        style={{
          color: isDarkMode ? Colors.dark.black : Colors.light.white,
          marginVertical: spacing.MARGIN_10,
        }}
        textAlign={'center'}
      />

      <CustomInput
        placeholder="Project Name"
        value={editFormState.project_name}
        inputStyles={{
          color: isDarkMode ? Colors.dark.black : Colors.light.white,
        }}
        editable={false}
      />

      {/* Project Code */}
      <CustomInput
        placeholder="Project Code"
        value={editFormState.project_code}
        onChange={text => handleEditInputChange('project_code', text)}
        inputStyles={{
          color: isDarkMode ? Colors.dark.black : Colors.light.white,
        }}
        editable={isEditProjectCode}
        showSecondChildren={!!editFormState.project_code && isEditProjectCode}
        SecondChildren={
          <TouchableOpacity
            onPress={() => {
              if (editFormState.project_code) {
                setEditFormState(prevState => ({
                  ...prevState,
                  project_code: '',
                }));
              }
            }}>
            <SvgIcon.Wrong
              color={isDarkMode ? Colors.dark.black : Colors.light.white}
            />
          </TouchableOpacity>
        }
      />

      {/* Project Type */}
      <CustomInput
        placeholder="Project Type"
        value={editFormStateDisplay.project_type}
        onPressTextInput={() =>
          openNestedBottomSheet('project_type', triggerGetProjectType)
        }
        editable={false}
        inputStyles={{
          color: isDarkMode ? Colors.dark.black : Colors.light.white,
        }}
        showSecondChildren={true}
        SecondChildren={
          editFormState.project_type ? (
            <TouchableOpacity
              onPress={() => {
                handleEditInputChange('project_type', '');
                setEditFormState(preState => ({
                  ...preState,
                  project_type: '',
                })),
                  setEditFormStateDisplay(preState => ({
                    ...preState,
                    project_type: '',
                  }));
              }}>
              <SvgIcon.Wrong
                color={isDarkMode ? Colors.dark.black : Colors.light.white}
              />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={() =>
                openNestedBottomSheet('project_type', triggerGetProjectType)
              }>
              <SvgIcon.RightArrowIcon
                color={isDarkMode ? Colors.dark.black : Colors.light.white}
              />
            </TouchableOpacity>
          )
        }
      />

      {/* Project Scheme */}
      <CustomInput
        placeholder="Project Scheme"
        placeholderTextColor={isDarkMode ? Colors.dark.black : Colors.light.white}
        value={editFormStateDisplay.project_scheme}
        onPressTextInput={() =>
          openNestedBottomSheet('project_scheme', triggerGetProjectScheme)
        }
        editable={false}
        inputStyles={{
          color: isDarkMode ? Colors.dark.black : Colors.light.white,
        }}
        showSecondChildren={true}
        SecondChildren={
          editFormState.project_scheme ? (
            <TouchableOpacity
              onPress={() => {
                handleEditInputChange('project_scheme', '');
                setEditFormStateDisplay(preState => ({
                  ...preState,
                  project_scheme: '',
                }));
                setEditFormState(preState => ({
                  ...preState,
                  project_scheme: '',
                }));
              }}>
              <SvgIcon.Wrong
                color={isDarkMode ? Colors.dark.black : Colors.light.white}
              />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={() =>
                openNestedBottomSheet('project_scheme', triggerGetProjectScheme)
              }>
              <SvgIcon.RightArrowIcon
                color={isDarkMode ? Colors.dark.black : Colors.light.white}
              />
            </TouchableOpacity>
          )
        }
      />

      {/* Status */}
      <CustomInput
        placeholder="Status"
        value={editFormState.status}
        onPressTextInput={() =>
          openNestedBottomSheet('status', triggerGetAllStatus)
        }
        editable={false}
        inputStyles={{
          color: isDarkMode ? Colors.dark.black : Colors.light.white,
        }}
        showSecondChildren={editFormState.status}
        SecondChildren={
          editFormState.status ? (
            <TouchableOpacity
              onPress={() => {
                handleEditInputChange('status', '');
                setEditFormState(preState => ({
                  ...preState,
                  status: '',
                }));
              }}>
              <SvgIcon.Wrong
                color={isDarkMode ? Colors.dark.black : Colors.light.white}
              />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={() =>
                openNestedBottomSheet('status', triggerGetAllStatus)
              }>
              <SvgIcon.RightArrowIcon
                color={isDarkMode ? Colors.dark.black : Colors.light.white}
              />
            </TouchableOpacity>
          )
        }
      />

      {/* Village */}
      <CustomInput
        placeholder="Village"
        value={editFormStateDisplay.village}
        editable={false}
        inputStyles={{
          color: isDarkMode ? Colors.dark.black : Colors.light.white,
        }}
      />

      {/* Cost Fields */}
      <CustomInput
        placeholder="Estimated Cost"
        value={editFormState.estimated_cost?.toString()}
        type={'numeric'}
        onChange={text =>
          setEditFormState(preState => ({
            ...preState,
            estimated_cost: text,
          }))
        }
        inputStyles={{
          color: isDarkMode ? Colors.dark.black : Colors.light.white,
        }}
        showSecondChildren={editFormState.estimated_cost}
        SecondChildren={
          <TouchableOpacity
            onPress={() => handleEditInputChange('estimated_cost', '')}>
            <SvgIcon.Wrong
              color={isDarkMode ? Colors.dark.black : Colors.light.white}
            />
          </TouchableOpacity>
        }
      />

      <CustomInput
        placeholder="Allocated Cost"
        value={editFormState.allocated_cost?.toString()}
        type={'numeric'}
        onChange={text =>
          setEditFormState(preState => ({
            ...preState,
            allocated_cost: text,
          }))
        }
        inputStyles={{
          color: isDarkMode ? Colors.dark.black : Colors.light.white,
        }}
        showSecondChildren={editFormState.allocated_cost}
        SecondChildren={
          <TouchableOpacity
            onPress={() => handleEditInputChange('allocated_cost', '')}>
            <SvgIcon.Wrong
              color={isDarkMode ? Colors.dark.black : Colors.light.white}
            />
          </TouchableOpacity>
        }
      />

      <CustomInput
        placeholder="Actual Cost"
        value={editFormState.actual_cost?.toString()}
        type={'numeric'}
        onChange={text => handleEditInputChange('actual_cost', text)}
        inputStyles={{
          color: isDarkMode ? Colors.dark.black : Colors.light.white,
        }}
        showSecondChildren={editFormState.actual_cost}
        SecondChildren={
          <TouchableOpacity
            onPress={() =>
              setEditFormState(preState => ({
                ...preState,
                actual_cost: '',
              }))
            }>
            <SvgIcon.Wrong
              color={isDarkMode ? Colors.dark.black : Colors.light.white}
            />
          </TouchableOpacity>
        }
      />

      {/* Start Date */}
      <CustomInput
        placeholder="Start Date"
        value={editFormStateDisplay.start_date}
        inputStyles={{
          color: isDarkMode ? Colors.dark.black : Colors.light.white,
        }}
        editable={false}
        onPressTextInput={() => setShowStartPicker(true)}
        showSecondChildren={editFormState.start_date}
        SecondChildren={
          <TouchableOpacity
            onPress={() => {
              handleEditInputChange('start_date', '');
              setEditFormState(prevState => ({
                ...prevState,
                start_date: '',
              })),
                setEditFormStateDisplay(prevState => ({
                  ...prevState,
                  start_date: '',
                }));
            }}>
            <SvgIcon.Wrong
              color={isDarkMode ? Colors.dark.black : Colors.light.white}
            />
          </TouchableOpacity>
        }
      />
      {Platform.OS === 'android' && showStartPicker && (
        <DateTimePicker
          value={getValidDate(editFormState.start_date)}
          mode="date"
          is24Hour={false}
          display="spinner"
          onChange={(event, selectedDate) =>
            handleDateChange('start', event, selectedDate)
          }
        />
      )}

      {/* End Date */}
      <CustomInput
        placeholder="End Date"
        value={editFormStateDisplay.end_date}
        inputStyles={{
          color: isDarkMode ? Colors.dark.black : Colors.light.white,
        }}
        editable={false}
        onPressTextInput={() => setShowEndPicker(true)}
        showSecondChildren={editFormState.end_date}
        SecondChildren={
          <TouchableOpacity
            onPress={() => {
              handleEditInputChange('end_date', '');
              setEditFormState(prevState => ({
                ...prevState,
                end_date: '',
              })),
                setEditFormStateDisplay(prevState => ({
                  ...prevState,
                  end_date: '',
                }));
            }}>
            <SvgIcon.Wrong
              color={isDarkMode ? Colors.dark.black : Colors.light.white}
            />
          </TouchableOpacity>
        }
      />
      {Platform.OS === 'android' && showEndPicker && (
        <DateTimePicker
          value={getValidDate(editFormState.end_date)}
          mode="date"
          is24Hour={false}
          display="spinner"
          onChange={(event, selectedDate) =>
            handleDateChange('end', event, selectedDate)
          }
        />
      )}

      {/* Description */}
      <CustomInput
        placeholder="Project Description"
        value={editFormState.project_description}
        onChange={text => handleEditInputChange('project_description', text)}
        styles={[styles.descriptionInput]}
        inputStyles={{
          color: isDarkMode ? Colors.dark.black : Colors.light.white,
        }}
        multiline
        showSecondChildren={editFormState.project_description}
        SecondChildren={
          <TouchableOpacity
            onPress={() =>
              setEditFormState(preState => ({
                ...preState,
                project_description: '',
              }))
            }>
            <SvgIcon.Wrong
              color={isDarkMode ? Colors.dark.black : Colors.light.white}
            />
          </TouchableOpacity>
        }
      />

      {/* Submit Button */}
      <CustomButton
        title="Edit Project"
        onPress={handleEditProject}
        isLoading={isLoadingEditProject}
      />
    </View>
  );
};

export default EditProjectForm;

const styles = StyleSheet.create({
  formContainer: {
    flexGrow: 1,
    paddingVertical: spacing.PADDING_16,
    paddingHorizontal: spacing.PADDING_10,
    marginBottom: spacing.MARGIN_320,
  },
  header: {
    fontSize: textScale(20),
    fontFamily: fontNames.ROBOTO_FONT_FAMILY_BOLD,
    marginBottom: spacing.MARGIN_20,
    alignSelf: 'center',
  },
  descriptionInput: {
    height: spacing.HEIGHT_105,
    color: Colors.black,
    flex: 1,
  },
});
