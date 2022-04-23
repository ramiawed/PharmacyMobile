import 'react-native-gesture-handler';

import React, { useEffect, useState } from 'react';
import { I18nManager } from 'react-native';
import './src/i18n/index';

// Navigation Stuff
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack';

// redux stuff
import { unwrapResult } from '@reduxjs/toolkit';
import { Provider, useDispatch, useSelector } from 'react-redux';

import { authSign, selectToken, selectUser, authSignWithToken } from './src/redux/auth/authSlice';
import { addStatistics } from './src/redux/statistics/statisticsSlice';
import { getAllSettings } from './src/redux/settings/settingsSlice';

// libraries
import AppLoading from 'expo-app-loading';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';

// components
import SigninScreen from './src/screens/SigninScreen';
import SignupScreen from './src/screens/SignupScreen';
import DrawerScreen from './src/screens/DrawerScreen';

// constants
import { Colors } from './src/utils/constants';
import ApproveScreen from './src/screens/ApproveScreen';

import { persistStore } from 'redux-persist';
import { PersistGate } from 'redux-persist/integration/react';

import store from './src/app/store';
import SplashScreen from './src/screens/SplashScreen';
let persistor = persistStore(store);

const Stack = createStackNavigator();

const App = () => {
  // const [isReady, setReady] = useState(false);
  const [showSplashScreen, setShowSplashScreen] = useState(true);
  const user = useSelector(selectUser);
  const token = useSelector(selectToken);
  const dispatch = useDispatch();

  // const [user, setUser] = useState(false);
  // const [username, setUsername] = useState('');
  // const [password, setPassword] = useState('');

  // const onStartAsync = async () => {
  //   const cachedUsername = await AsyncStorage.getItem('@username');
  //   const cachedPassword = await AsyncStorage.getItem('@password');

  //   if (cachedUsername && cachedPassword) {
  //     setUsername(cachedUsername);
  //     setPassword(cachedPassword);
  //   }

  //   return Promise.resolve(true);
  // };

  // const finishHandler = () => {
  //   if (username.length > 0 && password.length > 0) {
  //     dispatch(authSign({ username, password }))
  //       .then(unwrapResult)
  //       .then(() => {
  //         dispatch(statisticsSignin());
  //         setReady(true);
  //       });
  //   } else {
  //     setReady(true);
  //   }
  // };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (token) {
        dispatch(authSignWithToken({ token }))
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
            setShowSplashScreen(false);
          })
          .catch(() => {
            setShowSplashScreen(false);
          });
      } else {
        setShowSplashScreen(false);
      }
    }, 3000);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  // show splash screen and load necessary data
  // if (!isReady) {
  //   return <AppLoading startAsync={onStartAsync} onError={console.warn} onFinish={finishHandler} />;
  // }

  if (showSplashScreen) {
    return <SplashScreen />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        }}
      >
        {user ? (
          <Stack.Screen name="Drawer" component={DrawerScreen} />
        ) : (
          <>
            <Stack.Screen name="SignIn" component={SigninScreen} />
            <Stack.Screen name="SignUp" component={SignupScreen} />
            <Stack.Screen name="Approve" component={ApproveScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default () => {
  useEffect(() => {
    I18nManager.allowRTL(true);
    I18nManager.forceRTL(true);
  }, [I18nManager]);

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <App />
      </PersistGate>
      <Toast style={{ backgroundColor: Colors.SECONDARY_COLOR }} ref={(ref) => Toast.setRef(ref)} />
    </Provider>
  );
};
