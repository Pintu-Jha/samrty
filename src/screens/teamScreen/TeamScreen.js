import React from 'react';
import {StyleSheet, View} from 'react-native';
import CommoneHeader from '../../components/common/CommoneHeader';
import TextComponent from '../../components/common/TextComponent';
import {openDrawer} from '../../utils/helperFunctions';
import * as SvgIcon from '../../assets';
import {textScale} from '../../styles/responsiveStyles';

const TeamScreen = () => {
  return (
    <View style={{flex: 1}}>
      <CommoneHeader
        title={'Teams'}
        isLeftHeaderIconTrue={true}
        headerLeftIconSource={SvgIcon.MenuIcon}
        onPressLeftIcon={() => openDrawer()}
      />
      <View style={{alignItems: 'center', justifyContent: 'center', flex: 1}}>
        <TextComponent text={'TeamScreen'} />
      </View>
    </View>
  );
};

export default TeamScreen;

const styles = StyleSheet.create({
  textStyle: {
    fontSize: textScale(15),
  },
});
