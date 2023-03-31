import i18n from '../i18n/index';
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

// redux stuff
import { unwrapResult } from '@reduxjs/toolkit';
import { authSign, resetError, saveExpoPushToken, selectUserData } from '../redux/auth/authSlice';
import { addStatistics } from '../redux/statistics/statisticsSlice';
import { useDispatch, useSelector } from 'react-redux';
import { getFavorites } from '../redux/favorites/favoritesSlice';
import { getAllSettings } from '../redux/settings/settingsSlice';
import { getAllAdvertisements } from '../redux/advertisements/advertisementsSlice';
import { getSavedItems } from '../redux/savedItems/savedItemsSlice';

// components
import NavigateBetweenSign from '../components/NavigateBetweenSign';
import ForgetPasswordModal from '../components/ForgetPasswordModal';
import SignHeaderWithLogo from '../components/SignHeaderWithLogo';
import HeaderWithSlogn from '../components/HeaderWithSlogn';
import Button from '../components/Button';
import Loader from '../components/Loader';
import Input from '../components/Input';

// constants
import { Colors, VERSION } from '../utils/constants';

// icons
import { AntDesign } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import { getCompanies } from '../redux/company/companySlice';
import { getWarehouses } from '../redux/warehouse/warehousesSlice';

const SignInScreen = ({ navigation }) => {
  const dispatch = useDispatch();

  // selectors
  const { error, status } = useSelector(selectUserData);

  // own states
  const [globalError, setGlobalError] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showForgetPasswordModal, setShowForgetPasswordModal] = useState(false);

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
        username: 'enter username',
        password: 'enter password',
      });
      return;
    }

    // check if the username is not empty
    if (username.length === 0) {
      setPreSignError({
        ...preSignError,
        username: 'enter password',
      });
      return;
    }

    // check if the password is not empty
    if (password.length === 0) {
      setPreSignError({
        ...preSignError,
        password: 'enter password',
      });
      return;
    }

    // username and password is not empty
    // dispatch sign
    dispatch(authSign({ username, password, version: VERSION }))
      .then(unwrapResult)
      .then((result) => {
        dispatch(
          addStatistics({
            obj: {
              targetUser: result.data.user._id,
              action: 'user-sign-in',
            },
            token: result.token,
          }),
        );
        dispatch(getAllSettings({ token: result.token }));
        dispatch(getFavorites({ token: result.token }));
        dispatch(getAllAdvertisements({ token: result.token }));
        dispatch(getSavedItems({ token: result.token }));
        dispatch(getCompanies({ token: result.token }));
        dispatch(getWarehouses({ token: result.token }));
      })
      .catch((err) => {
        err;
      });
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
      {status === 'loading' ? (
        <Loader />
      ) : (
        <>
          <View style={styles.signInView}>
            <HeaderWithSlogn />
            <View style={styles.inputsView}>
              <SignHeaderWithLogo isSignIn={true} />
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
                placeholder={i18n.t('enter username')}
                icon={<AntDesign name="user" size={24} color={Colors.MAIN_COLOR} />}
                border={1}
                error={preSignError?.username}
                label={i18n.t('user username')}
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
                placeholder={i18n.t('enter password')}
                password={true}
                icon={<FontAwesome name="lock" size={24} color={Colors.MAIN_COLOR} />}
                border={1}
                error={preSignError?.password}
                label={i18n.t('user password')}
              />

              {error ? <Text style={{ color: Colors.FAILED_COLOR }}>{i18n.t(error)}</Text> : null}
              {globalError.length > 0 ? (
                <Text style={{ color: Colors.FAILED_COLOR }}>{i18n.t(globalError)}</Text>
              ) : null}

              <Text
                style={{ alignSelf: 'flex-end', color: Colors.WHITE_COLOR }}
                onPress={() => {
                  setShowForgetPasswordModal(true);
                }}
              >
                {i18n.t('forget-password')}
              </Text>
              <Button text={i18n.t('sign in')} color={Colors.FAILED_COLOR} pressHandler={signinHanlder} />
            </View>
            <NavigateBetweenSign isSignIn={true} pressHandler={goToSignUpHandler} />
          </View>

          {showForgetPasswordModal && <ForgetPasswordModal cancelAction={() => setShowForgetPasswordModal(false)} />}
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
    backgroundColor: '#6872A6',
  },
  signInView: {
    borderRadius: 15,
    width: '90%',
    minHeight: '65%',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  inputsView: {
    backgroundColor: Colors.MAIN_COLOR,
    borderRadius: 12,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginVertical: 30,
  },
});

export default SignInScreen;
