import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import i18n from '../i18n';
import { Colors } from '../utils/constants';

const SignHeaderWithLogo = ({ isSignIn }) => {
  return (
    <View style={styles.container}>
      <Text style={[styles.title]}>{i18n.t(isSignIn ? 'sign-in' : 'sign-up')}</Text>
      <Image style={styles.logo} source={require('../../assets/small-logo.png')} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%',
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    color: Colors.WHITE_COLOR,
    fontWeight: 'bold',
    marginVertical: 10,
    textShadowColor: 'black',
    textShadowOffset: { width: -2, height: 2 },
    textShadowRadius: 5,
  },
  logo: {
    width: 50,
    height: 50,
  },
});

export default SignHeaderWithLogo;
