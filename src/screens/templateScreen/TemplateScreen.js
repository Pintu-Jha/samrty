import React from 'react';
import ContainerComponent from '../../components/common/ContainerComponent';
import TemplateListComponent from '../../components/module/TemplateListComponent';

const TemplateScreen = () => {
  return (
    <ContainerComponent noPadding useScrollView={false}>
      <TemplateListComponent />
    </ContainerComponent>
  );
};

export default TemplateScreen;


