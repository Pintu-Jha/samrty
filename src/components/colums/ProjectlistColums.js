import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Modal,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import Toast from 'react-native-toast-message';
import {
  useLazyGetProjectStatusQuery,
  useUpdateProjectStatusMutation,
} from '../../api/slice/ProjectSlice';
import * as SvgIcon from '../../assets';
import {textScale} from '../../styles/responsiveStyles';
import {spacing} from '../../styles/spacing';
import {fontNames} from '../../styles/typography';
import Colors from '../../theme/colors';
import colors from '../../utils/colors';
import THEME_COLOR from '../../utils/constant';
import {formatTimestampWithoutModifying} from '../../utils/helperFunctions';
import AnimatedComponentToggle from '../common/AnimatedComponentToggale';
import CustomButton from '../common/CustomButton';
import RegularText from '../common/RegularText';
import TextComponent from '../common/TextComponent';
import {useTheme} from '../hooks';

const ProjectlistColums = ({item, setSelectTicket}) => {
  const {theme} = useTheme();
  const isDarkMode = theme === THEME_COLOR;
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(item?.status);
  const [currentUpdatingStatus, setCurrentUpdatingStatus] = useState(null);
  const statusColors = {
    Complete: [
      'hsla(240, 100%, 50%, 1)',
      'hsla(240, 100%, 50%, 1)',
      'hsla(240, 100%, 50%, 1)',
    ],
    'Work in Progress': [
      'hsla(30, 90%, 50%, 1)',
      'hsla(30, 80%, 50%, 1)',
      'hsla(30, 70%, 50%, 1)',
    ],
    New: [
      'hsla(120, 100%, 25%, 1)',
      'hsla(120, 100%, 25%, 1)',
      'hsla(120, 100%, 25%, 1)',
    ],
  };

  const excludedKeys = [
    'project_code',
    'project_scheme',
    'project_description',
    'project_name',
    'name',
    'id',
    'status',
  ];
  const header = `${item?.village} | ${item?.panchayat}`;

  const [updateStatus] = useUpdateProjectStatusMutation();
  const [
    triggerGetAllStatus,
    {data: apiResponse, isFetching: isFetchingStatuses},
  ] = useLazyGetProjectStatusQuery();
  const statuses = apiResponse?.data || [];

  useEffect(() => {
    if (modalVisible) {
      triggerGetAllStatus()
        .unwrap()
        .catch(error => console.error('Error fetching statuses:', error));
    }
  }, [modalVisible, triggerGetAllStatus]);

  // Function to format and filter key-value pairs
  const formatProjectDetails = () => {
    return Object.entries(item)
      .filter(
        ([key, value]) =>
          !excludedKeys.includes(key) && value !== null && value !== undefined,
      )
      .map(([key, value]) => {
        // Format the key
        const formattedKey = key
          .replace(/_/g, ' ')
          .replace(/\b\w/g, char => char.toUpperCase());

        // Format the value (especially for dates)
        let formattedValue = value;
        if (key.includes('date')) {
          formattedValue = formatTimestampWithoutModifying(value);
        }

        return {key: formattedKey, value: formattedValue};
      });
  };

  // Handle status update
  const handleStatusChange = async newStatus => {
    setCurrentUpdatingStatus(newStatus);
    if (newStatus === selectedStatus) {
      setModalVisible(false);
      return;
    }

    try {
      const response = await updateStatus({
        project_name: item?.name,
        project_status: newStatus,
      }).unwrap();
      if (response?.status_code === 200) {
        setSelectedStatus(newStatus);
        Toast.show({
          text1: 'Success',
          text2: response?.message || 'Status updated successfully!',
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

  return (
    <>
      <View
        style={[
          styles.card,
          {
            backgroundColor: !isDarkMode ? colors.grey900 : colors.white,
            borderColor: !isDarkMode ? colors.grey800 : colors.grey200,
          },
        ]}>
        <AnimatedComponentToggle
          tabName={header.replace(/_/g, ' ').toUpperCase()}
          descrption={item?.project_name}
          btnText={selectedStatus}
          extraBtnStyle={{
            borderRadius: spacing.RADIUS_8,
            width: '60%',
            maxWidth: '70%',
          }}
          gradientColors={statusColors[selectedStatus]}
          containerStyle={{paddingHorizontal: 0}}
          extraBtnStyleText={{color: colors.white}}
          extraBtnStyleonPress={() => setModalVisible(true)}
          isEditEnable
          onPressEditIcon={() => setSelectTicket(item)}>
          <View style={styles.contentContainer}>
            <View style={styles.detailsContainer}>
              {formatProjectDetails().map(({key, value}, index) => (
                <View key={index} style={styles.detailRow}>
                  <View style={styles.keyContainer}>
                    <RegularText
                      style={[
                        styles.detailTextKey,
                        isDarkMode ? styles.textDark : styles.textLight,
                      ]}>
                      {key}
                    </RegularText>
                  </View>
                  <View style={styles.valueContainer}>
                    <RegularText
                      style={[
                        styles.detailTextValue,
                        isDarkMode ? styles.textDark : styles.textLight,
                      ]}>
                      : {value}
                    </RegularText>
                  </View>
                </View>
              ))}
            </View>
          </View>
        </AnimatedComponentToggle>
      </View>

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
                backgroundColor: !isDarkMode ? colors.grey800 : colors.white,
              },
            ]}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginVertical:spacing.MARGIN_10
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
              <ActivityIndicator size="large" color={colors.blue800} />
            ) : (
              statuses
                .filter(status => status && status !== selectedStatus)
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

export default ProjectlistColums;

const styles = StyleSheet.create({
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
    fontSize: textScale(16),
    fontFamily: fontNames.ROBOTO_FONT_FAMILY_BOLD,
    textAlign: 'left',
  },
  detailTextValue: {
    fontSize: textScale(14),
    textAlign: 'left',
  },
  textDark: {
    color: '#222',
  },
  textLight: {
    color: '#fff',
  },
  card: {
    paddingHorizontal: spacing.PADDING_8,
    paddingVertical: spacing.PADDING_6,
    borderWidth: 1,
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
    marginVertical: spacing.MARGIN_8,
  },
  statusText: {
    fontSize: textScale(16),
    textAlign: 'center',
  },
  closeButton: {
    padding: spacing.PADDING_12,
    borderRadius: spacing.RADIUS_8,
    alignItems: 'center',
  },
  closeButtonText: {
    color: colors.white,
    fontSize: textScale(16),
  },
});
