import React from 'react';
import { View, StyleSheet, Image } from 'react-native';

const SplashScreen = () => {
  return (
    <View style={styles.container}>
      <Image source={require('../../assets/sign-in-out-image.jpg')} style={styles.img} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    width: '100%',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  img: {
    width: '90%',
    height: 300,
    resizeMode: 'contain',
  },
});

export default SplashScreen;
