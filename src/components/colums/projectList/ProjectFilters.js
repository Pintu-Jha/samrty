import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { spacing } from '../../../styles/spacing';
import Colors from '../../../theme/colors';
import TextComponent from '../../common/TextComponent';

// Function to get display value based on the filter key
const getDisplayValue = (key, filters, filterData) => {
  switch (key) {
    case 'tehsil':
      return filters.tehsil
        ? filterData.tehsil?.data?.find(item => item.name === filters.tehsil)
            ?.tehsil || ''
        : '';
    case 'panchayat':
      return filters.panchayat
        ? filterData.panchayat?.data?.find(
            item => item.name === filters.panchayat,
          )?.panchayat || ''
        : '';
    case 'village':
      return filters.village
        ? filterData.village?.data?.find(item => item.name === filters.village)
            ?.village_name || ''
        : '';
    case 'status':
      return filters.status || '';
    default:
      return filters[key] || '';
  }
};

const ProjectFilters = ({
  filters,
  setFilters,
  handleResetFilters,
  openModal,
  isDarkMode,
  filterData,
  areAllFiltersSelected,
}) => {
  return (
    <View style={styles.filterContainer}>
      {['tehsil', 'panchayat', 'village', 'status'].map(key => {
        const displayValue = getDisplayValue(key, filters, filterData);
        return (
          <TouchableOpacity
            key={key}
            onPress={() => openModal(key)}
            style={[
              styles.filterItem,
              {
                backgroundColor: !isDarkMode
                  ? Colors.dark.grey
                  : Colors.light.grey,
              },
            ]}>
            <TextComponent
              text={
                displayValue || `${key.charAt(0).toUpperCase() + key.slice(1)}`
              }
              style={{
                color: isDarkMode ? Colors.dark.black : Colors.light.white,
              }}
            />
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default ProjectFilters;

const styles = StyleSheet.create({
  filterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.PADDING_8,
    flexWrap: 'wrap',
  },
  filterItem: {
    width: '30%',
    marginVertical: spacing.MARGIN_6,
    paddingVertical: spacing.PADDING_14,
    borderRadius: spacing.RADIUS_8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  resetButton: {
    width: '30%',
    paddingVertical: spacing.PADDING_14,
    borderRadius: spacing.RADIUS_8,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
