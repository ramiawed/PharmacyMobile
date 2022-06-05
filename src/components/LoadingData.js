import React from 'react';
import { View, ActivityIndicator, Text } from 'react-native';
import i18n from '../i18n';
import { Colors } from '../utils/constants';

const LoadingData = () => {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <ActivityIndicator size="large" color={Colors.MAIN_COLOR} />
      <Text
        style={{
          fontSize: 18,
          fontWeight: '700',
          color: Colors.MAIN_COLOR,
          marginTop: 20,
        }}
      >
        {i18n.t('loading-data')}
      </Text>
    </View>
  );
};

export default LoadingData;
