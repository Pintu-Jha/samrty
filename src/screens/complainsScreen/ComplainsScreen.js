import React from 'react';
import ContainerComponent from '../../components/common/ContainerComponent';
import ComplainsComponent from '../../components/module/ComplainsComponent';

const ComplainsScreen = () => {
  return (
    <ContainerComponent noPadding useScrollView={false}>
      <ComplainsComponent />
    </ContainerComponent>
  );
};

export default ComplainsScreen;
