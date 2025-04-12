import React from 'react';
import {StyleSheet, View} from 'react-native';
import * as SvgIcon from '../../assets';
import CommoneHeader from '../../components/common/CommoneHeader';
import TextComponent from '../../components/common/TextComponent';
import {openDrawer} from '../../utils/helperFunctions';

const UserDetailScreen = () => {
  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <CommoneHeader
        title={'User Details'}
        isLeftHeaderIconTrue={true}
        headerLeftIconSource={SvgIcon.MenuIcon}
        onPressLeftIcon={() => openDrawer()}
      />
      <TextComponent text={'UserDetailScreen'} />
    </View>
  );
};

export default UserDetailScreen;

const styles = StyleSheet.create({});
