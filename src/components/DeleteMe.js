import React, { useCallback, useEffect, useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, TextInput } from 'react-native';
import i18n from 'i18n-js';
import Toast from 'react-native-toast-message';

// components
import Loader from '../components/Loader';

// redux stuff
import { unwrapResult } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';
import { deleteMe, selectUserData } from '../redux/auth/authSlice';

// constants
import { Colors } from '../utils/constants';
import { useFocusEffect } from '@react-navigation/native';

const DeleteMe = ({ resetStore }) => {
  const { token, deleteError } = useSelector(selectUserData);
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);
  const [passwordForDelete, setPasswordForDelete] = useState('');
  const [passwordForDeleteError, setPasswordForDeleteError] = useState('');

  // method to handle change in password for delete account
  const handlePasswordForDeleteChange = (val) => {
    setPasswordForDelete(val);
    setPasswordForDeleteError('');
  };

  const handleDeleteMe = () => {
    // the password length must be greater than 0
    if (passwordForDelete.length === 0) {
      setPasswordForDeleteError('enter-password');
      return;
    }

    setLoading(true);

    dispatch(deleteMe({ obj: { password: passwordForDelete }, token }))
      .then(unwrapResult)
      .then(() => {
        setLoading(false);
        resetStore();
      })
      .catch((err) => {
        setLoading(false);
        // on failed, show message below the password input
        setPasswordForDeleteError(i18n.t(deleteError));
        Toast.show({
          type: 'error',
          text1: i18n.t('delete-account'),
          text2: i18n.t(deleteError),
        });
      });
  };

  useFocusEffect(
    useCallback(() => {
      // Do something when the screen is focused

      return () => {
        setPasswordForDelete('');
        setPasswordForDeleteError('');
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
          <Text style={styles.label}>{i18n.t('user-password')}</Text>
          <TextInput
            value={passwordForDelete}
            onChangeText={(val) => {
              handlePasswordForDeleteChange(val);
            }}
            style={styles.value}
            autoCapitalize="none"
            autoCorrect={false}
            secureTextEntry={true}
          />
        </View>
        {passwordForDeleteError.length > 0 && <Text style={styles.errorText}>{i18n.t(passwordForDeleteError)}</Text>}
      </View>
      <TouchableOpacity onPress={handleDeleteMe} style={styles.button}>
        <Text
          style={{
            color: Colors.WHITE_COLOR,
          }}
        >
          {i18n.t('delete-account')}
        </Text>
      </TouchableOpacity>

      {loading && <Loader />}
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
    backgroundColor: Colors.FAILED_COLOR,
    width: '50%',
    paddingVertical: 5,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 6,
    alignSelf: 'center',
    marginVertical: 5,
  },
});

export default DeleteMe;
