import AsyncStorage from '@react-native-async-storage/async-storage';
import i18n from '../i18n/index';
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors } from '../utils/constants';
import { useDispatch, useSelector } from 'react-redux';
import { selectUserData, signOut } from '../redux/auth/authSlice';
import UserInfoRow from '../components/UserInfoRow';

const ProfileScreen = () => {
  const dispatch = useDispatch();
  const { user, token } = useSelector(selectUserData);

  const signoutHandler = () => {
    dispatch(signOut());
    clearAsyncStorage();
  };

  const clearAsyncStorage = async () => {
    try {
      await AsyncStorage.removeItem('@username');
      await AsyncStorage.removeItem('@password');
    } catch (err) {}
  };

  return (
    <View style={{ backgroundColor: '#fff' }}>
      <UserInfoRow label={user?.name} />
      <TouchableOpacity style={styles.button} onPress={signoutHandler}>
        <Text style={styles.buttonText}>{i18n.t('nav-sign-out')}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: Colors.FAILED_COLOR,
    minWidth: 100,
    padding: 10,
    borderRadius: 6,
    marginVertical: 10,
  },
  buttonText: {
    textAlign: 'center',
    color: '#fff',
  },
});

export default ProfileScreen;
