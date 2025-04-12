import React, { useCallback, useRef, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import {
  useAddMemberInGroupMultipleMutation,
  useFetchBroadCastGroupDetailsQuery,
} from '../../api/slice/broadCastGroupSlice';
import * as SvgIcon from '../../assets/index';
import NavigationString from '../../navigations/navigationString';
import { boxShadow, boxShadowLess } from '../../styles/mixins';
import { textScale } from '../../styles/responsiveStyles';
import { spacing } from '../../styles/spacing';
import { fontNames } from '../../styles/typography';
import Colors from '../../theme/colors';
import colors from '../../utils/colors';
import THEME_COLOR from '../../utils/constant';
import {
  CommonToastMessage,
  goBack,
  navigate,
  truncateText,
} from '../../utils/helperFunctions';
import BroadCastGroupDetailColum from '../colums/BroadCastGroupDetailColum';
import CommonHeader from '../common/CommoneHeader';
import CustomBottomSheetFlatList from '../common/CustomBottomSheetFlatList';
import CustomButton from '../common/CustomButton';
import CustomInput from '../common/CustomInput';
import LoadingScreen from '../common/Loader';
import TextComponent from '../common/TextComponent';
import { useTheme } from '../hooks';

const BroadCastGroupDetails = ({route}) => {
  const {theme} = useTheme();
  const isDarkMode = theme === THEME_COLOR;

  const contactSelectRef = useRef(null);
  const {name} = route.params;

  const [selectedContacts, setSelectedContacts] = useState([]);
  const [isAddMember, setIsAddMemeber] = useState(false);

  const {
    data: BroadCastGroupDetailsData,
    isLoading: BroadCastGroupDetailsIsLoading,
    refetch: BroadCastGroupDetailsDatRefetch,
  } = useFetchBroadCastGroupDetailsQuery({name});

  const [addMemberInGroupMultiple] = useAddMemberInGroupMultipleMutation();

  const addNewMemberHandler = async () => {
    setIsAddMemeber(true);
    try {
      const payload = {
        name: name,
        is_dynamic_group: 0,
        contacts: selectedContacts.map(contact => ({
          group_member: contact.name,
          mobile_no: contact.mobile,
        })),
      };
      const res = await addMemberInGroupMultiple(payload);
      console.log(res);
      if (res?.data?.status_code === 200) {
        BroadCastGroupDetailsDatRefetch();
        setSelectedContacts([]);
        contactSelectRef.current?.dismiss();
        CommonToastMessage('success', res?.data?.message);
        setIsAddMemeber(false);
      }
      if (res.data?.status_code === 400) {
        CommonToastMessage('success', res?.data?.message);
        setIsAddMemeber(false);
      }
    } catch (error) {
      console.log(error);
      setIsAddMemeber(false);
    } finally {
      setIsAddMemeber(false);
    }
  };
  const handleCommonHeaderIcon = index => {
    const actions = {
      0: () =>
        navigate(NavigationString.BroadCastGroupSearchContactScreen, {name}),
      1: () => BroadCastGroupDetailsDatRefetch(),
    };

    const action = actions[index];
    if (action) {
      action();
    } else {
    }
  };

  const renderContactSelectItem = useCallback(({item, index}) => {
    return (
      <>
        <TextComponent
          text={`${index + 1}. ${item?.name}`}
          color={isDarkMode ? Colors.dark.black : Colors.light.white}
          size={textScale(16)}
          font={fontNames.ROBOTO_FONT_FAMILY_MEDIUM}
          style={{
            marginVertical: spacing.MARGIN_4,
            marginLeft: spacing.MARGIN_12,
          }}
        />
        <CustomInput
          value={item?.mobile}
          editable={false}
          styles={{marginHorizontal: spacing.MARGIN_12}}
          showFirstChildren={true}
          FirstChildren={
            <SvgIcon.Artical
              color={isDarkMode ? Colors.dark.black : Colors.light.white}
            />
          }
        />
      </>
    );
  }, []);

  const handleItemSelect = item => {
    contactSelectRef.current?.present();
    setSelectedContacts(item);
  };

  return (
    <>
      <CommonHeader
        title={`${truncateText(
          BroadCastGroupDetailsData?.data[0]?.name || 'Group Details',
          25,
        )}`}
        showLeftIcon={true}
        leftIcon={SvgIcon.BackIcon}
        onLeftIconPress={() => goBack()}
        showRightIcons={true}
        rightIcons={[SvgIcon.Search, SvgIcon.ReloadIcon]}
        onRightIconPress={handleCommonHeaderIcon}
      />
      <View
        style={{
          backgroundColor: isDarkMode ? colors.white : '#151414',
          flex: 1,
        }}>
        {BroadCastGroupDetailsIsLoading ? (
          <LoadingScreen />
        ) : (
          <FlatList
            data={BroadCastGroupDetailsData?.data[0]?.contacts || []}
            renderItem={({item}) => <BroadCastGroupDetailColum item={item} />}
            keyExtractor={item => item?.name?.toString()}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <TextComponent
                  text={'No contacts available'}
                  color={isDarkMode ? Colors.dark.black : Colors.light.white}
                />
              </View>
            }
          />
        )}
      </View>

      <CustomButton
        title={`Add Member`}
        onPress={() => {
          {
            navigate(NavigationString.SearchAndAddMemberForBroadCastGroup, {
              onSelect: handleItemSelect,
            });
            setSelectedContacts([]);
          }
        }}
        iconLeft={
          <SvgIcon.AddICon
            color={colors.white}
            width={spacing.WIDTH_30}
            height={spacing.HEIGHT_30}
          />
        }
        buttonStyle={styles.createGroupButton}
      />

      <CustomBottomSheetFlatList
        ref={contactSelectRef}
        snapPoints={['90%']}
        enableDynamicSizing={false}
        data={selectedContacts}
        renderItem={renderContactSelectItem}
        contentContainerStyle={styles.flatListContainer}
        ListHeaderComponent={
          <TextComponent
            text={'Selected Contacts'}
            color={isDarkMode ? Colors.dark.black : Colors.light.white}
            size={textScale(16)}
            font={fontNames.ROBOTO_FONT_FAMILY_MEDIUM}
            textAlign={'center'}
            style={{marginVertical: spacing.MARGIN_4}}
          />
        }
        enableFooter={true}
        FooterComponent={
          <CustomButton
            title={'Add Member'}
            onPress={addNewMemberHandler}
            isLoading={isAddMember}
          />
        }
      />
    </>
  );
};

export default BroadCastGroupDetails;

const styles = StyleSheet.create({
  actionButton: {
    paddingHorizontal: spacing.PADDING_12,
    paddingVertical: spacing.PADDING_14,
    backgroundColor: colors.green600,
    position: 'absolute',
    bottom: spacing.MARGIN_16,
    right: spacing.MARGIN_16,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: spacing.RADIUS_10,
    ...boxShadow(),
  },

  createGroupButton: {
    position: 'absolute',
    bottom: spacing.MARGIN_16,
    right: spacing.MARGIN_16,
    ...boxShadow(),
  },
  createGroupText: {
    color: colors.white,
    marginLeft: spacing.MARGIN_4,
    fontFamily: fontNames.ROBOTO_FONT_FAMILY_BOLD,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.PADDING_10,
    ...boxShadowLess(),
    paddingHorizontal: spacing.PADDING_20,
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    fontFamily: fontNames.POPPINS_FONT_FAMILY_MEDIUM,
    fontSize: textScale(15),
  },
  contactMobile: {
    fontFamily: fontNames.POPPINS_FONT_FAMILY_REGULAR,
    fontSize: textScale(13),
  },
  noDataText: {
    marginTop: spacing.MARGIN_20,
    textAlign: 'center',
    fontSize: textScale(16),
    color: '#666666',
    fontFamily: fontNames.POPPINS_FONT_FAMILY_REGULAR,
  },
  flatListContainer: {
    paddingBottom: spacing.PADDING_24,
  },
  searchHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.PADDING_20,
  },
  backButton: {
    marginRight: spacing.MARGIN_10,
  },
  searchInput: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    borderRadius: spacing.RADIUS_8,
    paddingHorizontal: spacing.PADDING_10,
    color: colors.black,
  },
  avatarPlaceholder: {
    width: spacing.HEIGHT_40,
    height: spacing.HEIGHT_40,
    borderRadius: spacing.HEIGHT_40 / 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.MARGIN_10,
  },
  avatarText: {
    fontSize: textScale(15),
  },
  CreateGroupctButton: {
    marginHorizontal: spacing.MARGIN_10,
    paddingVertical: spacing.PADDING_12,
    backgroundColor: colors.green700,
    marginVertical: spacing.MARGIN_4,
  },
  CreateGroupButtonText: {
    fontSize: textScale(16),
    color: colors.white,
    fontFamily: fontNames.ROBOTO_FONT_FAMILY_BOLD,
  },
  modalHeader: {
    fontSize: textScale(16),
    alignSelf: 'center',
    marginVertical: spacing.MARGIN_4,
    fontFamily: fontNames.ROBOTO_FONT_FAMILY_MEDIUM,
  },
  groupInput: {
    width: '95%',
    alignSelf: 'center',
  },
  inputContainer: {
    marginBottom: spacing.MARGIN_10,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
