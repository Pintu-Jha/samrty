import { StyleSheet } from 'react-native';
import { boxShadow } from '../../../styles/mixins';
import { textScale } from '../../../styles/responsiveStyles';
import { spacing } from '../../../styles/spacing';
import { fontNames } from '../../../styles/typography';
import colors from '../../../utils/colors';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  noDataText: {
    marginTop: spacing.MARGIN_20,
    textAlign: 'center',
    fontSize: textScale(16),
    color: '#666666',
    fontFamily: fontNames.POPPINS_FONT_FAMILY_REGULAR,
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
  modalHeader: {
    fontSize: textScale(16),
    alignSelf: 'center',
    marginVertical: spacing.MARGIN_4,
    fontFamily: fontNames.ROBOTO_FONT_FAMILY_MEDIUM,
  },
  modalStyle: {
    zIndex: -1,
  },
  groupInput: {
    width: '95%',
    alignSelf: 'center',
  },
  inputContainer: {
    marginBottom: spacing.MARGIN_10,
  },
  selectContactButton: {
    marginHorizontal: spacing.MARGIN_10,
    paddingVertical: spacing.PADDING_12,
    backgroundColor: colors.green700,
    marginBottom: spacing.MARGIN_4,
  },
  selectContactButtonText: {
    fontSize: textScale(16),
    color: colors.white,
    fontFamily: fontNames.ROBOTO_FONT_FAMILY_BOLD,
  },
  CreateGroupctButton: {
    marginHorizontal: spacing.MARGIN_10,
    paddingVertical: spacing.PADDING_12,
    backgroundColor: colors.green700,
  },
  CreateGroupButtonText: {
    fontSize: textScale(16),
    color: colors.white,
    fontFamily: fontNames.ROBOTO_FONT_FAMILY_BOLD,
  },
  selectDynamicFiltersButton: {
    marginHorizontal: spacing.MARGIN_10,
    paddingVertical: spacing.PADDING_12,
    backgroundColor: colors.green700,
    marginBottom: spacing.MARGIN_4,
  },
  selectDynamicFiltersButtonText: {
    fontSize: textScale(16),
    color: colors.white,
    fontFamily: fontNames.ROBOTO_FONT_FAMILY_BOLD,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.PADDING_10,
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
  contactName: {
    fontFamily: fontNames.POPPINS_FONT_FAMILY_MEDIUM,
    fontSize: textScale(15),
  },
  contactMobile: {
    fontFamily: fontNames.POPPINS_FONT_FAMILY_REGULAR,
    fontSize: textScale(13),
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
    marginHorizontal: spacing.MARGIN_10,
  },
  searchInput: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    borderRadius: spacing.RADIUS_8,
    paddingHorizontal: spacing.PADDING_10,
    color: colors.black,
  },
  contactInfo: {
    flex: 1,
  },
  checkIcon: {
    marginLeft: 'auto',
  },
  actionButton: {
    backgroundColor: colors.green700, // Adjust color as needed
    padding: spacing.PADDING_10,
    borderRadius: 5,
    alignItems: 'center',
    margin: spacing.MARGIN_10,
  },
  groupInfoContainer: {
    marginHorizontal: spacing.MARGIN_10,
  },
});
