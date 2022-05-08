import React, { memo } from 'react';
import { TouchableOpacity, Image, StyleSheet } from 'react-native';
import { SERVER_URL } from '../utils/constants';

const AdvertisementCard = ({ adv, onAdvertisementPress }) => {
  return (
    <TouchableOpacity
      style={styles.advertisement}
      onPress={() => {
        onAdvertisementPress(adv);
      }}
    >
      {adv.type === 'static' ? (
        <Image source={adv.source} style={styles.image} />
      ) : (
        <Image source={{ uri: `${SERVER_URL}/advertisements/${adv.source}` }} style={styles.image} />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  advertisement: {
    padding: 10,
    backgroundColor: '#f3f3f3',
    height: 300,
    width: 300,
    marginHorizontal: 10,
    marginVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
    borderRadius: 6,
  },
});

export default memo(AdvertisementCard);
