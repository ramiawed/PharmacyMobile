import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../utils/constants';
import i18n from '../i18n/index';

const ApproveScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <LinearGradient
        // Background Linear Gradient
        colors={[Colors.MAIN_COLOR, Colors.WHITE_COLOR]}
        style={styles.background}
      />
      <View style={styles.approveView}>
        <Image style={styles.logo} source={require('../../assets/logo.png')} />
        <View style={styles.textView}>
          <Text style={styles.header}>{i18n.t('believed-partner')}</Text>
          <Text style={styles.text}>{i18n.t('thank-message')}</Text>
          <Text style={styles.text}>{i18n.t('approve-message')}</Text>
          <Text style={{ ...styles.text, marginVertical: 10 }}>{i18n.t('hour-serving')}</Text>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              navigation.navigate('SignIn');
            }}
          >
            <Text style={styles.buttonText}>{i18n.t('sign-in')}</Text>
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
  },
  background: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  approveView: {
    borderRadius: 15,
    width: '80%',
    height: 300,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  textView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 150,
    height: 100,
  },
  header: {
    fontSize: 30,
    color: Colors.MAIN_COLOR,
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
