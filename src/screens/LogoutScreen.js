import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import i18n from '../i18n';

// component
import Loader from '../components/Loader';

// redux stuff
import { useDispatch, useSelector } from 'react-redux';
import { authSignWithToken, selectUserData } from '../redux/auth/authSlice';
import { unwrapResult } from '@reduxjs/toolkit';
import { addStatistics } from '../redux/statistics/statisticsSlice';
import { getAllSettings } from '../redux/settings/settingsSlice';
import { getFavorites } from '../redux/favorites/favoritesSlice';
import { getAllAdvertisements } from '../redux/advertisements/advertisementsSlice';
import { getSavedItems } from '../redux/savedItems/savedItemsSlice';

// constants
import { signoutHandler } from '../utils/functions';
import { Colors, UserTypeConstants, VERSION } from '../utils/constants';

const LogoutScreen = ({ loginHandler }) => {
  const dispatch = useDispatch();

  // selectors
  const { token, user } = useSelector(selectUserData);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('login-with-token-error-msg');

  // const loginHandler = () => {
  //   if (token) {
  //     setLoading(true);
  //     dispatch(authSignWithToken({ token, version: VERSION }))
  //       .then(unwrapResult)
  //       .then((result) => {
  //         dispatch(
  //           addStatistics({
  //             obj: {
  //               targetUser: result.data.user._id,
  //               action: 'user-sign-in',
  //             },
  //             token: result.token,
  //           }),
  //         );
  //         dispatch(getAllSettings({ token: result.token }));
  //         dispatch(getFavorites({ token: result.token }));
  //         dispatch(getAllAdvertisements({ token: result.token }));
  //         if (user.type === UserTypeConstants.PHARMACY) {
  //           dispatch(getSavedItems({ token: result.token }));
  //         }
  //         setLoading(false);
  //       })
  //       .catch((err) => {
  //         if (err.message == 'update the app') {
  //           setErrorMsg('update the app');
  //         }
  //         setLoading(false);
  //       });
  //   }
  // };

  const signout = () => {
    signoutHandler(dispatch, token);
  };

  return (
    <View style={styles.container}>
      <View style={styles.approveView}>
        <Image
          source={require('../../assets/small-logo.png')}
          style={{ width: 75, height: 75, resizeMode: 'contain' }}
        />
        <Text style={styles.warningMsg}>{i18n.t(errorMsg)}</Text>
        <TouchableOpacity style={styles.checkBtn} onPress={loginHandler}>
          <Text style={styles.checkBtnText}>{i18n.t('try-again-label')}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.checkBtn} onPress={signout}>
          <Text style={styles.checkBtnText}>{i18n.t('nav sign out')}</Text>
        </TouchableOpacity>
      </View>

      {loading && <Loader />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#6872A6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  warningMsg: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.WHITE_COLOR,
    marginVertical: 10,
    textAlign: 'center',
  },
  version: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.SECONDARY_COLOR,
  },
  checkBtn: {
    backgroundColor: Colors.SUCCEEDED_COLOR,
    padding: 10,
    borderRadius: 6,
    marginVertical: 5,
  },
  checkBtnText: {
    color: Colors.WHITE_COLOR,
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
});

export default LogoutScreen;
