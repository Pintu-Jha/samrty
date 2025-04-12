import React, { forwardRef } from 'react';
import { View } from 'react-native';;
import { fontNames } from '../../../styles/typography';
import TextComponent from '../../common/TextComponent';
import CustomButton from '../../common/CustomButton';
import LoadingScreen from '../../common/Loader';
import CustomBottomSheetFlatList from '../../common/CustomBottomSheetFlatList';
// import styles from '../styles';

export const MessageBottomSheet = forwardRef(({
  data,
  loading,
  activeQuery,
  onItemPress,
  onQuerySelect,
}, ref) => {
  const renderItem = ({ item }) => (
    <View style={styles.whatsAppMessageKeyWordListContainer}>
      <TextComponent
        text={formatDocName(item?.name)}
        font={fontNames.ROBOTO_FONT_FAMILY_MEDIUM}
      />

      <CustomButton
      title={'Send'}
        buttonStyle={styles.sendButtonBottomSheet}
        textStyle={styles.sendButtonTextBottomSheet}
        onPress={() => onItemPress(item?.name)}    
      />
    </View>
  );

  const renderEmptyComponent = () => {
    if (loading) {
      return <LoadingScreen />;
    }

    return (
      <View style={styles.chatOptionContainer}>
        {QUERY_TYPES.map((docType, index) => (
          <CustomButton
            key={index}
            buttonStyle={styles.templateBtnStyle}
            title={docType.split('_')[1]}
            textStyle={styles.templateKeyWord}
            onPress={() => onQuerySelect(docType)}
          />
        ))}
      </View>
    );
  };

  return (
    <CustomBottomSheetFlatList
      ref={ref}
      snapPoints={['40%', '80%']}
      data={data}
      keyExtractor={(item, index) => item?.id?.toString() || index.toString()}
      renderItem={renderItem}
      ListEmptyComponent={renderEmptyComponent}
      contentContainerStyle={styles.bottomSheetContent}
    />
  );
});