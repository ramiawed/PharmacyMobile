import React from 'react';
import i18n from '../i18n';

import { Image, View, Text, StyleSheet } from 'react-native';

// constants
import { Colors, SERVER_URL } from '../utils/constants';

const ItemImage = ({ item }) => {
  return (
    <>
      <View style={{ backgroundColor: Colors.WHITE_COLOR, borderRadius: 6, overflow: 'hidden', alignItems: 'center' }}>
        {item.logo_url && item.logo_url.length !== 0 ? (
          <Image
            source={{ uri: `${SERVER_URL}items/${item.logo_url}` }}
            style={{ width: 150, height: 150, resizeMode: 'contain' }}
          />
        ) : (
          <Image source={require('../../assets/logo.png')} style={{ width: 150, height: 150, resizeMode: 'contain' }} />
        )}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  name: {
    color: Colors.WHITE_COLOR,
    fontSize: 24,
    fontWeight: '700',
  },
  type: {
    color: Colors.FAILED_COLOR,
    fontWeight: '400',
    fontSize: 16,
  },
});

export default ItemImage;
