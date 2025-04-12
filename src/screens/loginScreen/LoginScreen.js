import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Toast from 'react-native-toast-message';
import { loginUser } from '../../api/slice/authSlice';
import { selectUrl, setDomain, updateDomain } from '../../api/slice/domainSlice';
import * as SvgIcon from '../../assets/index';
import ContainerComponent from '../../components/common/ContainerComponent';
import CustomButton from '../../components/common/CustomButton';
import CustomInput from '../../components/common/CustomInput';
import { useAppDispatch, useAppSelector, useTheme } from '../../components/hooks';
import NavigationString from '../../navigations/navigationString';
import { spacing } from '../../styles/spacing';
import Colors from '../../theme/colors';
import THEME_COLOR from '../../utils/constant';
import { CommonToastMessage, replace } from '../../utils/helperFunctions';

const LoginScreen = () => {
  const { theme } = useTheme();
  const dispatch = useAppDispatch();
  const domainState = useAppSelector(state => state.domains);

  const isDarkMode = theme === THEME_COLOR;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setIsLoading] = useState(false);
  const [updatedDomain, setUpdatedDomain] = useState('');
  const [selectedKey, setSelectedKey] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (domainState) {
      setUpdatedDomain(domainState.selectedDomain?.domain || '');
      setSelectedKey(domainState.selectedDomain?.key || '');
    }
  }, [domainState]);

  const isLoginEnabled = !isEditing && email.trim() !== '' && password.trim() !== '';

  const onPressLogin = async () => {
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    const data = { usr: trimmedEmail, pwd: trimmedPassword };
    
    try {
      setIsLoading(true);
      const res = await dispatch(loginUser(data)).unwrap();
      console.log(res);
      

      if (res?.message) {
        Toast.show({
          type: 'info',
          text1: 'Warning',
          text2: res.message,
        });
      }
    } catch (error) {
      console.error('Error raised:', error);
      if (error === 'Domain not set') {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'Domain not set',
        });
      } else {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'Something went wrong',
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    let domainInput = updatedDomain.trim();
  
    if (!domainInput) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Domain cannot be empty.',
      });
      return;
    }
  
    // Remove any leading protocol(s), even if malformed (e.g., missing colon)
    // This regex matches patterns like: "http://", "https://", "http//", "https//", and even repeated occurrences.
    domainInput = domainInput.replace(/^(https?:?\/{1,2})+/i, '');
  
    // Always prepend your preferred protocol.
    const domainToSave = `https://${domainInput}`;
  
    // Validate the domain format using the URL constructor.
    try {
      new URL(domainToSave);
    } catch (e) {
      CommonToastMessage("info",'Invalid domain format. Please enter a valid domain.');
      return;
    }
  
    try {
      if (selectedKey) {
        await dispatch(
          updateDomain({
            key: selectedKey,
            newDomain: domainToSave,
          })
        )
          .unwrap()
          .then(async (res) => {
            await dispatch(selectUrl(res[0]?.key)).unwrap();
          })
          .catch((error) => {
            console.error('Error updating domain:', error);
          });
      } else {
        await dispatch(setDomain(domainToSave))
          .unwrap()
          .then(async (newDomain) => {
            await dispatch(selectUrl(newDomain?.key)).unwrap();
          })
          .catch((error) => {
            console.error('Error setting domain:', error);
          });
      }
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating domain:', error);
    }
  };
  

  return (
    <ContainerComponent useScrollView={true} noPadding>
      <View style={styles.childContainer}>
        <View style={styles.logoContainer}>
          <SvgIcon.Logo height={spacing.HEIGHT_105} width={spacing.WIDTH_105} />
        </View>

        <View style={styles.loginContainer}>
          <CustomInput
            value={updatedDomain}
            onChange={value => setUpdatedDomain(value)}
            placeholder="Set Domain"
            label="Domain"
            required={true}
            inputStyles={{
              color: isDarkMode ? Colors.dark.black : Colors.light.white,
            }}
            error={
              isEditing && !updatedDomain
                ? { exists: true, message: 'Domain is required' }
                : null
            }
            showFirstChildren={true}
            FirstChildren={
              <View style={{ marginRight: 8 }}>
                <SvgIcon.DomainIcon color={Colors.default.grey} />
              </View>
            }
            onBlur={handleSave}
          />

          <CustomInput
            placeholder="Email"
            value={email}
            onChange={setEmail}
            label="Email"
            showFirstChildren={true}
            FirstChildren={
              <View style={{ marginRight: 8 }}>
                <SvgIcon.EmailIcon color={Colors.default.grey} />
              </View>
            }
            inputStyles={{
              color: isDarkMode ? Colors.dark.black : Colors.light.white,
            }}
          />

          <CustomInput
            placeholder="Password"
            value={password}
            onChange={setPassword}
            isSecure={true}
            label="Password"
            showFirstChildren={true}
            FirstChildren={
              <View style={{ marginRight: 8 }}>
                <SvgIcon.PasswordIcon color={Colors.default.grey} />
              </View>
            }
            inputStyles={{
              color: isDarkMode ? Colors.dark.black : Colors.light.white,
            }}
          />

          <CustomButton
            title="Login"
            onPress={onPressLogin}
            isLoading={loading}
            disabled={!isLoginEnabled}
          />
        </View>

        <View style={styles.bottomButtonContainer}>
          <CustomButton
            title={updatedDomain ? 'Change Domain' : 'Set Domain'}
            onPress={() => replace(NavigationString.InitialScreen)}
          />
        </View>
      </View>
    </ContainerComponent>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  childContainer: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.MARGIN_40,
    marginBottom: spacing.MARGIN_20,
  },
  loginContainer: {
    width: '100%',
    paddingHorizontal: spacing.PADDING_16,
  },
  bottomButtonContainer: {
    position: 'absolute',
    bottom: spacing.HEIGHT_16,
    left: 0,
    right: 0,
    paddingHorizontal: spacing.PADDING_16,
  },
});
