import React from 'react';
import ContainerComponent from '../../components/common/ContainerComponent';
import FeedBackComponent from '../../components/module/FeedBackComponent';

const FeedBackScreen = () => {
  return (
    <ContainerComponent noPadding useScrollView={false}>
      <FeedBackComponent />
    </ContainerComponent>
  );
};

export default FeedBackScreen;

