import React from 'react';
import { Linking, StyleSheet, View } from 'react-native';
import * as SvgIcon from '../../assets';
import CommoneHeader from '../../components/common/CommoneHeader';
import ContainerComponent from '../../components/common/ContainerComponent';
import CustomButton from '../../components/common/CustomButton';
import TextComponent from '../../components/common/TextComponent';
import { useTheme } from '../../components/hooks';
import { textScale } from '../../styles/responsiveStyles';
import { spacing } from '../../styles/spacing';
import Colors from '../../theme/colors';
import colors from '../../utils/colors';
import THEME_COLOR from '../../utils/constant';
import { openDrawer } from '../../utils/helperFunctions';
import { Divider } from '../../styles/commonStyle';

const SupportScreen = () => {
  const {theme} = useTheme();
  const isDarkMode = theme === THEME_COLOR;

  const handleWhatsAppPress = () => {
    Linking.openURL('https://wa.me/918005834930');
  };

  const handleEmailPress = () => {
    Linking.openURL('mailto:support@accxchange.in');
  };

  return (
    <ContainerComponent noPadding useScrollView={false}>
    <CommoneHeader
      title="Support"
      showLeftIcon={true}
      leftIcon={SvgIcon.MenuIcon}
      onLeftIconPress={() => openDrawer()}
      containerStyle={styles.header}
    />

    {/* Main Content Wrapper */}
    <View style={styles.mainContainer}>
      {/* Top Container - Logo Section */}
      <View style={styles.topContainer}>
        <View style={styles.logoWrapper}>
          <SvgIcon.Logo
            height={spacing.HEIGHT_105}
            width={spacing.WIDTH_156}
          />
        </View>
      </View>

      {/* Bottom Container - Text & Button Section */}
      <View style={[styles.bottomContainer]}>
        <View
          style={[
            styles.card,
            {
              backgroundColor: isDarkMode ? colors.white : colors.grey900,
            },
          ]}>
          <View style={styles.contentContainer}>
            <TextComponent
              text="AccXchange Transactions Worldwide Pvt. Ltd."
              textAlign="center"
              style={[
                styles.companyName,
                {color: isDarkMode ? colors.black : colors.white},
              ]}
            />
            <TextComponent
              text="8-R-12, 13, Second Floor, Kiran Tower, RC Vyas Colony, Bhilwara, Rajasthan"
              size={textScale(13)}
              style={[styles.address, {color: colors.grey500}]}
              lineHeight={20}
            />

            <Divider/>

            {/* Contact Buttons */}
            <View style={styles.contactContainer}>
              <CustomButton
                title={'support@accxchange.in'}
                onPress={handleEmailPress}
                gradientColors={['#EFF6FF', '#DCEFFE']}
                iconLeft={<SvgIcon.EmailIcon />}
                textColor={Colors.default.black}
                textStyle={{ textTransform:'none'}}
              />

              <CustomButton
                title={'+91 80058 34930'}
                onPress={handleWhatsAppPress}
                gradientColors={['#ECFDF5', '#D1FAE5']}
                iconLeft={<SvgIcon.WhatsAppIcon />}
                textColor={Colors.default.black}
              />
            </View>
          </View>
        </View>
      </View>
    </View>
  </ContainerComponent>
  );
};

export default SupportScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },

  header: {
    borderBottomWidth: 1,
    borderBottomColor: '#E5E9F2',
    backgroundColor: '#FFFFFF',
  },

  mainContainer: {
    flex: 1,
  },

  topContainer: {
    justifyContent: 'center',
    paddingVertical: spacing.PADDING_40,
    paddingHorizontal: spacing.PADDING_20,
  },

  bottomContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: spacing.PADDING_20,
    paddingBottom: spacing.PADDING_40,
  },

  logoWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  card: {
    borderRadius: spacing.RADIUS_12,
    padding: spacing.PADDING_24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },

  contentContainer: {
    alignItems: 'center',
  },

  companyName: {
    fontSize: textScale(22),
    fontWeight: '700',
    color: Colors.default.black,
    textAlign: 'center',
    marginBottom: spacing.MARGIN_16,
    letterSpacing: 0.5,
  },

  address: {
    textAlign: 'center',
    marginBottom: spacing.MARGIN_24,
    paddingHorizontal: spacing.PADDING_10,
  },

  divider: {
    height: 1,
    backgroundColor: '#E5E9F2',
    width: '100%',
    marginBottom: spacing.MARGIN_24,
  },

  contactContainer: {
    width: '100%',
    gap: 16,
  },

  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.PADDING_16,
    borderRadius: spacing.RADIUS_12,
    backgroundColor: '#F8FAFC',
    width: '100%',
  },

  emailButton: {
    backgroundColor: '#EFF6FF',
  },

  whatsappButton: {
    backgroundColor: '#ECFDF5',
  },

  contactText: {
    fontSize: textScale(16),
    fontWeight: '600',
    color: Colors.default.black,
    marginLeft: spacing.MARGIN_10,
  },
});
