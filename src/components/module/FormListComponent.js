import { useNavigation } from '@react-navigation/native';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useLazyGetAllFromDataQuery } from '../../api/slice/formSlice';
import * as SvgIcon from '../../assets';
import NavigationString from '../../navigations/navigationString';
import { textScale } from '../../styles/responsiveStyles';
import { spacing } from '../../styles/spacing';
import { fontNames } from '../../styles/typography';
import Colors from '../../theme/colors';
import colors from '../../utils/colors';
import THEME_COLOR from '../../utils/constant';
import { navigate, openDrawer, truncateText } from '../../utils/helperFunctions';
import CommoneHeader from '../common/CommoneHeader';
import CustomBottomSheet from '../common/CustomBottomSheet';
import CustomBottomSheetFlatList from '../common/CustomBottomSheetFlatList';
import CustomButton from '../common/CustomButton';
import LoadingScreen from '../common/Loader';
import TextComponent from '../common/TextComponent';
import { useTheme } from '../hooks';

const FormListComponent = () => {
  const {theme} = useTheme();
  const isDarkMode = theme === THEME_COLOR;
  const [selectedCategory, setSelectedCategory] = useState('');
  const [formName, setFormName] = useState('');
  const bottomSheetRef = useRef(null);
  const filterFormCategoryBottomSheet = useRef(null);

  // Lazy query: get the query trigger and its state
  const [getAllFromData, {data, isLoading}] = useLazyGetAllFromDataQuery();

  // Trigger the lazy query once on mount
  useEffect(() => {
    getAllFromData();
  }, [getAllFromData]);

  // Clear filter only when the screen loses focus (e.g. when switching tabs)
  const navigation = useNavigation();
  useEffect(() => {
    const unsubscribe = navigation.addListener('blur', () => {
      setSelectedCategory('');
    });
    return unsubscribe;
  }, [navigation]);

  // Memoize the filtered flows to avoid re-filtering on every render
  const filteredFlows = useMemo(() => {
    const flows = data?.message?.data || [];
    return selectedCategory === ''
      ? flows
      : flows.filter(flow => flow.category === selectedCategory);
  }, [data, selectedCategory]);

  // Render a single flow item
  const renderFlowItem = useCallback(
    ({item}) => {
      return (
        <>
          <TouchableOpacity
            style={styles.card}
            onPress={() => {
              bottomSheetRef.current?.present();
              setFormName(item?.name);
            }}>
            {item?.name && (
              <TextComponent
                text={truncateText(item?.name, 50).replace(/_/g, ' ')}
                color={isDarkMode ? Colors.dark.black : Colors.light.white}
                font={fontNames.ROBOTO_FONT_FAMILY_MEDIUM}
              />
            )}
            {item?.category && (
              <TextComponent
                text={item?.category}
                color={isDarkMode ? Colors.dark.black : Colors.light.white}
                size={textScale(13)}
                font={fontNames.ROBOTO_FONT_FAMILY_MEDIUM}
              />
            )}
            {item?.flow_description && (
              <TextComponent
                text={truncateText(item?.flow_description, 30)}
                color={isDarkMode ? Colors.dark.black : Colors.light.white}
                font={fontNames.ROBOTO_FONT_FAMILY_MEDIUM}
                style={{opacity: 0.6}}
              />
            )}
          </TouchableOpacity>
          <View
            style={[
              styles.divider,
              {backgroundColor: isDarkMode ? colors.grey300 : colors.grey600},
            ]}
          />
        </>
      );
    },
    [isDarkMode],
  );

  // Render a single category option for filtering
  const renderFilterFormCategoryItem = useCallback(
    ({item}) => (
      <TouchableOpacity
        onPress={() => {
          setSelectedCategory(item);
          filterFormCategoryBottomSheet.current.close();
        }}
        style={[
          styles.filterOption,
          selectedCategory === item && styles.selectedFilterOption,
        ]}>
        <TextComponent
          text={item}
          color={
            selectedCategory === item
              ? Colors.default.white
              : Colors.default.black
          }
          style={{padding: spacing.PADDING_10}}
          textAlign={'center'}
        />
      </TouchableOpacity>
    ),
    [selectedCategory],
  );

  // Header for the filter bottom sheet
  const filterFormCategoryListHeaderComponent = () => (
    <TextComponent
      text={'Filter by Category'}
      color={isDarkMode ? Colors.dark.black : Colors.light.white}
      size={textScale(18)}
      font={fontNames.ROBOTO_FONT_FAMILY_MEDIUM}
      textAlign={'center'}
    />
  );

  const filterFormCategoryListEmptyComponent = useCallback(
    () => (
      <View style={{alignItems: 'center', justifyContent: 'center', flex: 1}}>
        <TextComponent
          text={'No Data Present'}
          color={isDarkMode ? Colors.dark.black : Colors.light.white}
          size={textScale(16)}
          font={fontNames.ROBOTO_FONT_FAMILY_BOLD}
        />
      </View>
    ),
    [isDarkMode],
  );

  // Right icon actions: show filter bottom sheet or refetch data
  const handleRightIconPress = index => {
    const actions = {
      0: () => filterFormCategoryBottomSheet.current.present(),
      1: () => getAllFromData(),
    };

    const action = actions[index];
    if (action) {
      action();
    } else {
      console.log(index);
    }
  };

  return (
    <>
      <CommoneHeader
        title={'Form'}
        showLeftIcon={true}
        leftIcon={SvgIcon.MenuIcon}
        onLeftIconPress={() => openDrawer()}
        showRightIcons={true}
        rightIcons={[SvgIcon.Filter, SvgIcon.ReloadIcon]}
        onRightIconPress={handleRightIconPress}
        activeFilterIndex={selectedCategory && 0}
      />

      {isLoading ? (
        <LoadingScreen />
      ) : (
        <View style={styles.container}>
          <View style={{margin: spacing.MARGIN_16}}>
            <TextComponent
              text={'Reset All'}
              fontWeight={'bold'}
              color={
                selectedCategory
                  ? Colors.default.primaryColor
                  : isDarkMode
                  ? Colors.default.black
                  : Colors.light.white
              }
              font={fontNames.ROBOTO_FONT_FAMILY_MEDIUM}
              onPress={() => setSelectedCategory('')}
            />
          </View>
          <FlatList
            data={filteredFlows}
            keyExtractor={(item, index) => index.toString()}
            renderItem={renderFlowItem}
            contentContainerStyle={styles.flatListContainer}
            ListEmptyComponent={() => (
              <TextComponent
                text={'No flows found for the selected category.'}
                color={isDarkMode ? Colors.dark.black : Colors.light.white}
                textAlign={'center'}
                style={{marginTop: spacing.MARGIN_20}}
              />
            )}
          />
        </View>
      )}

      <CustomBottomSheet ref={bottomSheetRef} snapPoints={['30%']}>
        <View style={{marginHorizontal: spacing.MARGIN_12}}>
          <CustomButton
            title={'Completed'}
            onPress={() => {
              navigate(NavigationString.FormResponseCompleteScreen, {
                Flow_name: formName,
              });
              bottomSheetRef.current?.dismiss();
            }}
          />
          <CustomButton
            title={'Incompleted'}
            onPress={() => {
              navigate(NavigationString.FormResponseInCompleteScreen, {
                Flow_name: formName,
              });
              bottomSheetRef.current?.dismiss();
            }}
            buttonStyle={{marginVertical: spacing.MARGIN_12}}
          />
        </View>
      </CustomBottomSheet>

      <CustomBottomSheetFlatList
        ref={filterFormCategoryBottomSheet}
        snapPoints={['50%']}
        data={data?.message?.unique_categories}
        renderItem={renderFilterFormCategoryItem}
        keyExtractor={item => item.toString()}
        ListHeaderComponent={filterFormCategoryListHeaderComponent}
        ListEmptyComponent={filterFormCategoryListEmptyComponent}
        contentContainerStyle={styles.flatListContainer}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  flatListContainer: {
    paddingBottom: spacing.PADDING_20,
  },
  card: {
    padding: spacing.PADDING_14,
  },
  divider: {
    height: 0.5,
    backgroundColor: colors.grey300,
  },
  filterOption: {
    paddingVertical: spacing.PADDING_6,
    paddingHorizontal: spacing.PADDING_16,
    backgroundColor: colors.green200,
    marginVertical: spacing.MARGIN_4,
    marginHorizontal: spacing.MARGIN_16,
    borderRadius: spacing.RADIUS_8,
  },
  selectedFilterOption: {
    backgroundColor: colors.green,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.PADDING_16,
    position: 'relative',
  },
});

export default FormListComponent;
