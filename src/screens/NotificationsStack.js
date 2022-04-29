import React from 'react';

import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack';

// screens
import NotificationsScreen from './NotificationsScreen';
import NotificationDetailsScreen from './NotificationDetailsScreen';

const notificationsStack = createStackNavigator();

const NotificationsStack = () => {
  return (
    <notificationsStack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
      }}
    >
      <notificationsStack.Screen name="allNotifications" component={NotificationsScreen} />
      <notificationsStack.Screen name="Notification" component={NotificationDetailsScreen} />
    </notificationsStack.Navigator>
  );
};

export default NotificationsStack;
