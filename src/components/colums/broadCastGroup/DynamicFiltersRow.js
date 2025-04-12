import React, { useState } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import * as Svg from '../../../assets';
import { textScale } from '../../../styles/responsiveStyles';
import { spacing } from '../../../styles/spacing';
import Colors from '../../../theme/colors';
import colors from '../../../utils/colors';
import CustomInput from '../../common/CustomInput';
import TextComponent from '../../common/TextComponent';

const DynamicFiltersRow = React.memo(
  ({
    index,
    filter,
    isDarkMode,
    onFilterChange,
    onDynamicFilterApiCall,
    onRemoveRow,
  }) => {
    const [loadingField, setLoadingField] = useState(false);
    const [loadingOperator, setLoadingOperator] = useState(false);
    const [loadingLogicalOperator, setLoadingLogicalOperator] = useState(false);

    const handleFilterApiCall = async filterType => {
      let setLoading;
      switch (filterType) {
        case 'filterOnField':
          setLoading = setLoadingField;
          break;
        case 'operator':
          setLoading = setLoadingOperator;
          break;
        case 'logicalOperator':
          setLoading = setLoadingLogicalOperator;
          break;
        default:
          return;
      }

      try {
        setLoading(true);
        await onDynamicFilterApiCall(filterType, index);
      } catch (error) {
        console.error(`Error fetching ${filterType}:`, error);
      } finally {
        setLoading(false);
      }
    };

    const renderLoadingIndicator = isLoading => {
      return isLoading ? (
        <ActivityIndicator
          size="small"
          color={colors.primary}
          style={styles.loadingIndicator}
        />
      ) : null;
    };

    return (
      <View style={styles.container}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: spacing.PADDING_8,
            marginBottom: spacing.MARGIN_6,
          }}>
          <TextComponent
            text={`Row ${index + 1}`}
            color={!isDarkMode ? Colors.dark.black : Colors.light.white}
            size={textScale(16)}
          />
          <TouchableOpacity onPress={() => onRemoveRow(index)}>
            <Svg.DeleteIcon color={Colors.default.error} />
          </TouchableOpacity>
        </View>

        {/* Field Selection */}
        <CustomInput
          placeholder="Filter on Field"
          editable={false}
          value={filter.filterOnField}
          onPressTextInput={() => handleFilterApiCall('filterOnField')}
          inputStyles={{
            color: !isDarkMode ? Colors.dark.black : Colors.light.white,
          }}
        />
        {renderLoadingIndicator(loadingField)}

        {/* Operator Selection */}
        <CustomInput
          placeholder="Operator"
          editable={false}
          value={filter.operator}
          onPressTextInput={() => handleFilterApiCall('operator')}
          inputStyles={{
            color: !isDarkMode ? Colors.dark.black : Colors.light.white,
          }}
        />

        {renderLoadingIndicator(loadingOperator)}

        {/* Value Input */}
        <CustomInput
          placeholder="Value"
          value={filter.value}
          onChange={text => onFilterChange(index, 'value', text)}
          inputStyles={{
            color: !isDarkMode ? Colors.dark.black : Colors.light.white,
          }}
        />

        {/* Logical Operator Selection */}

        <CustomInput
          placeholder="Logical Operator"
          editable={false}
          value={filter.logicalOperator}
          onPressTextInput={() => handleFilterApiCall('logicalOperator')}
          inputStyles={{
            color: !isDarkMode ? Colors.dark.black : Colors.light.white,
          }}
        />

        {renderLoadingIndicator(loadingLogicalOperator)}
      </View>
    );
  },
);

export default DynamicFiltersRow;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: spacing.MARGIN_8,
    paddingHorizontal: spacing.PADDING_12,
  },

  input: {
    marginBottom: spacing.MARGIN_10,
    flex: 1,
  },
  disabledInput: {
    opacity: 0.5,
  },
  loadingIndicator: {
    marginLeft: 10,
  },
});
