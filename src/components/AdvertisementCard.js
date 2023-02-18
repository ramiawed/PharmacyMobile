import React, { memo } from 'react';
import { TouchableOpacity, Image, StyleSheet, TouchableWithoutFeedback, TouchableHighlight } from 'react-native';

// constants
import { SERVER_URL } from '../utils/constants';

const AdvertisementCard = ({ adv, onAdvertisementPress }) => {
  return (
    <TouchableOpacity
      style={styles.advertisement}
      onPress={() => {
        onAdvertisementPress(adv);
      }}
      activeOpacity="1"
    >
      <Image source={{ uri: `${SERVER_URL}/advertisements/${adv.source}` }} style={styles.image} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  advertisement: {
    height: 300,
    marginHorizontal: 10,
    flex: 1,
    marginTop: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    width: '95%',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
    borderRadius: 6,
  },
});

export default memo(AdvertisementCard);
