import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { useLazyGetAllInCompleteFromQuery } from '../../api/slice/formSlice';
import * as SvgIcon from '../../assets';
import { textScale } from '../../styles/responsiveStyles';
import { spacing } from '../../styles/spacing';
import { fontNames } from '../../styles/typography';
import Colors from '../../theme/colors';
import colors from '../../utils/colors';
import THEME_COLOR from '../../utils/constant';
import { goBack, truncateText } from '../../utils/helperFunctions';
import AnimatedComponentToggle from '../common/AnimatedComponentToggale';
import CommoneHeader from '../common/CommoneHeader';
import ContainerComponent from '../common/ContainerComponent';
import TextComponent from '../common/TextComponent';
import { useTheme } from '../hooks';
import { Divider } from '../../styles/commonStyle';
import LoadingScreen from '../common/Loader';

const FormResponseInCompletedScreen = ({ route }) => {
  const { theme } = useTheme();
  const isDarkMode = theme === THEME_COLOR;
  const { Flow_name } = route.params;
  
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchInCompleteData] = useLazyGetAllInCompleteFromQuery();

  useEffect(() => {
    fetchData();
  }, [Flow_name]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetchInCompleteData({ flow_name: Flow_name }).unwrap();
      if (response?.status_code === 200) {
        setData(response.data || []);
      }
    } catch (error) {
      console.log('Error fetching incomplete form data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Format timestamp helper
  const formatDate = (timestamp) => {
    if (!timestamp) return "Unknown";
    return new Date(timestamp).toLocaleString();
  };

  const renderIncompleteCard = ({ item }) => {
    const displayName = item.contact || item.user_wa || 'Unknown Contact';
    const statusColor = getStatusColor(item.status);
    
    return (
      <View style={styles.container}>
        <AnimatedComponentToggle
          tabName={displayName}
          isLeftImg={true}
          leftImage={SvgIcon.PersonIcon}
          tabNameStyle={styles.contactName}>
          
          <View style={styles.contentContainer}>
            <TextComponent
              text={`Sent: ${formatDate(item.timestamp_sending)}`}
              color={isDarkMode ? Colors.dark.black : Colors.light.white}
              size={textScale(14)}
              style={styles.timestamp}
            />
            
            <View style={styles.infoRow}>
              <TextComponent
                text="Phone Number"
                color={isDarkMode ? Colors.dark.black : Colors.light.white}
                style={styles.infoLabel}
                size={textScale(14)}
              />
              <TextComponent
                text={item.user_wa || "Not available"}
                color={isDarkMode ? Colors.dark.black : Colors.light.white}
                style={styles.infoValue}
                size={textScale(14)}
              />
            </View>
            
            <View style={styles.infoRow}>
              <TextComponent
                text="Flow Identity"
                color={isDarkMode ? Colors.dark.black : Colors.light.white}
                style={styles.infoLabel}
                size={textScale(14)}
              />
              <TextComponent
                text={item.flow_identity || "Not available"}
                color={isDarkMode ? Colors.dark.black : Colors.light.white}
                style={styles.infoValue}
                size={textScale(14)}
              />
            </View>
            
            <View style={styles.statusContainer}>
              <TextComponent
                text="Status"
                color={isDarkMode ? Colors.dark.black : Colors.light.white}
                style={styles.statusLabel}
                size={textScale(14)}
              />
              <View style={[styles.statusBadge, { backgroundColor: statusColor.bgColor }]}>
                <TextComponent
                  text={item.status || "Unknown"}
                  color={statusColor.textColor}
                  style={styles.statusText}
                  size={textScale(12)}
                />
              </View>
            </View>
          </View>
        </AnimatedComponentToggle>
        <Divider />
      </View>
    );
  };

  // Helper to get status colors
  const getStatusColor = (status) => {
    switch (status) {
      case 'Sent':
        return { bgColor: '#E3F2FD', textColor: '#1976D2' };
      case 'Failed':
        return { bgColor: '#FFEBEE', textColor: '#D32F2F' };
      case 'Pending':
        return { bgColor: '#FFF8E1', textColor: '#FFA000' };
      default:
        return { bgColor: '#F5F5F5', textColor: '#757575' };
    }
  };

  const EmptyListComponent = () => (
    <View style={styles.noDataContainer}>
      <TextComponent
        text={'No incomplete responses found.'}
        color={isDarkMode ? Colors.dark.black : Colors.light.white}
        size={textScale(18)}
        textAlign={'center'}
      />
    </View>
  );

  return (
    <>
      <CommoneHeader
        title={truncateText(Flow_name, 50)}
        showLeftIcon={true}
        onLeftIconPress={goBack}
      />
      <ContainerComponent>
        {loading ? (
          <LoadingScreen />
        ) : (
          <FlatList
            data={data}
            keyExtractor={(item, index) => item.message_id || index.toString()}
            renderItem={renderIncompleteCard}
            contentContainerStyle={styles.listContentContainer}
            ListEmptyComponent={EmptyListComponent}
          />
        )}
      </ContainerComponent>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.MARGIN_16,
  },
  contentContainer: {
    paddingHorizontal: spacing.PADDING_16,
    paddingBottom: spacing.PADDING_16,
  },
  contactName: {
    fontSize: textScale(16),
    fontFamily: fontNames.ROBOTO_FONT_FAMILY_MEDIUM,
  },
  timestamp: {
    opacity: 0.7,
    marginBottom: spacing.MARGIN_12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.PADDING_6,
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  infoLabel: {
    opacity: 0.7,
    flex: 1,
  },
  infoValue: {
    flex: 2,
    textAlign: 'right',
    fontFamily: fontNames.ROBOTO_FONT_FAMILY_MEDIUM,
  },
  statusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.MARGIN_12,
  },
  statusLabel: {
    opacity: 0.7,
  },
  statusBadge: {
    paddingHorizontal: spacing.PADDING_12,
    paddingVertical: spacing.PADDING_4,
    borderRadius: spacing.RADIUS_16,
  },
  statusText: {
    fontFamily: fontNames.ROBOTO_FONT_FAMILY_MEDIUM,
  },
  listContentContainer: {
    paddingBottom: spacing.PADDING_16,
  },
  noDataContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.PADDING_16,
  },
});

export default FormResponseInCompletedScreen;