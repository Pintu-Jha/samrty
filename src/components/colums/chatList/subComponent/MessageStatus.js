import React from 'react';
import { View, StyleSheet } from 'react-native';
import { MESSAGE_STATUS } from '../../../../utils/helperFunctions';

const MessageStatus = ({ status, isDarkMode }) => {
  const statusConfig = MESSAGE_STATUS[status?.toLowerCase()];
  
  if (!statusConfig) return null;
  
  const StatusIcon = statusConfig.component;
  
  return (
    <View style={styles.container}>
      <StatusIcon 
        width={16} 
        height={16} 
        color={statusConfig.color}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginLeft: 4,
    alignItems: 'center',
    justifyContent: 'center',
  }
});

export default MessageStatus;