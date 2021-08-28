import React from 'react';
import { View, Text, TextInput } from 'react-native';
import i18n from '../i18n/index';

const HomeScreen = () => {
  return (
    <View>
      <Text style={{ writingDirection: 'rtl' }}>{i18n.t('home')}</Text>
      <TextInput style={{ writingDirection: 'rtl' }} />
    </View>
  );
};

export default HomeScreen;
