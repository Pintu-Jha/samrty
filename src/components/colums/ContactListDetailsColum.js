import React from 'react';
import {View} from 'react-native';
import AnimatedComponentToggle from '../common/AnimatedComponentToggale';
import TextComponent from '../common/TextComponent';

const ContactListDetailsColum = ({item}) => {
  return (
    <AnimatedComponentToggle tabName={item.key}>
      {item.data.map((detail, index) => (
        <View key={index} style={styles.contentRow}>
          <TextComponent text={`${detail.label}: ${detail.value}`} />
        </View>
      ))}
    </AnimatedComponentToggle>
  );
};

export default ContactListDetailsColum;
