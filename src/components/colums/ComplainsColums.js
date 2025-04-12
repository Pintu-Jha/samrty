import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Dimensions,
  Linking,
  Modal,
  StyleSheet,
  View,
} from 'react-native';
import Toast from 'react-native-toast-message';
import {
  useLazyGetAllStatusQuery,
  useUpdateStatusMutation,
} from '../../api/slice/complainsSlice';
import * as SvgIcon from '../../assets';
import NavigationString from '../../navigations/navigationString';
import {textScale} from '../../styles/responsiveStyles';
import {spacing} from '../../styles/spacing';
import {fontNames} from '../../styles/typography';
import Colors from '../../theme/colors';
import colors from '../../utils/colors';
import THEME_COLOR from '../../utils/constant';
import {
  formatTimestampForComplaints,
  formatTimestampWithoutModifying,
  navigate,
} from '../../utils/helperFunctions';
import AnimatedComponentToggle from '../common/AnimatedComponentToggale';
import CustomButton from '../common/CustomButton';
import ImageViewer from '../common/ImageViewer';
import TextComponent from '../common/TextComponent';
import {useAppSelector, useTheme} from '../hooks';
import { TouchableOpacity } from 'react-native';

const {width} = Dimensions.get('window');
const isSmallScreen = width < 360;

// Keys to exclude from rendering
const excludedKeys = [
  'attachment',
  'comments',
  'description',
  'name',
  'subject',
  'custom_name',
  'ticket_type',
  'status',
  'custom_type',
  'custom_mobile',
];

// Custom order for fields
const customOrder = ['custom_mobile', 'village', 'creation'];

// Helper to format keys
const formatKey = key =>
  key.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase());

const ComplainsColumns = ({item}) => {
  const selectedDomain = useAppSelector(
    state => state.domains?.selectedDomain?.domain,
  );
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(item?.status);
  const [currentUpdatingStatus, setCurrentUpdatingStatus] = useState(null);

  const {theme} = useTheme();
  const isDarkMode = theme === THEME_COLOR;

  // Fetch statuses
  const [
    triggerGetAllStatus,
    {data: apiResponse, isFetching: isFetchingStatuses},
  ] = useLazyGetAllStatusQuery();
  const statuses = apiResponse?.data || [];

  // Update status mutation
  const [updateStatus] = useUpdateStatusMutation();

  // Fetch statuses when modal is visible
  useEffect(() => {
    if (modalVisible) {
      triggerGetAllStatus()
        .unwrap()
        .catch(err => {
          console.error('Error fetching statuses:', err);
        });
    }
  }, [modalVisible, triggerGetAllStatus]);

  const handleStatusChange = async newStatus => {
    setCurrentUpdatingStatus(newStatus);
    if (newStatus === selectedStatus) {
      setModalVisible(false);
      return;
    }
    try {
      const response = await updateStatus({
        ticket_name: item?.name,
        status: newStatus,
      }).unwrap();
      if (response?.status_code === 200) {
        setSelectedStatus(newStatus);
        Toast.show({
          text1: 'Success',
          text2: response?.message,
          type: 'success',
        });
      } else if (response?.status_code === 500) {
        Toast.show({
          text1: 'warning',
          text2: response?.message,
          type: 'warning',
        });
      }
    } catch (error) {
      console.error('Failed to update status:', error);
      Toast.show({
        text1: 'Error',
        text2: 'Failed to update status. Please try again.',
        type: 'error',
      });
    } finally {
      setCurrentUpdatingStatus(null);
      setModalVisible(false);
    }
  };

  // Sort fields based on custom order
  const sortedEntries = Object.entries(item)
    .filter(([key]) => !excludedKeys.includes(key))
    .sort(([keyA], [keyB]) => {
      const indexA = customOrder.indexOf(keyA);
      const indexB = customOrder.indexOf(keyB);
      return (
        (indexA === -1 ? customOrder.length : indexA) -
        (indexB === -1 ? customOrder.length : indexB)
      );
    });

  const statusColors = {
    Open: [
      'hsla(0, 100%, 50%, 1)',
      'hsla(0, 100%, 50%, 1)',
      'hsla(0, 100%, 50%, 1)',
    ],
    Closed: [
      'hsla(0, 0%, 75%, 1)',
      'hsla(0, 0%, 75%, 1)',
      'hsla(0, 0%, 75%, 1)',
    ],
    Replied: [
      'hsla(240, 100%, 50%, 1)',
      'hsla(240, 100%, 50%, 1)',
      'hsla(240, 100%, 50%, 1)',
    ],
    Resolved: [
      'hsla(120, 100%, 25%, 1)',
      'hsla(120, 100%, 25%, 1)',
      'hsla(120, 100%, 25%, 1)',
    ],
  };

  return (
    <>
      <View
        style={[
          styles.card,
          {
            backgroundColor: !isDarkMode ? colors.grey900 : colors.white,
            borderColor: !isDarkMode ? colors.grey700 : colors.grey300,
          },
        ]}>
        <AnimatedComponentToggle
          tabName={`${item?.name} | ${item?.ticket_type} | ${item?.custom_village}`}
          descrption={`${item?.custom_name} | ${formatTimestampForComplaints(
            item?.creation,
          )}`}
          btnText={selectedStatus}
          extraBtnStyle={{
            borderRadius: spacing.RADIUS_8,
            // width: '50%',
            // maxWidth: '70%',
          }}
          gradientColors={statusColors[selectedStatus]}
          containerStyle={{paddingHorizontal: 0}}
          extraBtnStyleText={{color: colors.white}}
          extraBtnStyleonPress={() => setModalVisible(true)}>
          {/* Description */}
          {item.description && (
            <View
              style={[
                styles.descriptionContainer,
                {
                  backgroundColor: !isDarkMode
                    ? colors.grey700
                    : colors.grey300,
                },
              ]}>
              <TextComponent
                text={item.description}
                size={textScale(14)}
                style={{
                  color: !isDarkMode ? colors.white : colors.black,
                }}
              />
            </View>
          )}

          {/* Fields */}
          <View style={styles.detailsContainer}>
            {sortedEntries.map(([key, value]) => {
              const cleanedKey = key.replace(/^custom_/, '');
              const formattedValue =
                key.toLowerCase().includes('creation') && value
                  ? formatTimestampWithoutModifying(value)
                  : value;

              return (
                <View key={key} style={styles.detailRow}>
                  {/* Key */}
                  <View style={styles.keyContainer}>
                    <TextComponent
                      text={formatKey(cleanedKey)}
                      size={textScale(14)}
                      style={{
                        color: !isDarkMode ? colors.grey300 : colors.grey900,
                      }}
                    />
                  </View>

                  {/* Value */}
                  <View style={styles.valueContainer}>
                    <TextComponent
                      text={`: ${formattedValue || '-'}`}
                      size={textScale(14)}
                      style={{
                        color: !isDarkMode ? colors.grey300 : colors.grey900,
                      }}
                    />
                  </View>
                </View>
              );
            })}
          </View>

          {/* Attachment */}
          {item?.attachment && (
            <View style={{alignItems: 'center'}}>
              <ImageViewer
                baseUrl={selectedDomain}
                message={item?.attachment}
                thumbnailStyle={styles.imageMessage}
              />
            </View>
          )}

          {/* Actions */}
          <View style={styles.actionButtonContainer}>
            {/* Reply */}
            <CustomButton
              title={'Reply'}
              onPress={() =>
                navigate(NavigationString.ChatScreen, {
                  Mobile_No: item?.custom_mobile,
                  title: item?.custom_name,
                })
              }
              buttonStyle={{width: '30%'}}
              textStyle={styles.buttonText}
            />

            {/* Call */}
            <CustomButton
              title={item?.custom_mobile}
              onPress={() => Linking.openURL(`tel:${item?.custom_mobile}`)}
              buttonStyle={[styles.button]}
              textStyle={styles.buttonText}
              iconLeft={<SvgIcon.Call color={colors.white} />}
            />
            {/* Comments */}
            <CustomButton
              title={'Comments'}
              onPress={() =>
                navigate(NavigationString.CommonComplaitsAndFeedBack, {
                  comments: item?.comments,
                  id: item?.name,
                })
              }
              buttonStyle={{width: '30%'}}
              textStyle={styles.buttonText}
            />
          </View>
        </AnimatedComponentToggle>
      </View>
      {/* Status Modal */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.modalContainer,
              {
                backgroundColor: isDarkMode ? colors.white : colors.grey600,
              },
            ]}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginVertical: spacing.MARGIN_10,
              }}>
              <View />
              <TextComponent
                text={'Update Status'}
                color={isDarkMode ? Colors.dark.black : Colors.light.white}
                fontSize={textScale(20)}
                fontFamily={fontNames.ROBOTO_FONT_FAMILY_BOLD}
                textAlign={'center'}
                fontWeight={'bold'}
              />
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <SvgIcon.Wrong
                  color={isDarkMode ? Colors.dark.black : Colors.light.white}
                />
              </TouchableOpacity>
            </View>

            {isFetchingStatuses ? (
              <ActivityIndicator
                size="large"
                color={isDarkMode ? colors.black : colors.white}
              />
            ) : (
              statuses
                .filter(status => status !== selectedStatus)
                .map(status => (
                  <CustomButton
                    key={status}
                    title={status}
                    onPress={() => handleStatusChange(status)}
                    isLoading={currentUpdatingStatus === status}
                    buttonStyle={styles.statusOption}
                    gradientColors={statusColors[status]}
                  />
                ))
            )}
          </View>
        </View>
      </Modal>
    </>
  );
};

export default ComplainsColumns;

const styles = StyleSheet.create({
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailsContainer: {
    flex: 1,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  keyContainer: {
    flex: 0.4,
    alignItems: 'flex-start',
  },
  valueContainer: {
    flex: 0.6,
    alignItems: 'flex-start',
  },
  detailTextKey: {
    fontSize: textScale(isSmallScreen ? 14 : 16),
    fontFamily: fontNames.ROBOTO_FONT_FAMILY_BOLD,
    textAlign: 'left',
  },
  detailTextValue: {
    fontSize: textScale(isSmallScreen ? 12 : 14),
    textAlign: 'left',
  },
  actionButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginTop: spacing.MARGIN_8,
  },
  button: {
    marginHorizontal: spacing.MARGIN_4,
    flex: 1,
  },
  buttonText: {
    color: colors.white,
    fontSize: textScale(10),
  },
  backdrop: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    zIndex: 1,
  },
  card: {
    paddingHorizontal: spacing.PADDING_8,
    paddingVertical: spacing.PADDING_6,
    borderBottomWidth: 1,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: '80%',
    borderRadius: spacing.RADIUS_8,
    padding: spacing.PADDING_16,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: {width: 0, height: 5},
  },
  modalTitle: {
    fontSize: textScale(18),
    fontFamily: fontNames.ROBOTO_FONT_FAMILY_BOLD,
    marginBottom: spacing.MARGIN_16,
    textAlign: 'center',
  },
  statusOption: {
    marginBottom: spacing.MARGIN_8,
  },
  statusText: {
    fontSize: textScale(16),
    textAlign: 'center',
    color: colors.white,
  },
  noStatusText: {
    textAlign: 'center',
    fontSize: 14,
    marginTop: spacing.MARGIN_16,
  },
  closeButton: {
    marginTop: spacing.MARGIN_16,
    padding: spacing.PADDING_12,
    borderRadius: spacing.RADIUS_8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: {
    color: colors.white,
    fontSize: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.MARGIN_8,
  },
  infoKey: {
    fontSize: textScale(isSmallScreen ? 14 : 16),
    fontFamily: fontNames.ROBOTO_FONT_FAMILY_BOLD,
  },
  infoValue: {
    fontSize: textScale(isSmallScreen ? 12 : 14),
  },
  imageMessage: {
    height: spacing.HEIGHT_300,
    resizeMode: 'cover',
    borderRadius: 10,
    marginTop: spacing.MARGIN_16,
  },
  commentsToggle: {
    fontSize: textScale(isSmallScreen ? 12 : 14),
    textDecorationLine: 'underline',
    marginBottom: spacing.MARGIN_8,
  },
  descriptionContainer: {
    marginVertical: spacing.MARGIN_12,
    paddingVertical: spacing.PADDING_12,
    paddingHorizontal: spacing.PADDING_10,
    borderRadius: spacing.RADIUS_8,
  },
  descriptionText: {
    fontSize: textScale(isSmallScreen ? 12 : 14),
    fontFamily: fontNames.ROBOTO_FONT_FAMILY_REGULAR,
    lineHeight: textScale(isSmallScreen ? 16 : 18),
  },
});
