import i18n from '../i18n/index';
import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

// redux stuff
import { unwrapResult } from '@reduxjs/toolkit';
import { authSign, resetError, selectUserData } from '../redux/auth/authSlice';
import { addStatistics } from '../redux/statistics/statisticsSlice';
import { useDispatch, useSelector } from 'react-redux';
import { getFavorites } from '../redux/favorites/favoritesSlice';
import { getAllSettings } from '../redux/settings/settingsSlice';
import { getAllAdvertisements } from '../redux/advertisements/advertisementsSlice';

// components
import Input from '../components/Input';
import Loader from '../components/Loader';

// constants
import { Colors } from '../utils/constants';

// icons
import { AntDesign } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';

const SignInScreen = ({ navigation }) => {
  const dispatch = useDispatch();

  // selectors
  const { error, status } = useSelector(selectUserData);

  // own states
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
        // storeUsernamePassword();
        // dispatch(statisticsSignin({ token }));
        dispatch(
          addStatistics({
            obj: {
              targetUser: result.data.user._id,
              action: 'user-sign-in',
            },
          }),
        );
        dispatch(getAllSettings({ token: result.token }));
        dispatch(getFavorites({ token: result.token }));
        dispatch(getAllAdvertisements({ token: result.token }));
      })
      .catch((err) => {});
  };

  const goToSignUpHandler = () => {
    setPreSignError({
      username: '',
      password: '',
    });
    setGlobalError('');
    dispatch(resetError());
    navigation.navigate('SignUp');
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        // Background Linear Gradient
        colors={[Colors.WHITE_COLOR, Colors.MAIN_COLOR]}
        style={styles.background}
      />
      {status === 'loading' ? (
        <Loader />
      ) : (
        <>
          <View style={styles.signInView}>
            {/* <LinearGradient
              // Background Linear Gradient
              colors={[Colors.WHITE_COLOR, Colors.MAIN_COLOR]}
              style={styles.background}
            /> */}

            <Image style={styles.logo} source={require('../../assets/logo.png')} />
            <View style={styles.inputDiv}>
              <Text style={[styles.signInLabel, styles.bigFont]}>{i18n.t('sign-in')}</Text>

              <Input
                value={username}
                onTextChange={(text) => {
                  setUsername(text);
                  setPreSignError({
                    ...preSignError,
                    username: '',
                  });
                  setGlobalError('');
                  dispatch(resetError());
                }}
                placeholder={i18n.t('enter-username')}
                icon={<AntDesign name="user" size={24} color={Colors.MAIN_COLOR} />}
                border={1}
                error={preSignError?.username}
                label={i18n.t('user-username')}
              />
              <Input
                value={password}
                onTextChange={(text) => {
                  setPassword(text);
                  setPreSignError({
                    ...preSignError,
                    password: '',
                  });
                  setGlobalError('');
                  dispatch(resetError());
                }}
                placeholder={i18n.t('enter-password')}
                password={true}
                icon={<FontAwesome name="lock" size={24} color={Colors.MAIN_COLOR} />}
                border={1}
                error={preSignError?.password}
                label={i18n.t('user-password')}
              />

              {error ? <Text style={{ color: Colors.FAILED_COLOR }}>{i18n.t(error)}</Text> : null}
              {globalError.length > 0 ? (
                <Text style={{ color: Colors.FAILED_COLOR }}>{i18n.t(globalError)}</Text>
              ) : null}

              <TouchableOpacity style={styles.button} onPress={signinHanlder}>
                <Text style={styles.buttonText}>{i18n.t('sign-in')}</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.signupView}>
            <Text style={styles.signupSentences}>{i18n.t('sign-up-sentence')}</Text>
            <Text style={styles.signupBtn} onPress={goToSignUpHandler}>
              {i18n.t('sign-up')}
            </Text>
          </View>
        </>
      )}
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
  signInView: {
    borderRadius: 15,
    width: '80%',
    minHeight: '65%',
    alignItems: 'center',
    justifyContent: 'flex-start',
    // overflow: 'hidden',
  },
  appName: {
    fontSize: 32,
    color: '#fff',
  },
  signInLabel: {
    fontSize: 16,
    color: Colors.MAIN_COLOR,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  bigFont: {
    fontSize: 24,
    paddingBottom: 12,
  },
  inputDiv: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 150,
    height: 100,
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
    position: 'absolute',
    top: 25,
    end: 0,
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  signupSentences: {
    color: Colors.MAIN_COLOR,
  },
  signupBtn: {
    color: Colors.FAILED_COLOR,
    fontWeight: 'bold',
    paddingHorizontal: 6,
    fontSize: 16,
  },
});

export default SignInScreen;
