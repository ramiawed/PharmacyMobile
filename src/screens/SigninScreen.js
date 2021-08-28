import i18n from '../i18n/index';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';

// redux stuff
import { unwrapResult } from '@reduxjs/toolkit';
import { authSign, resetError, selectToken, selectUserData } from '../redux/auth/authSlice';
import { statisticsSignin } from '../redux/statistics/statisticsSlice';
import { useDispatch, useSelector } from 'react-redux';

// components
import Input from '../components/Input';

// constants
import { Colors } from '../utils/constants';

// icons
import { AntDesign } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import { getFavorites } from '../redux/favorites/favoritesSlice';

const SigninScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { error, status, token } = useSelector(selectUserData);

  const [globalError, setGlobalError] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // error object contains error message and fields that has the error
  const [preSignError, setPreSignError] = useState({});

  const signinHanlder = () => {
    if (status === 'loading') {
      return;
    }

    // check if the username and password is not empty
    if (username.length === 0 && password.length === 0) {
      setPreSignError({
        ...preSignError,
        username: 'enter-username',
        password: 'enter-password',
      });
      return;
    }

    // check if the username is not empty
    if (username.length === 0) {
      setPreSignError({
        ...preSignError,
        username: 'enter-password',
      });
      return;
    }

    // check if the password is not empty
    if (password.length === 0) {
      setPreSignError({
        ...preSignError,
        password: 'enter-password',
      });
      return;
    }

    // username and password is not empty
    // dispatch sign
    dispatch(authSign({ username, password }))
      .then(unwrapResult)
      .then((result) => {
        storeUsernamePassword();
        dispatch(statisticsSignin({ token }));
      })
      .catch((err) => {
        // setGlobalError('please-try-again');
      });
  };

  const storeUsernamePassword = async () => {
    try {
      await AsyncStorage.setItem('@username', username);
      await AsyncStorage.setItem('@password', password);
    } catch (err) {}
  };

  return (
    <View style={styles.container}>
      <View style={styles.topView}>
        <Text style={styles.appName}>فارما لينك</Text>

        <Image style={styles.logo} source={require('../../assets/applogo.png')} />
      </View>
      <View style={styles.bottomView}>
        <Input
          value={username}
          onTextChange={(text) => {
            setUsername(text);
            setPreSignError({});
            setGlobalError('');
            dispatch(resetError());
          }}
          placeholder={i18n.t('enter-username')}
          icon={<AntDesign name="user" size={24} color={Colors.SECONDARY_COLOR} />}
          border={1}
          error={preSignError?.username}
        />
        <Input
          value={password}
          onTextChange={(text) => {
            setPassword(text);
            setPreSignError({});
            setGlobalError('');
            dispatch(resetError());
          }}
          placeholder={i18n.t('enter-password')}
          password={true}
          icon={<FontAwesome name="lock" size={24} color={Colors.SECONDARY_COLOR} />}
          border={1}
          error={preSignError?.password}
        />

        {error ? <Text style={{ color: Colors.FAILED_COLOR }}>{i18n.t(error)}</Text> : null}
        {globalError.length > 0 ? <Text style={{ color: Colors.FAILED_COLOR }}>{i18n.t(globalError)}</Text> : null}

        <TouchableOpacity style={styles.button} onPress={signinHanlder}>
          {status === 'loading' ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.buttonText}>{i18n.t('signin')}</Text>
          )}
        </TouchableOpacity>

        <View style={styles.signupView}>
          <Text style={styles.signupSentences}>{i18n.t('signup-sentence')}</Text>
          <Text
            style={styles.signupBtn}
            onPress={() => {
              navigation.navigate('SignUp');
            }}
          >
            {i18n.t('signup')}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.MAIN_COLOR,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topView: {
    flex: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    width: '100%',
    padding: 20,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    minHeight: 100,
  },
  appName: {
    fontSize: 32,
    color: '#fff',
  },
  signinLabel: {
    fontSize: 16,
    color: '#fff',
    marginVertical: 10,
  },
  logo: {
    width: 300,
    height: 300,
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
  signupView: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  signupSentences: {
    color: Colors.SECONDARY_COLOR,
  },
  signupBtn: {
    color: Colors.FAILED_COLOR,
    fontWeight: 'bold',
    paddingHorizontal: 6,
    fontSize: 16,
  },
});

export default SigninScreen;
