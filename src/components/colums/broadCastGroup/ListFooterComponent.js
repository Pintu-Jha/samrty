import React from 'react';
import {View} from 'react-native';
import {spacing} from '../../../styles/spacing';
import CustomButton from '../../common/CustomButton';

const ListFooterComponent = ({
  isDynamicFilters,
  dynamicFilters,
  addFilterRow,
  createGroupHandler,
  isCreatingGroup,
  selectedContacts,
}) => {
  
  return (
    <View
      style={{
        marginBottom: spacing.MARGIN_60,
        marginHorizontal: spacing.MARGIN_10,
      }}>
      {selectedContacts.size === 0 && (
        <CustomButton
          title={dynamicFilters.length > 0 ? 'Add Row' : 'Dynamic Filter'}
          onPress={addFilterRow}
          buttonStyle={{marginTop: spacing.MARGIN_12}}
        />
      )}
      <CustomButton
        title={'Create Group'}
        onPress={createGroupHandler}
        isLoading={isCreatingGroup}
        buttonStyle={{marginTop: spacing.MARGIN_12}}
      />
    </View>
  );
};

export default ListFooterComponent;
