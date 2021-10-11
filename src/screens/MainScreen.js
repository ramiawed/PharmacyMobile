import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from './HomeScreen';
import CartScreen from './CartScreen';
import ProfileScreen from './ProfileScreens';
import FavoriteScreen from './FavoriteScreen';

import { Ionicons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import i18n from '../i18n/index';
import { Colors } from '../utils/constants';
import { useDispatch, useSelector } from 'react-redux';
import { selectUserData, signOut } from '../redux/auth/authSlice';
import { getFavorites, resetFavorites } from '../redux/favorites/favoritesSlice';
import { resetCompanyItems } from '../redux/companyItems/companyItemsSlices';
import { resetCompanies } from '../redux/company/companySlice';
import { statisticsSignin } from '../redux/statistics/statisticsSlice';
import ItemStack from './ItemStack';

const MainTab = createBottomTabNavigator();

const MainScreen = () => {
  const { token } = useSelector(selectUserData);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getFavorites({ token }));
    dispatch(statisticsSignin({ token }));

    return () => {
      console.log('leave main screen');
      dispatch(resetCompanyItems());
      dispatch(resetCompanies());
      dispatch(resetFavorites());
      dispatch(signOut());
    };
  }, []);

  return (
    <MainTab.Navigator tabBar={(props) => <MyTabBar {...props} />} initialRouteName="Home">
      <MainTab.Screen
        name="Medicines"
        component={ItemStack}
        options={{ title: i18n.t('medicines'), headerShown: false }}
      />
      <MainTab.Screen name="Cart" component={CartScreen} options={{ title: i18n.t('cart') }} />
      <MainTab.Screen name="Home" component={HomeScreen} options={{ title: i18n.t('main') }} />
      <MainTab.Screen name="Favorite" component={FavoriteScreen} options={{ title: i18n.t('favorites') }} />
      <MainTab.Screen name="Profile" component={ProfileScreen} options={{ title: i18n.t('nav-profile') }} />
    </MainTab.Navigator>
  );
};

function MyTabBar({ state, descriptors, navigation }) {
  return (
    <View
      style={{
        flexDirection: 'row',
        backgroundColor: '#566092',
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
            {label === i18n.t('main') && (
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
