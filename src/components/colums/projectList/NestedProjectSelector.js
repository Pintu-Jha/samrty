import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import TextComponent from '../../common/TextComponent';
import CustomBottomSheetFlatList from '../../common/CustomBottomSheetFlatList';
import * as SvgIcon from '../../../assets'; // Adjust the import based on your structure
import { textScale } from '../../../styles/responsiveStyles';
import { fontNames } from '../../../styles/typography';
import Colors from '../../../theme/colors';

const NestedProjectSelector = ({
  nestedprojectBottomSheetRef,
  currentField,
  getCurrentFieldData,
  handleNestedSelection,
  themeColors,
  isDarkMode,
  schemeBottonSheetRef,
}) => { 
  return (
    <CustomBottomSheetFlatList
      ref={nestedprojectBottomSheetRef}
      snapPoints={['50%']}
      data={getCurrentFieldData()}
      keyExtractor={(item, index) => `Project_${index.toString()}`}
      renderItem={({ item }) => {
        if (!item || !(item.name || item)) {
          return null;
        }
        return (
          <TouchableOpacity
            onPress={() => handleNestedSelection(item || item.name)}
            style={{
              padding: 10,
              borderBottomWidth: 1,
              borderBottomColor: themeColors.borderColor,
            }}>
            <TextComponent
              text={item.name || item}
              style={{
                color: themeColors.textColor,
                fontSize: textScale(18),
                fontFamily: fontNames.ROBOTO_FONT_FAMILY_MEDIUM,
              }}
            />
          </TouchableOpacity>
        );
      }}
      ListEmptyComponent={
        <TextComponent
          text={'No data available'}
          style={{ textAlign: 'center', color: themeColors.textColor }}
        />
      }
      ListHeaderComponent={
        <View
          style={{
            position: 'relative',
            alignItems: 'center',
            paddingVertical: 10,
          }}>
          {/* Centered Text */}
          {currentField ? (
            <TextComponent
              text={currentField.replace(/_/g, ' ').toLocaleUpperCase()}
              style={{
                textAlign: 'center',
                color: themeColors.textColor,
                fontSize: textScale(18),
                fontFamily: fontNames.ROBOTO_FONT_FAMILY_BOLD,
              }}
            />
          ) : null}

          {/* Right-Aligned Icon */}
          {currentField === 'project_scheme' && (
            <TouchableOpacity
              style={{
                position: 'absolute',
                right: 10,
                top: '50%',
              }}
              onPress={() => schemeBottonSheetRef.current.present()}>
              <SvgIcon.AddICon
                color={isDarkMode ? Colors.dark.black : Colors.light.white}
              />
            </TouchableOpacity>
          )}
        </View>
      }
    />
  );
};

export default NestedProjectSelector;

const styles = StyleSheet.create({
  // Add any styles you need here
});