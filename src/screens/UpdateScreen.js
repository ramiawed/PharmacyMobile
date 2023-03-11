import React from 'react';
import { View, Text, StyleSheet, Image, Linking, TouchableOpacity } from 'react-native';
import i18n from '../i18n/index';

// constants
import { Colors } from '../utils/constants';

// components
import Communication from '../components/Communication';

const UpdateScreen = () => {
  const openApp = (url) => {
    Linking.openURL(url)
      .then(() => {})
      .catch(() => {
        alert('تأكد من تنزيل البرنامج المحدد.');
      });
  };

  return (
    <View style={styles.container}>
      <Image source={require('../../assets/1.png')} style={styles.img} />
      <View style={{ alignItems: 'center' }}>
        <Text style={styles.text}>{i18n.t('update the app')}</Text>
        <TouchableOpacity
          onPress={() => {
            openApp('https://play.google.com/store/apps/details?id=com.smartpharmasy.app');
          }}
        >
          <Text style={styles.goTo}>Go to Google Play</Text>
        </TouchableOpacity>
      </View>
      <View style={{ alignItems: 'center' }}>
        <Communication />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-evenly',
    backgroundColor: Colors.WHITE_COLOR,
  },
  img: {
    width: '90%',
    height: 300,
    resizeMode: 'contain',
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.DARK_COLOR,
  },
  goTo: {
    backgroundColor: Colors.SUCCEEDED_COLOR,
    paddingVertical: 10,
    paddingHorizontal: 20,
    margin: 10,
    borderRadius: 6,
    color: Colors.WHITE_COLOR,
  },
});

export default UpdateScreen;
