import React from 'react';
import ContainerComponent from '../../components/common/ContainerComponent';
import BroadCastMessageListComponent from '../../components/module/BroadCastMessageListComponent';

const BroadCastMessage = () => {
  return (
    <ContainerComponent noPadding useScrollView={false}>
      <BroadCastMessageListComponent />
    </ContainerComponent>
  );
};

export default BroadCastMessage;


