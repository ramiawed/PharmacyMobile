import React from 'react';
import i18n from '../i18n/index';
import { View, Text, Image, StyleSheet, ScrollView } from 'react-native';

import { Ionicons, Fontisto } from '@expo/vector-icons';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Colors } from '../utils/constants';
import BasketsScreen from './BasketsScreen';
import BasketsOrdersScreen from './BasketsOrdersScreen';

const Tab = createBottomTabNavigator();

function HomeScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Home!</Text>
    </View>
  );
}

function SettingsScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Settings!</Text>
    </View>
  );
}

const BasketsTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: Colors.FAILED_COLOR,
        tabBarInactiveTintColor: Colors.GREY_COLOR,
        headerShown: false,
      })}
    >
      <Tab.Screen
        name="baskets"
        component={BasketsScreen}
        options={{
          tabBarIcon: ({ focused, color, size }) => {
            return <Ionicons name="basket-outline" size={size} color={color} />;
          },
          title: i18n.t('all-baskets-label'),
        }}
      />
      <Tab.Screen
        name="baskets-orders"
        component={BasketsOrdersScreen}
        options={{
          tabBarIcon: ({ focused, color, size }) => {
            return <Fontisto name="shopping-basket-add" size={24} color={color} />;
          },
          title: i18n.t('baskets-orders-label'),
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({});

export default BasketsTabNavigator;
