import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import THEME_COLOR from '../../utils/constant';
import { goBack, truncateText } from '../../utils/helperFunctions';
import { useLazyGetAllCompleteFromQuery } from '../../api/slice/formSlice';
import * as SvgIcon from '../../assets';
import { Divider } from '../../styles/commonStyle';
import { textScale } from '../../styles/responsiveStyles';
import { spacing } from '../../styles/spacing';
import { fontNames } from '../../styles/typography';
import Colors from '../../theme/colors';
import AnimatedComponentToggle from '../common/AnimatedComponentToggale';
import CommoneHeader from '../common/CommoneHeader';
import ContainerComponent from '../common/ContainerComponent';
import CustomBottomSheet from '../common/CustomBottomSheet';
import LoadingScreen from '../common/Loader';
import TextComponent from '../common/TextComponent';
import { useTheme } from '../hooks';

// Safe date formatting function that won't crash on invalid dates
const safeFormatDateTime = (dateString) => {
  if (!dateString) return 'N/A';
  
  try {
    // For timestamp strings like "2025-01-30 17:14:37.086292"
    const parts = dateString.split(' ');
    if (parts.length === 2) {
      const datePart = parts[0]; // "2025-01-30"
      const timePart = parts[1].split('.')[0]; // "17:14:37"
      return `${datePart} at ${timePart}`;
    }
    return dateString; // Return as is if not in expected format
  } catch (error) {
    console.log('Date formatting error:', error);
    return dateString || 'N/A';
  }
};

const FormResponseCompleteScreen = ({ route }) => {
  const { Flow_name } = route?.params;
  const { theme } = useTheme();
  const isDarkMode = theme === THEME_COLOR;
  const filterBottomSheetRef = React.useRef(null);

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchCompleteFormData] = useLazyGetAllCompleteFromQuery();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetchCompleteFormData({ flow_name: Flow_name }).unwrap();
      if (response?.status_code === 200) {
        setData(response.data || []);
      }
    } catch (error) {
      console.log('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderResponseCard = ({ item }) => {
    // Parse the response_json if it's a string
    const responseData = typeof item.response_json === 'string' 
      ? JSON.parse(item.response_json) 
      : item.response_json;
  
    return (
      <View style={styles.container}>
        <AnimatedComponentToggle
          tabName={item?.contact || 'unknown'}
          isLeftImg={true}
          leftImage={SvgIcon.PersonIcon}
          tabNameStyle={styles.contactName}>
          
          <TextComponent
            text={`Received: ${safeFormatDateTime(item.timestamp_receipt)}`}
            color={isDarkMode ? Colors.dark.black : Colors.light.white}
            size={textScale(14)}
            style={styles.timestamp}
          />
          
          {/* Display all form data as key-value pairs */}
          {Object.entries(responseData).map(([key, value], idx) => {
            // Skip flow_id and flow_token or handle arrays
            if (key === 'flow_id' || key === 'flow_token') return null;
            
            const displayValue = Array.isArray(value) 
              ? value.join(', ') 
              : value;
              
            // Format the key for display
            const displayKey = key
              .replace(/_/g, ' ')
              .replace(/\b\w/g, l => l.toUpperCase());
              
            return (
              <View key={idx} style={styles.infoRow}>
                <TextComponent
                  text={displayKey}
                  color={isDarkMode ? Colors.dark.black : Colors.light.white}
                  style={styles.infoLabel}
                  size={textScale(14)}
                />
                <TextComponent
                  text={displayValue || 'Not provided'}
                  color={isDarkMode ? Colors.dark.black : Colors.light.white}
                  style={styles.infoValue}
                  size={textScale(14)}
                />
              </View>
            );
          })}
          
          <View style={styles.footer}>
            <TextComponent
              text={`Flow: ${item.flow_identity}`}
              color={isDarkMode ? Colors.dark.black : Colors.light.white}
              size={textScale(12)}
              style={styles.footerText}
            />
            <TextComponent
              text={`Status: ${item.status}`}
              color={isDarkMode ? Colors.dark.black : Colors.light.white}
              size={textScale(12)}
              style={[
                styles.footerText, 
                {color: item.status === "Responded" ? "#06ae0c" : "#FFA000"}
              ]}
            />
          </View>
        </AnimatedComponentToggle>
        <Divider />
      </View>
    );
  };

  const EmptyListComponent = () => (
    <View style={styles.noDataContainer}>
      <TextComponent
        text={'No records found.'}
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
        showRightIcons={true}
        rightIcons={[SvgIcon.Filter]}
        onRightIconPress={() => filterBottomSheetRef.current?.present()}
      />
      <ContainerComponent>
        {loading ? (
          <LoadingScreen />
        ) : (
          <FlatList
            data={data}
            keyExtractor={(item, index) => `${item.name || 'item'}-${index}`}
            renderItem={renderResponseCard}
            contentContainerStyle={styles.listContentContainer}
            ListEmptyComponent={EmptyListComponent}
          />
        )}
        <CustomBottomSheet
          ref={filterBottomSheetRef}
          snapPoints={['30%']}
        />
      </ContainerComponent>
    </>
  );
};

const styles = StyleSheet.create({
  listContentContainer: {
    paddingBottom: spacing.PADDING_16,
  },
  noDataContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.PADDING_16,
  },
  container: {
    marginBottom: spacing.MARGIN_16,
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
    paddingHorizontal: spacing.PADDING_16,
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
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.PADDING_16,
    paddingTop: spacing.PADDING_12,
    marginTop: spacing.MARGIN_8,
    borderTopWidth: 0.5,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
  footerText: {
    opacity: 0.6,
  }
});

export default FormResponseCompleteScreen;