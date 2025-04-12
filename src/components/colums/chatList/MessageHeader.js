import React from 'react';
import  CommoneHeader  from '../../common/CommoneHeader';
import  CommonToolBar  from '../../common/CommonToolBar';
import * as SvgIcon from '../../../assets';
import  NavigationString  from '../../../navigations/navigationString';
import { navigate, goBack } from '../../../utils/helperFunctions';

export const MessageHeader = ({
  title,
  Mobile_No,
  isToolBarVisible,
  selectedMessages,
  onBackPress,
  onRightIconPressHeader,
  onRightIconPressToolBar,
  isSelectedMessageForAction
}) => {
  const handleTitlePress = () => {
    navigate(NavigationString.ContactListDetailsRowScreen, {
      contactName: title,
      mobileNo: Mobile_No,
    });
  };
  
  if (isToolBarVisible) {
    return (
      <CommonToolBar
        onBackPress={onBackPress}
        count={selectedMessages.length}
        showLeftIcons={true}
        leftIcons={[SvgIcon.BackIcon]}
        onLeftIconPress={onBackPress}
        showRightIcons={true}
        rightIcons={[SvgIcon.DeleteIcon, SvgIcon.CreateIcon]}
        onRightIconPress={onRightIconPressToolBar}
      />
    );
  }

  return (
    <CommoneHeader
      title={title}
      showLeftIcon={true}
      onLeftIconPress={goBack}
      showRightIcons={true}
      rightIcons={[SvgIcon.ReloadIcon, SvgIcon.DotMenu]}
      onRightIconPress={onRightIconPressHeader}
      showNumber
      number={Mobile_No}
      onTitlePress={handleTitlePress}
    />
  );
};