import React from 'react';
import ContainerComponent from '../../components/common/ContainerComponent';
import DateRemindersComponent from '../../components/module/DateRemindersComponent';

const DateReminder = () => {
  return (
    <ContainerComponent noPadding useScrollView={false}>
      <DateRemindersComponent />
    </ContainerComponent>
  );
};

export default DateReminder;
