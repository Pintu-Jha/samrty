import React from 'react';
import { FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { useGetBroadCastGroupQuery } from '../../api/slice/broadCastGroupSlice';
import * as SvgIcon from '../../assets/index';
import NavigationString from '../../navigations/navigationString';
import { Divider } from '../../styles/commonStyle';
import { textScale } from '../../styles/responsiveStyles';
import { spacing } from '../../styles/spacing';
import Colors from '../../theme/colors';
import colors from '../../utils/colors';
import THEME_COLOR from '../../utils/constant';
import { navigate, openDrawer } from '../../utils/helperFunctions';
import CommonHeader from '../common/CommoneHeader';
import LoadingScreen from '../common/Loader';
import TextComponent from '../common/TextComponent';
import { useTheme } from '../hooks';

const BroadCastMessageListComponent = () => {
  const {theme} = useTheme();
  const isDarkMode = theme === THEME_COLOR;
  const {data, isLoading, refetch} = useGetBroadCastGroupQuery();

  const renderMessageItem = ({item}) => {
    return (
      <>
        <TouchableOpacity
          style={[styles.messageCard]}
          onPress={() =>
            navigate(NavigationString.BroadCastGroupMessageListColumScreen, {
              groupName: item?.name,
            })
          }>
          <TextComponent
            text={item.group_name}
            color={isDarkMode ? Colors.dark.black : Colors.light.white}
            style={{marginBottom: spacing.MARGIN_4}}
            size={textScale(18)}
          />
        </TouchableOpacity>
        <Divider />
      </>
    );
  };
  return (
    <>
      <CommonHeader
        title={'Broadcast Message'}
        showLeftIcon={true}
        leftIcon={SvgIcon.MenuIcon}
        onLeftIconPress={openDrawer}
        showRightIcons={true}
        rightIcons={[SvgIcon.ReloadIcon]}
        onRightIconPress={() => refetch()}
      />

      {isLoading ? (
        <LoadingScreen />
      ) : (
        <FlatList
          data={data?.data}
          keyExtractor={item => item?.name?.toString()}
          renderItem={renderMessageItem}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <TextComponent
              text={data?.message || 'No data found'}
              color={isDarkMode ? Colors.light.white : Colors.dark.black}
              textAlign={'center'}
              style={{marginTop: spacing.MARGIN_20}}
            />
          }
        />
      )}
    </>
  );
};

export default BroadCastMessageListComponent;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  errorText: {
    color: colors.red600,
    fontSize: textScale(16),
    textAlign: 'center',
    marginTop: spacing.MARGIN_10,
  },
  listContent: {
    paddingBottom: spacing.PADDING_20,
  },
  messageCard: {
    padding: spacing.PADDING_12,
  },
  messageTitle: {
    fontSize: textScale(18),
    marginBottom: spacing.MARGIN_4,
    color: '#040303',
  },
  emptyContainer: {
    textAlign: 'center',
    marginTop: spacing.MARGIN_20,
  },
});
