import React from 'react';
import ContainerComponent from '../../components/common/ContainerComponent';
import GetAllMessageComponent from '../../components/module/GetAllMessageComponent';

const MessageScreen = () => {
  return (
    <ContainerComponent noPadding useScrollView={false}>
      <GetAllMessageComponent />
    </ContainerComponent>
  );
};

export default MessageScreen;
