import React from 'react';
import { Text, View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Colors } from '../utils/constants';
import i18n from '../i18n';
import { useNavigation } from '@react-navigation/native';

const CustomFallback = () => {
  const navigation = useNavigation();

  const navigateHandler = () => {
    try {
      navigation.navigate('Home');
    } catch {}
  };

  return (
    <View style={styles.container}>
      <View style={styles.innerContainer}>
        <Image
          source={require('../../assets/small-logo.png')}
          style={{ width: 75, height: 75, resizeMode: 'contain' }}
        />
        <Text style={styles.msg}>{i18n.t('error fallback')}</Text>
        <TouchableOpacity style={styles.btn} onPress={navigateHandler}>
          <Text style={styles.btnText}>{i18n.t('home')}</Text>
        </TouchableOpacity>
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
  innerContainer: {
    borderRadius: 15,
    width: '80%',
    height: '60%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.MAIN_COLOR,
    paddingHorizontal: 5,
  },
  msg: {
    marginVertical: 50,
    color: Colors.WHITE_COLOR,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  btn: {
    backgroundColor: Colors.SUCCEEDED_COLOR,
    padding: 10,
    borderRadius: 6,
    marginVertical: 5,
  },
  btnText: {
    color: Colors.WHITE_COLOR,
  },
});

export default CustomFallback;
