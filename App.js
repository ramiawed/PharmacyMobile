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
import store from './src/app/store';
import { authSign, selectToken, selectUser } from './src/redux/auth/authSlice';
import { statisticsSignin } from './src/redux/statistics/statisticsSlice';

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
import { getAllSettings } from './src/redux/settings/settingsSlice';

const Stack = createStackNavigator();

const App = () => {
  const [isReady, setReady] = useState(false);
  const user = useSelector(selectUser);
  const dispatch = useDispatch();

  // const [user, setUser] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const onStartAsync = async () => {
    const cachedUsername = await AsyncStorage.getItem('@username');
    const cachedPassword = await AsyncStorage.getItem('@password');

    if (cachedUsername && cachedPassword) {
      setUsername(cachedUsername);
      setPassword(cachedPassword);
    }

    return Promise.resolve(true);
  };

  const finishHandler = () => {
    if (username.length > 0 && password.length > 0) {
      dispatch(authSign({ username, password }))
        .then(unwrapResult)
        .then(() => {
          dispatch(statisticsSignin());
          setReady(true);
        });
    } else {
      setReady(true);
    }
  };

  // show splash screen and load necessary data
  if (!isReady) {
    return <AppLoading startAsync={onStartAsync} onError={console.warn} onFinish={finishHandler} />;
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
      <App />
      <Toast style={{ backgroundColor: Colors.SECONDARY_COLOR }} ref={(ref) => Toast.setRef(ref)} />
    </Provider>
  );
};
