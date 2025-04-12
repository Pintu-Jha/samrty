import React from 'react';
import * as Screens from '../screens/index';
import Drawer from './Drawer';
import navigationString from './navigationString';

export const MainStack = Stack => {
  return (
    <>
      <Stack.Screen
        name={navigationString.DrawerBar}
        component={Drawer}
        options={{animation: 'none'}}
      />
      <Stack.Screen
        name={navigationString.ChatScreen}
        component={Screens.ChatScreen}
      />
      <Stack.Screen
        name={navigationString.FormResponseCompleteScreen}
        component={Screens.FormResponseCompleteScreen}
      />
      <Stack.Screen
        name={navigationString.FormResponseInCompleteScreen}
        component={Screens.FormResponseInCompletedScreen}
      />
      <Stack.Screen
        name={navigationString.ContactListDetailsRowScreen}
        component={Screens.ContactListDetailsRow}
      />
      <Stack.Screen
        name={navigationString.searchContact}
        component={Screens.SearchContact}
      />
      <Stack.Screen
        name={navigationString.searchMessage}
        component={Screens.SearchMessage}
      />
      <Stack.Screen
        name={navigationString.broadCastGroupDetailScreen}
        component={Screens.BroadCastGroupDetails}
      />
      <Stack.Screen
        name={navigationString.BroadCastGroupMessageListColumScreen}
        component={Screens.BroadCastGroupMessageListColum}
      />
      <Stack.Screen
        name={navigationString.BroadCastGroupMessageConatctDetailsScreen}
        component={Screens.BroadCastGroupMessageContactDetails}
      />
      <Stack.Screen
        name={navigationString.BroadCastGroupSearchContactScreen}
        component={Screens.SearchBroadCastContact}
      />
     
       <Stack.Screen
        name={navigationString.CreateReminder}
        component={Screens.CreateReminder}
      />
      <Stack.Screen
        name={navigationString.DateReminderRowScreen}
        component={Screens.DateReminderRow}
      />
       <Stack.Screen
        name={navigationString.selectConatctForCreateGroup}
        component={Screens.selectConact}
      />
      <Stack.Screen
        name={navigationString.SearchAndAddMemberForBroadCastGroup}
        component={Screens.SearchAndAddMemberForBroadCastGroup}
      />
      <Stack.Screen
        name={navigationString.CommonComplaitsAndFeedBack}
        component={Screens.CommonComplaintsAndFeedBack}
      />
    </>
  );
};
