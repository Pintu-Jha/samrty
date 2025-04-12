import React from 'react';
import { StyleSheet, View } from 'react-native';
import { BaseToast } from 'react-native-toast-message';
import TextComponent from '../components/common/TextComponent';
import { textScale } from '../styles/responsiveStyles';
import { spacing } from '../styles/spacing';

export const toastConfig = {
  success: ({text1, text2, props}) => (
    <BaseToast
      {...props}
      style={styles.successToastContainer}
      contentContainerStyle={styles.contentContainer}
      text1Style={styles.successText1Style}
      text2Style={styles.text2Style}
      text1={text1}
      text2={text2}
      renderTrailingIcon={() => (
        <View style={styles.trailingIcon}>
          <TextComponent
            text={'✅'}
            size={textScale(17)}
          />
        </View>
      )}
    />
  ),
  warning: ({text1, text2, props}) => (
    <BaseToast
      {...props}
      style={styles.warningToastContainer}
      contentContainerStyle={styles.contentContainer}
      text1Style={styles.warningText1Style}
      text2Style={styles.text2Style}
      text1={text1}
      text2={text2}
      renderTrailingIcon={() => (
        <View style={styles.trailingIcon}>
           <TextComponent
            text={'⚠️'}
            size={textScale(17)}
          />
        </View>
      )}
    />
  ),
  error: ({text1, text2, props}) => (
    <BaseToast
      {...props}
      style={styles.errorToastContainer}
      contentContainerStyle={styles.contentContainer}
      text1Style={styles.errorText1Style}
      text2Style={styles.text2Style}
      text1={text1}
      text2={text2}
      renderTrailingIcon={() => (
        <View style={styles.trailingIcon}>
           <TextComponent
            text={'❌'}
            size={textScale(17)}
          />
        </View>
      )}
    />
  ),
};

const styles = StyleSheet.create({
  // Common Styles for all toasts
  contentContainer: {
    paddingHorizontal: spacing.PADDING_20,
    alignItems: 'flex-start',
    zIndex:1000
  },
  text2Style: {
    fontSize: textScale(12),
    fontWeight: '400',
    color: '#4A4A4A',
    marginTop: spacing.MARGIN_2,
  },
  trailingIcon: {
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: spacing.MARGIN_8,
  },
  iconText: {
    fontSize: textScale(15),
  },

  // Success Toast Styling
  successToastContainer: {
    borderBottomColor: '#4CAF50',
    borderBottomWidth: spacing.RADIUS_4,
    borderLeftWidth: 0,
    backgroundColor: '#DFF2E1', 
    paddingVertical: spacing.PADDING_10,
    paddingHorizontal: spacing.PADDING_14,
    borderRadius: spacing.RADIUS_10,
    elevation: 10, 
    shadowColor: '#000', 
    shadowOpacity: 0.2,
    shadowOffset: {width: 0, height: 5},
    shadowRadius: 5,
    zIndex: 1000, 
  },
  successText1Style: {
    fontSize: textScale(15),
    fontWeight: '700',
    color: '#2E7D32', 
    marginBottom: spacing.MARGIN_2,
  },

  // Warning Toast Styling
  warningToastContainer: {
    borderBottomColor: '#FFA726', 
    borderBottomWidth: spacing.RADIUS_4,
    borderLeftWidth: 0,
    backgroundColor: '#FFF3E0', 
    paddingVertical: spacing.PADDING_10,
    paddingHorizontal: spacing.PADDING_14,
    borderRadius: spacing.RADIUS_10,
    elevation: 10, 
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: {width: 0, height: 5},
    shadowRadius: 5,
    zIndex: 1000, 
  },
  warningText1Style: {
    fontSize: textScale(15),
    fontWeight: '700',
    color: '#E65100', 
    marginBottom: spacing.MARGIN_2,
  },

  // Error Toast Styling
  errorToastContainer: {
    borderBottomColor: '#F44336', 
    borderBottomWidth: spacing.RADIUS_4,
    borderLeftWidth: 0,
    backgroundColor: '#FFEBEE', 
    paddingVertical: spacing.PADDING_10,
    paddingHorizontal: spacing.PADDING_14,
    borderRadius: spacing.RADIUS_10,
    elevation: 10, 
    shadowColor: '#000', 
    shadowOpacity: 0.2,
    shadowOffset: {width: 0, height: 5},
    shadowRadius: 5,
    zIndex: 1000, 
  },
  errorText1Style: {
    fontSize: textScale(15),
    fontWeight: '700',
    color: '#B71C1C', 
    marginBottom: spacing.MARGIN_2,
  },
});
