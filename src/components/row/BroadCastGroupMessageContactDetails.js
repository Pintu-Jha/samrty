import React, { useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useFetchContactsByStatusQuery } from '../../api/slice/broadCastMessageSlice';
import * as SvgIcon from '../../assets';
import { Divider } from '../../styles/commonStyle';
import { textScale } from '../../styles/responsiveStyles';
import { spacing } from '../../styles/spacing';
import { fontNames } from '../../styles/typography';
import Colors from '../../theme/colors';
import colors from '../../utils/colors';
import THEME_COLOR from '../../utils/constant';
import { getColorForParticipant, goBack } from '../../utils/helperFunctions';
import CustomHeader from '../common/CommoneHeader';
import ContainerComponent from '../common/ContainerComponent';
import LoadingScreen from '../common/Loader';
import TextComponent from '../common/TextComponent';
import { useTheme } from '../hooks';

const BroadCastGroupMessageContactDetails = ({route}) => {
  const {theme} = useTheme();
  const isDarkMode = theme === THEME_COLOR;
  const {broadcast_name, status} = route.params;
  const [selectedStatus, setSelectedStatus] = useState(status);

  // Predefined statuses
  const predefinedStatuses = ['read', 'failed', 'delivered', 'Success', 'sent'];

  // Fetch contacts based on the selected status
  const {data, isLoading, isError, refetch} = useFetchContactsByStatusQuery({
    broadcast_name,
    status: selectedStatus,
  });

  if (isError) {
    return (
      <View
        style={[
          styles.center,
          {backgroundColor: isDarkMode ? '#f1f1f1' : '#333'},
        ]}>
        <Text style={styles.errorText}>
          Failed to load contacts. Please try again.
        </Text>
      </View>
    );
  }

  const contacts = data?.data || [];
  const renderAvatar = (item, index) => {
    const {backgroundColor, textColor} = getColorForParticipant(
      index.toString(),
    );
    const firstLetter = item.contact ? item.contact.charAt(0) : '?';
    return (
      <View
        style={[styles.avatarPlaceholder, {backgroundColor: backgroundColor}]}>
        <TextComponent
          text={firstLetter}
          color={textColor}
          size={textScale(15)}
        />
      </View>
    );
  };
  const renderContactItem = ({item, index}) => {
    return (
      <>
        <TouchableOpacity style={[styles.contactItem]} activeOpacity={0.7}>
          {renderAvatar(item, index)}
          <View style={[styles.contactInfo]}>
            <TextComponent
              text={item?.contact}
              color={isDarkMode ? Colors.dark.black : Colors.light.white}
              size={textScale(15)}
              font={fontNames.ROBOTO_FONT_FAMILY_MEDIUM}
            />
            {item?.to && (
              <TextComponent
                text={item?.to}
                color={isDarkMode ? Colors.dark.black : Colors.light.white}
                font={fontNames.ROBOTO_FONT_FAMILY_LIGHT}
                size={textScale(12)}
              />
            )}
          </View>
        </TouchableOpacity>
        <Divider />
      </>
    );
  };

  const listEmptyComponent = () => (
    <TextComponent
      text={'No contacts available'}
      size={textScale(16)}
      textAlign={'center'}
      color={isDarkMode ? Colors.dark.black : Colors.light.white}
    />
  );

  return (
    <ContainerComponent noPadding useScrollView={false}>
      <CustomHeader
        title={'Broadcast Details'}
        showLeftIcon={true}
        leftIcon={SvgIcon.BackIcon}
        onLeftIconPress={goBack}
        showRightIcons={true}
        rightIcons={[SvgIcon.ReloadIcon]}
        onRightIconPress={() => refetch()}
      />

      {/* Status Filter */}
      <View style={[styles.filterContainer]}>
        {predefinedStatuses.map(statusItem => (
          <TouchableOpacity
            key={statusItem}
            style={[
              styles.filterButton,
              selectedStatus.toLowerCase() === statusItem.toLowerCase() &&
                styles.activeFilterButton,
            ]}
            onPress={() => setSelectedStatus(statusItem)}>
            <TextComponent
              text={statusItem.charAt(0).toUpperCase() + statusItem.slice(1)}
              color={
                selectedStatus.toLowerCase() === statusItem.toLowerCase()
                  ? Colors.default.white
                  : Colors.default.black
              }
            />
          </TouchableOpacity>
        ))}
      </View>

      <View style={[styles.container]}>
        {isLoading ? (
          <LoadingScreen />
        ) : (
          <FlatList
            data={contacts}
            keyExtractor={(item, index) => `${item.to}-${index}`}
            renderItem={renderContactItem}
            ListEmptyComponent={listEmptyComponent}
          />
        )}
      </View>
    </ContainerComponent>
  );
};

export default BroadCastGroupMessageContactDetails;

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
  },
  errorText: {
    color: colors.red800,
    fontSize: textScale(16),
    textAlign: 'center',
    fontFamily: fontNames.ROBOTO_FONT_FAMILY_BOLD,
  },
  container: {
    flex: 1,
    paddingVertical: spacing.PADDING_10,
  },

  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: spacing.PADDING_8,
  },
  filterButton: {
    paddingVertical: spacing.PADDING_6,
    paddingHorizontal: spacing.PADDING_12,
    backgroundColor: colors.white,
    borderRadius: spacing.RADIUS_8,
  },
  activeFilterButton: {
    backgroundColor: colors.blue800,
  },

  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.PADDING_6,
    paddingHorizontal: spacing.PADDING_16,
  },
  contactInfo: {
    flex: 1,
  },
  avatarPlaceholder: {
    width: spacing.HEIGHT_40,
    height: spacing.HEIGHT_40,
    borderRadius: spacing.HEIGHT_40 / 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.MARGIN_10,
  },
});
