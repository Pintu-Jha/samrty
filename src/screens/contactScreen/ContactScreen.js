import React from 'react';
import ContainerComponent from '../../components/common/ContainerComponent';
import ContactListComponent from '../../components/module/ContactListComponent';

const ContactScreen = () => {
  return (
    <ContainerComponent noPadding useScrollView={false}>
      <ContactListComponent />
    </ContainerComponent>
  );
};

export default ContactScreen;


