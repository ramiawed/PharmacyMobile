import React from 'react';
import i18n from '../i18n/index';

import { View, Text, TouchableOpacity, Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// Screens
import HomeScreen from './HomeScreen';
import CartScreen from './CartScreen';
import FavoriteScreen from './FavoriteScreen';

// icons
import { Ionicons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';

// constants
import { Colors } from '../utils/constants';

const MainTab = createBottomTabNavigator();

const MainScreen = () => {
  return (
    <MainTab.Navigator tabBar={(props) => <MyTabBar {...props} />} initialRouteName="Home">
      <MainTab.Screen name="Cart" component={CartScreen} options={{ title: i18n.t('cart'), headerShown: false }} />
      <MainTab.Screen name="Home" component={HomeScreen} options={{ title: i18n.t('home'), headerShown: false }} />
      <MainTab.Screen
        name="Favorite"
        component={FavoriteScreen}
        options={{ title: i18n.t('favorites'), headerShown: false }}
      />
    </MainTab.Navigator>
  );
};

function MyTabBar({ state, descriptors, navigation }) {
  return (
    <View
      style={{
        flexDirection: 'row',
        backgroundColor: Colors.MAIN_COLOR,
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        return (
          <TouchableOpacity
            key={route.key}
            accessibilityRole="button"
            accessibilityStates={isFocused ? ['selected'] : []}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            style={{ flex: 1, alignItems: 'center' }}
          >
            {label === i18n.t('home') && (
              <Ionicons name="home" size={24} color={isFocused ? Colors.FAILED_COLOR : '#fff'} />
            )}
            {label === i18n.t('favorites') && (
              <Ionicons name="star" size={24} color={isFocused ? Colors.FAILED_COLOR : '#fff'} />
            )}
            {label === i18n.t('cart') && (
              <Ionicons name="cart" size={24} color={isFocused ? Colors.FAILED_COLOR : '#fff'} />
            )}
            {label === i18n.t('nav-profile') && (
              <AntDesign name="user" size={24} color={isFocused ? Colors.FAILED_COLOR : '#fff'} />
            )}
            {label === i18n.t('medicines') && (
              <AntDesign name="medicinebox" size={24} color={isFocused ? Colors.FAILED_COLOR : '#fff'} />
            )}
            <Text style={{ color: isFocused ? Colors.FAILED_COLOR : '#fff', fontSize: 12 }}>{label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

export default MainScreen;
