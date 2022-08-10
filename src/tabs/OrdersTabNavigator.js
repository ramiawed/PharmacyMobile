import React from 'react';
import i18n from '../i18n/index';
import {  StyleSheet } from 'react-native';

import { AntDesign, FontAwesome } from '@expo/vector-icons';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Colors } from '../utils/constants';
import OrdersStack from '../stacks/OrdersStack';
import BasketOrdersStack from '../stacks/BasketOrdersStack';

const Tab = createBottomTabNavigator();

const OrdersTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: Colors.FAILED_COLOR,
        tabBarInactiveTintColor: Colors.WHITE_COLOR,
        headerShown: false,
        tabBarStyle: { backgroundColor: Colors.MAIN_COLOR },
      })}
      
    >
      <Tab.Screen
        name="orders"
        component={OrdersStack}
        options={{
          tabBarIcon: ({ focused, color, size }) => {
            return <AntDesign color={color} size={24} name="medicinebox" />;
          },
          title: i18n.t('orders-label'),
        }}
      />
      <Tab.Screen
        name="baskets-orders"
        component={BasketOrdersStack}
        options={{
          tabBarIcon: ({ focused, color, size }) => {
            return <FontAwesome name="shopping-basket" size={24} color={color} />;
          },
          title: i18n.t('baskets-orders-label'),
        }}
        initialParams={{type: 'basket'}}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({});

export default OrdersTabNavigator;
