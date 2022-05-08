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
import Toast from 'react-native-toast-message';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// components
import SignInScreen from './src/screens/SignInScreen';
import SignupScreen from './src/screens/SignupScreen';
import DrawerScreen from './src/screens/DrawerScreen';
import ApproveScreen from './src/screens/ApproveScreen';
import SplashScreen from './src/screens/SplashScreen';

// constants
import { Colors } from './src/utils/constants';

import { persistStore } from 'redux-persist';
import { PersistGate } from 'redux-persist/integration/react';

import store from './src/app/store';

// redux stuff
import { getFavorites } from './src/redux/favorites/favoritesSlice';
import { getAllAdvertisements } from './src/redux/advertisements/advertisementsSlice';

let persistor = persistStore(store);

const Stack = createStackNavigator();

const App = () => {
  // const [isReady, setReady] = useState(false);
  const [showSplashScreen, setShowSplashScreen] = useState(true);
  const user = useSelector(selectUser);
  const token = useSelector(selectToken);
  const dispatch = useDispatch();

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
            dispatch(getFavorites({ token: result.token }));
            dispatch(getAllAdvertisements({ token: result.token }));
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
    <SafeAreaProvider>
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
              <Stack.Screen name="SignIn" component={SignInScreen} />
              <Stack.Screen name="SignUp" component={SignupScreen} />
              <Stack.Screen name="Approve" component={ApproveScreen} />
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
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
