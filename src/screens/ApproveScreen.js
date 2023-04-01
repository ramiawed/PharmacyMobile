import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Colors } from '../utils/constants';
import i18n from '../i18n/index';

const ApproveScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <View style={styles.approveView}>
        <Image style={styles.logo} source={require('../../assets/small-logo.png')} />
        <View style={styles.textView}>
          <Text style={styles.header}>{i18n.t('believed partner')}</Text>
          <Text style={styles.text}>{i18n.t('thank message')}</Text>
          <Text style={styles.text}>{i18n.t('approve message')}</Text>
          <Text style={{ ...styles.text, marginVertical: 10 }}>{i18n.t('hour serving')}</Text>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              navigation.navigate('SignIn');
            }}
          >
            <Text style={styles.buttonText}>{i18n.t('sign in')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#6872A6',
  },
  approveView: {
    borderRadius: 15,
    width: '80%',
    height: '60%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.MAIN_COLOR,
    paddingHorizontal: 5,
  },
  textView: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 50,
    height: 50,
  },
  header: {
    fontSize: 24,
    color: Colors.WHITE_COLOR,
    fontWeight: 'bold',
    marginVertical: 20,
  },
  text: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.WHITE_COLOR,
    textAlign: 'center',
  },
  button: {
    backgroundColor: Colors.FAILED_COLOR,
    width: 100,
    padding: 10,
    borderRadius: 6,
    marginVertical: 10,
  },
  buttonText: {
    textAlign: 'center',
    color: '#fff',
  },
});

export default ApproveScreen;
