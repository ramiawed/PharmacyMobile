import 'react-native-gesture-handler';

// libraries
import Toast from 'react-native-toast-message';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import React, { useEffect, useState, useRef } from 'react';
import * as Notifications from 'expo-notifications';
import { I18nManager } from 'react-native';

import './src/i18n/index';

// redux stuff
import { unwrapResult } from '@reduxjs/toolkit';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { getFavorites } from './src/redux/favorites/favoritesSlice';
import { getAllAdvertisements } from './src/redux/advertisements/advertisementsSlice';
import { selectToken, selectUser, authSignWithToken, saveExpoPushToken } from './src/redux/auth/authSlice';
import { addStatistics } from './src/redux/statistics/statisticsSlice';
import { getAllSettings } from './src/redux/settings/settingsSlice';
import { getSavedItems } from './src/redux/savedItems/savedItemsSlice';

// screens
import SignInScreen from './src/screens/SignInScreen';
import SignupScreen from './src/screens/SignupScreen';
import DrawerScreen from './src/screens/DrawerScreen';
import ApproveScreen from './src/screens/ApproveScreen';
import SplashScreen from './src/screens/SplashScreen';
import LogoutScreen from './src/screens/LogoutScreen';

// constants
import { Colors, UserTypeConstants } from './src/utils/constants';

// configuration for store
import { persistStore } from 'redux-persist';
import { PersistGate } from 'redux-persist/integration/react';
import store from './src/app/store';
let persistor = persistStore(store);

// navigation's stuff
import { NavigationContainer, createNavigationContainerRef } from '@react-navigation/native';
import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack';
const Stack = createStackNavigator();
const navigationRef = createNavigationContainerRef();

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

const App = () => {
  const dispatch = useDispatch();
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();

  // selectors
  const user = useSelector(selectUser);
  const token = useSelector(selectToken);

  // own states
  const [showSplashScreen, setShowSplashScreen] = useState(true);

  useEffect(() => {
    // This listener is fired whenever a notification is received while the app is foregrounded
    notificationListener.current = Notifications.addNotificationReceivedListener((notification) => {
      setNotification(notification);
    });

    // This listener is fired whenever a user taps on or interacts with a notification (works when app is foregrounded, backgrounded, or killed)
    responseListener.current = Notifications.addNotificationResponseReceivedListener((response) => {
      // console.log(response.notification.request.content.data);

      if (response.notification.request.content.data) {
        const { screen, notificationId, orderId } = response.notification.request.content.data;
        if (screen === 'notification') {
          if (navigationRef.isReady()) {
            navigationRef.navigate('Notifications', {
              screen: 'Notification',
              params: {
                notificationId,
              },
            });
          }
        }

        if (screen === 'order') {
          if (navigationRef.isReady()) {
            navigationRef.navigate('Orders', {
              screen: 'orders',
              params: {
                screen: 'Order',
                params: {
                  orderId,
                },
              },
            });
          }
        }

        if (screen === 'basket order') {
          if (navigationRef.isReady()) {
            navigationRef.navigate('Orders', {
              screen: 'baskets-orders',
              params: {
                screen: 'BasketOrder',
                params: {
                  orderId,
                },
              },
            });
          }
        }
      }
    });

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
            if (user.type === UserTypeConstants.PHARMACY) {
              dispatch(getSavedItems({ token }));
            }
            setShowSplashScreen(false);
          })
          .catch(() => {
            setShowSplashScreen(false);
          });
      } else {
        setShowSplashScreen(false);
      }
    }, 1000);

    return () => {
      clearTimeout(timer);
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  if (showSplashScreen) {
    return <SplashScreen />;
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer ref={navigationRef}>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
            cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
          }}
        >
          {user ? (
            <>
              <Stack.Screen name="Drawer" component={DrawerScreen} />
            </>
          ) : token ? (
            <>
              <Stack.Screen name="LogOut" component={LogoutScreen} />
            </>
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
