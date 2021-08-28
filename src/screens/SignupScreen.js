import i18n from '../i18n/index';
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import Input from '../components/Input';
import { Colors } from '../utils/constants';

const SignupScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <View style={styles.signinView}>
        <Text style={styles.signinSentences}>{i18n.t('signin-sentence')}</Text>
        <Text
          style={styles.signinBtn}
          onPress={() => {
            navigation.navigate('SignIn');
          }}
        >
          {i18n.t('signin')}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.MAIN_COLOR,
    padding: Platform.OS === 'ios' ? 30 : 20,
  },
  signinView: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  signinSentences: {
    color: '#fff',
  },
  signinBtn: {
    color: Colors.FAILED_COLOR,
    fontWeight: 'bold',
    paddingHorizontal: 6,
    fontSize: 16,
  },
});

export default SignupScreen;
