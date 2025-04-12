import React from 'react';
import { View, StyleSheet, Platform ,TouchableOpacity} from 'react-native';
import CustomInput from '../../common/CustomInput';
import CustomButton from '../../common/CustomButton';
import TextComponent from '../../common/TextComponent';
import * as SvgIcon from '../../../assets'; // Adjust the import based on your structure
import DateTimePicker from '@react-native-community/datetimepicker';
import { spacing } from '../../../styles/spacing';
import Colors from '../../../theme/colors';
import { textScale } from '../../../styles/responsiveStyles';

const ProjectAddForm = ({
  formState,
  formStateDisplay,
  handleInputChange,
  handleCreateProject,
  isLoadingCreateProject,
  isDarkMode,
  showStartPicker,
  setShowStartPicker,
  showEndPicker,
  setShowEndPicker,
  handleDateChange,
  getValidDate,
  isDisableCreateProjectBtn,
  openNestedBottomSheet,
  triggerGetProjectType,
  triggerGetProjectScheme,
  triggerGetAllStatus,
  triggerGetAllTehsil,
}) => {
  return (
    <View style={styles.formContainer}>
      <TextComponent
        text={'Create Project'}
        size={textScale(16)}
        style={{
          color: isDarkMode ? Colors.dark.black : Colors.light.white,
          marginVertical: spacing.MARGIN_10,
        }}
        textAlign={'center'}
      />

      {/* Project Name */}
      <CustomInput
        placeholder="Project Name"
        placeholderColor={isDarkMode ? Colors.dark.black : Colors.light.white}
        value={formState.project_name}
        onChange={text => handleInputChange('project_name', text)}
        inputStyles={{
          color: isDarkMode ? Colors.dark.black : Colors.light.white,
        }}
        showSecondChildren={formState.project_name}
        SecondChildren={
          <TouchableOpacity
            onPress={() => {
              handleInputChange('project_name', '');
            }}>
            <SvgIcon.Wrong
              color={isDarkMode ? Colors.dark.black : Colors.light.white}
            />
          </TouchableOpacity>
        }
      />

      {/* Project Code */}
      <CustomInput
        placeholder="Project Code"
        placeholderColor={isDarkMode ? Colors.dark.black : Colors.light.white}
        value={formState.project_code}
        onChange={text => handleInputChange('project_code', text)}
        inputStyles={{
          color: isDarkMode ? Colors.dark.black : Colors.light.white,
        }}
        showSecondChildren={formState.project_code}
        SecondChildren={
          <TouchableOpacity
            onPress={() => {
              handleInputChange('project_code', '');
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
        placeholderColor={isDarkMode ? Colors.dark.black : Colors.light.white}
        value={formStateDisplay.project_type}
        onPressTextInput={() => openNestedBottomSheet('project_type', triggerGetProjectType)}
        editable={false}
        inputStyles={{
          color: isDarkMode ? Colors.dark.black : Colors.light.white,
        }}
        showSecondChildren={true}
        SecondChildren={
          formStateDisplay.project_type ? (
            <TouchableOpacity
              onPress={() => {
                handleInputChange('project_type', '');
              }}>
              <SvgIcon.Wrong
                color={isDarkMode ? Colors.dark.black : Colors.light.white}
              />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={() => openNestedBottomSheet('project_type', triggerGetProjectType)}>
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
        placeholderColor={isDarkMode ? Colors.dark.black : Colors.light.white}
        value={formStateDisplay.project_scheme}
        onPressTextInput={() => openNestedBottomSheet('project_scheme', triggerGetProjectScheme)}
        editable={false}
        inputStyles={{
          color: isDarkMode ? Colors.dark.black : Colors.light.white,
        }}
        showSecondChildren={true}
        SecondChildren={
          formStateDisplay.project_scheme ? (
            <TouchableOpacity
              onPress={() => {
                handleInputChange('project_scheme', '');
              }}>
              <SvgIcon.Wrong
                color={isDarkMode ? Colors.dark.black : Colors.light.white}
              />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={() => openNestedBottomSheet('project_scheme', triggerGetProjectScheme)}>
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
        placeholderColor={isDarkMode ? Colors.dark.black : Colors.light.white}
        value={formState.status}
        onPressTextInput={() => openNestedBottomSheet('status', triggerGetAllStatus)}
        editable={false}
        inputStyles={{
          color: isDarkMode ? Colors.dark.black : Colors.light.white,
        }}
        showSecondChildren={true}
        SecondChildren={
          formState.status ? (
            <TouchableOpacity
              onPress={() => {
                handleInputChange('status', '');
              }}>
              <SvgIcon.Wrong
                color={isDarkMode ? Colors.dark.black : Colors.light.white}
              />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={() => openNestedBottomSheet('status', triggerGetAllStatus)}>
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
        placeholderColor={isDarkMode ? Colors.dark.black : Colors.light.white}
        value={formStateDisplay.village}
        onPressTextInput={() => openNestedBottomSheet('tehsil', triggerGetAllTehsil)}
        inputStyles={{
          color: isDarkMode ? Colors.dark.black : Colors.light.white,
        }}
        editable={false}
        showSecondChildren={true}
        SecondChildren={
          formStateDisplay.village ? (
            <TouchableOpacity
              onPress={() => {
                handleInputChange('village', '');
              }}>
              <SvgIcon.Wrong
                color={isDarkMode ? Colors.dark.black : Colors.light.white}
              />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={() => openNestedBottomSheet('tehsil', triggerGetAllTehsil)}>
              <SvgIcon.RightArrowIcon
                color={isDarkMode ? Colors.dark.black : Colors.light.white}
              />
            </TouchableOpacity>
          )
        }
      />

      {/* Cost Fields */}
      <CustomInput
        placeholder="Estimated Cost"
        placeholderColor={isDarkMode ? Colors.dark.black : Colors.light.white}
        value={formState.estimated_cost}
        onChange={text => handleInputChange('estimated_cost', text)}
        inputStyles={{
          color: isDarkMode ? Colors.dark.black : Colors.light.white,
        }}
        type={'numeric'}
        showSecondChildren={formState.estimated_cost}
        SecondChildren={
          <TouchableOpacity
            onPress={() => handleInputChange('estimated_cost', '')}>
            <SvgIcon.Wrong
              color={isDarkMode ? Colors.dark.black : Colors.light.white}
            />
          </TouchableOpacity>
        }
      />
      <CustomInput
        placeholder="Allocated Cost"
        placeholderColor={isDarkMode ? Colors.dark.black : Colors.light.white}
        value={formState.allocated_cost}
        onChange={text => handleInputChange('allocated_cost', text)}
        inputStyles={{
          color: isDarkMode ? Colors.dark.black : Colors.light.white,
        }}
        type={'numeric'}
        showSecondChildren={formState.allocated_cost}
        SecondChildren={
          <TouchableOpacity
            onPress={() => handleInputChange('allocated_cost', '')}>
            <SvgIcon.Wrong
              color={isDarkMode ? Colors.dark.black : Colors.light.white}
            />
          </TouchableOpacity>
        }
      />
      <CustomInput
        placeholder="Actual Cost"
        placeholderColor={isDarkMode ? Colors.dark.black : Colors.light.white}
        value={formState.actual_cost}
        type={'numeric'}
        onChange={text => handleInputChange('actual_cost', text)}
        inputStyles={{
          color: isDarkMode ? Colors.dark.black : Colors.light.white,
        }}
        showSecondChildren={formState.actual_cost}
        SecondChildren={
          <TouchableOpacity
            onPress={() => handleInputChange('actual_cost', '')}>
            <SvgIcon.Wrong
              color={isDarkMode ? Colors.dark.black : Colors.light.white}
            />
          </TouchableOpacity>
        }
      />

      {/* Start Date */}
      <CustomInput
        placeholder="Start Date"
        placeholderColor={isDarkMode ? Colors.dark.black : Colors.light.white}
        value={formStateDisplay.start_date}
        editable={false}
        inputStyles={{
          color: isDarkMode ? Colors.dark.black : Colors.light.white,
        }}
        onPressTextInput={() => setShowStartPicker(true)}
        showSecondChildren={formState.start_date}
        SecondChildren={
          <TouchableOpacity
            onPress={() => {
              handleInputChange('start_date', '');
            }}>
            <SvgIcon.Wrong
              color={isDarkMode ? Colors.dark.black : Colors.light.white}
            />
          </TouchableOpacity>
        }
      />
      {Platform.OS === 'android' && showStartPicker && (
        <DateTimePicker
          value={getValidDate(formState.start_date)}
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
        placeholderColor={isDarkMode ? Colors.dark.black : Colors.light.white}
        value={formStateDisplay.end_date}
        editable={false}
        inputStyles={{
          color: isDarkMode ? Colors.dark.black : Colors.light.white,
        }}
        showSecondChildren={formState.end_date}
        onPressTextInput={() => setShowEndPicker(true)}
        SecondChildren={
          <TouchableOpacity
            onPress={() => {
              handleInputChange('end_date', '');
            }}>
            <SvgIcon.Wrong
              color={isDarkMode ? Colors.dark.black : Colors.light.white}
            />
          </TouchableOpacity>
        }
      />
      {Platform.OS === 'android' && showEndPicker && (
        <DateTimePicker
          value={getValidDate(formState.end_date)}
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
        placeholderColor={isDarkMode ? Colors.dark.black : Colors.light.white}
        value={formState.project_description}
        onChange={text => handleInputChange('project_description', text)}
        styles={[styles.descriptionInput]}
        inputStyles={{
          color: isDarkMode ? Colors.dark.black : Colors.light.white,
        }}
        multiline
        showSecondChildren={formState.project_description}
        SecondChildren={
          <TouchableOpacity
            onPress={() => {
              handleInputChange('project_description', '');
            }}>
            <SvgIcon.Wrong
              color={isDarkMode ? Colors.dark.black : Colors.light.white}
            />
          </TouchableOpacity>
        }
      />

      {/* Submit Button */}
      <CustomButton
        title="Create Project"
        onPress={handleCreateProject}
        isLoading={isLoadingCreateProject}
        disabled={isDisableCreateProjectBtn}
      />
    </View>
  );
};

export default ProjectAddForm;

const styles = StyleSheet.create({
  formContainer: {
    flexGrow: 1,
    paddingVertical: spacing.PADDING_16,
    paddingHorizontal: spacing.PADDING_10,
  },
  descriptionInput: {
    height: spacing.HEIGHT_105,
    color: Colors.black,
    flex: 1,
  },
});