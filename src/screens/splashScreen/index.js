import React from 'react';
import {Image, StyleSheet, View} from 'react-native';
import {Images} from '../../utils/ImagePath';

const SplashScreen = () => {
  return (
    <View style={styles.container}>
      {/* <SvgIcon.Logo height={spacing.HEIGHT_105} width={spacing.WIDTH_156} /> */}
      <Image source={Images.IM_LOGO} style={{width: '100%', height: '100%'}} />
    </View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
