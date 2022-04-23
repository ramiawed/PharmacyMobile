import i18n from 'i18n-js';
import React, { useCallback, useState } from 'react';
import { View, StyleSheet, Text, TextInput, TouchableOpacity } from 'react-native';
import Toast from 'react-native-toast-message';

// components
import Loader from '../components/Loader';

// redux stuff
import { unwrapResult } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';
import { changeMyPassword, selectUserData } from '../redux/auth/authSlice';

// constants
import { Colors } from '../utils/constants';
import { useFocusEffect } from '@react-navigation/native';

const ChangePassword = () => {
  const dispatch = useDispatch();
  const { token } = useSelector(selectUserData);

  // own state that holds the oldPassword, newPassword, newPasswordConfirm values
  const [passwordObj, setPasswordObj] = useState({
    oldPassword: '',
    newPassword: '',
    newPasswordConfirm: '',
  });

  // own state that holds the error of oldPassword, newPassword, newPasswordConfirm values
  const [passwordObjError, setPasswordObjError] = useState({
    oldPassword: '',
    newPassword: '',
    newPasswordConfirm: '',
  });

  const changePasswordHandler = () => {
    let errorObj = {};
    if (passwordObj.oldPassword.length === 0) {
      errorObj = {
        ...errorObj,
        oldPassword: 'enter-old-password',
      };
    }

    if (passwordObj.newPassword.length < 5) {
      errorObj = {
        ...errorObj,
        newPassword: 'password-length',
      };
    }

    if (passwordObj.newPassword.length === 0) {
      errorObj = {
        ...errorObj,
        newPassword: 'enter-password',
      };
    }

    if (passwordObj.newPassword !== passwordObj.newPasswordConfirm) {
      errorObj = {
        ...errorObj,
        newPasswordConfirm: 'unequal-passwords',
      };
    }

    if (passwordObj.newPasswordConfirm.length < 5) {
      errorObj = {
        ...errorObj,
        newPasswordConfirm: 'confirm-password-length',
      };
    }

    if (passwordObj.newPasswordConfirm.length === 0) {
      errorObj = {
        ...errorObj,
        newPasswordConfirm: 'enter-password-confirm',
      };
    }

    if (Object.entries(errorObj).length !== 0) {
      setPasswordObjError({
        ...passwordObjError,
        ...errorObj,
      });
      return;
    }

    dispatch(changeMyPassword({ obj: passwordObj, token }))
      .then(unwrapResult)
      .then(() => {
        setPasswordObj({
          oldPassword: '',
          newPassword: '',
          newPasswordConfirm: '',
        });
        Toast.show({
          type: 'success',
          text1: i18n.t('change-password'),
          text2: i18n.t('password-change-succeeded'),
        });
      })
      .catch((err) => {
        Toast.show({
          type: 'error',
          text1: i18n.t('change-password'),
          text2: i18n.t('password-change-failed'),
        });
      });
  };

  // method to handle the change in the input in password and confirm password
  // for change password
  const handlePasswordFieldsChange = (field, val) => {
    setPasswordObj({
      ...passwordObj,
      [field]: val,
    });
    setPasswordObjError({
      ...passwordObjError,
      [field]: '',
    });
  };

  useFocusEffect(
    useCallback(() => {
      // Do something when the screen is focused

      return () => {
        setPasswordObj({
          oldPassword: '',
          newPassword: '',
          newPasswordConfirm: '',
        });
        setPasswordObjError({
          oldPassword: '',
          newPassword: '',
          newPasswordConfirm: '',
        });
      };
    }, []),
  );

  return (
    <>
      <View
        style={{
          flexDirection: 'column',
        }}
      >
        <View style={styles.row}>
          <Text style={styles.label}>{i18n.t('old-password')}</Text>
          <TextInput
            value={passwordObj.oldPassword}
            onChangeText={(val) => {
              handlePasswordFieldsChange('oldPassword', val);
            }}
            style={styles.value}
            autoCapitalize="none"
            autoCorrect={false}
            secureTextEntry={true}
          />
        </View>
        {passwordObjError.oldPassword.length > 0 && (
          <Text style={styles.errorText}>{i18n.t(passwordObjError.oldPassword)}</Text>
        )}
      </View>

      <View style={{ flexDirection: 'column' }}>
        <View style={styles.row}>
          <Text style={styles.label}>{i18n.t('new-password')}</Text>
          <TextInput
            value={passwordObj.newPassword}
            onChangeText={(val) => {
              handlePasswordFieldsChange('newPassword', val);
            }}
            style={styles.value}
            autoCapitalize="none"
            autoCorrect={false}
            secureTextEntry={true}
          />
        </View>
        {passwordObjError.newPassword.length > 0 && (
          <Text style={styles.errorText}>{i18n.t(passwordObjError.newPassword)}</Text>
        )}
      </View>

      <View style={{ flexDirection: 'column' }}>
        <View style={styles.row}>
          <Text style={styles.label}>{i18n.t('new-password-confirm')}</Text>
          <TextInput
            value={passwordObj.newPasswordConfirm}
            onChangeText={(val) => {
              handlePasswordFieldsChange('newPasswordConfirm', val);
            }}
            style={styles.value}
            autoCapitalize="none"
            autoCorrect={false}
            secureTextEntry={true}
          />
        </View>
        {passwordObjError.newPasswordConfirm.length > 0 && (
          <Text style={styles.errorText}>{i18n.t(passwordObjError.newPasswordConfirm)}</Text>
        )}
      </View>

      <TouchableOpacity onPress={changePasswordHandler} style={styles.button}>
        <Text
          style={{
            color: Colors.WHITE_COLOR,
          }}
        >
          {i18n.t('change-password')}
        </Text>
      </TouchableOpacity>
    </>
  );
};

const styles = StyleSheet.create({
  row: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    height: 45,
    paddingHorizontal: 5,
    borderBottomWidth: 1,
    borderBottomColor: Colors.SECONDARY_COLOR,
  },
  value: {
    flex: 1,
    color: Colors.MAIN_COLOR,
    fontSize: 14,
    fontWeight: 'bold',
    marginStart: 5,
    textAlign: 'right',
  },
  label: {
    width: 80,
    color: Colors.GREY_COLOR,
    fontSize: 12,
  },
  errorText: {
    fontSize: 10,
    color: Colors.FAILED_COLOR,
    textAlign: 'center',
  },
  button: {
    backgroundColor: Colors.SUCCEEDED_COLOR,
    width: '50%',
    marginHorizontal: 'auto',
    paddingVertical: 5,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 6,
    alignSelf: 'center',
    marginVertical: 5,
  },
});

export default ChangePassword;
