import React from 'react';
import ContainerComponent from '../../components/common/ContainerComponent';
import FormListComponent from '../../components/module/FormListComponent';

const FormScreen = () => {
  return (
    <ContainerComponent noPadding useScrollView={false}>
      <FormListComponent />
    </ContainerComponent>
  );
};

export default FormScreen;
