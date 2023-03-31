import React from 'react';
import i18n from '../i18n';

import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

// constants
import { Colors } from '../utils/constants';

const NavigateBetweenSign = ({ isSignIn, pressHandler }) => {
  return (
    <TouchableOpacity style={styles.container} onPress={pressHandler}>
      <View>
        <Text style={styles.label}>{i18n.t(isSignIn ? 'sign up sentence' : 'sign in sentence')}</Text>
        <Text style={styles.btn}>{i18n.t(isSignIn ? 'sign up' : 'sign in')}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.MAIN_COLOR,
    width: '100%',
    borderRadius: 12,
    flexDirection: 'column',
    alignItems: 'center',
    paddingVertical: 10,
  },
  label: {
    color: Colors.WHITE_COLOR,
    textAlign: 'center',
  },
  btn: {
    color: Colors.FAILED_COLOR,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default NavigateBetweenSign;
