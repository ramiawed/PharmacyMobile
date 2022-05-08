import React, { useEffect } from 'react';
import i18n from '../i18n';
import { View, StyleSheet, Text } from 'react-native';
import { useSafeAreaInsets, SafeAreaView } from 'react-native-safe-area-context';

// Screens
import MainScreen from './MainScreen';
import ProfileScreen from './ProfileScreens';
import CompaniesScreen from './CompaniesScreen';
import WarehousesScreen from './WarehousesScreen';
import ProfileImage from '../components/ProfileImage';
import MedicinesStack from './MedicinesStack';
import CartScreen from './CartScreen';
import FavoriteScreen from './FavoriteScreen';
import HomeScreen from './HomeScreen';
import NotificationsStack from './NotificationsStack';
import OrdersStack from '../stacks/OrdersStack';

// navigation stuff
import { createDrawerNavigator, DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import { getHeaderTitle } from '@react-navigation/elements';

import {
  FontAwesome5,
  AntDesign,
  MaterialCommunityIcons,
  MaterialIcons,
  FontAwesome,
  Ionicons,
  Entypo,
} from '@expo/vector-icons';

// constants
import { Colors, BASEURL, UserTypeConstants } from '../utils/constants';

// redux stuff
import { useDispatch, useSelector } from 'react-redux';
import { selectUser, selectUserData, signOut } from '../redux/auth/authSlice';
import { resetFavorites, selectFavorites } from '../redux/favorites/favoritesSlice';
import { resetCompanies } from '../redux/company/companySlice';
import { setSearchCompanyId, setSearchWarehouseId } from '../redux/medicines/medicinesSlices';
import { selectCartItemCount } from '../redux/cart/cartSlice';
import { selectSettings } from '../redux/settings/settingsSlice';
import { selectAdvertisements } from '../redux/advertisements/advertisementsSlice';
import Loader from '../components/Loader';

const Drawer = createDrawerNavigator();

const DrawerScreen = () => {
  const dispatch = useDispatch();
  const { user, token } = useSelector(selectUserData);
  const { completed: settingsCompleted } = useSelector(selectSettings);
  const { status: favoritesStatus } = useSelector(selectFavorites);
  const { status: advertisementsStatus } = useSelector(selectAdvertisements);

  useEffect(() => {
    // dispatch(getAllSettings({ token }));
    // dispatch(getFavorites({ token }));
    // dispatch(statisticsSignin({ token }));

    return () => {
      dispatch(resetCompanies());
      dispatch(resetFavorites());
      dispatch(signOut());
    };
  }, []);

  return user ? (
    settingsCompleted === 'loading' ? (
      <Loader />
    ) : (
      <Drawer.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: Colors.MAIN_COLOR,
          },
          headerTintColor: Colors.WHITE_COLOR,
          header: ({ navigation, route, options }) => (
            <DrawerHeader navigation={navigation} route={route} options={options} />
          ),
        }}
        drawerContent={(props) => <CustomDrawerContent {...props} user={user} />}
      >
        <Drawer.Screen
          name="Main"
          component={HomeScreen}
          options={{
            title: i18n.t('main-screen'),
          }}
        />
        <Drawer.Screen name="Medicines" component={MedicinesStack} options={{ title: i18n.t('medicines-screen') }} />
        <Drawer.Screen name="Companies" component={CompaniesScreen} options={{ title: i18n.t('companies-screen') }} />
        <Drawer.Screen
          name="Warehouses"
          component={WarehousesScreen}
          options={{ title: i18n.t('warehouses-screen') }}
        />
        <Drawer.Screen name="Orders" component={OrdersStack} options={{ title: i18n.t('orders-screen') }} />
        <Drawer.Screen name="Cart" component={CartScreen} options={{ title: i18n.t('cart-screen') }} />
        <Drawer.Screen name="Favorite" component={FavoriteScreen} options={{ title: i18n.t('favorites-screen') }} />
        <Drawer.Screen
          name="Notifications"
          component={NotificationsStack}
          options={{ title: i18n.t('notifications-screen') }}
        />
        <Drawer.Screen name="Profile" component={ProfileScreen} options={{ title: i18n.t('profile-screen') }} />
      </Drawer.Navigator>
    )
  ) : null;
};

function CustomDrawerContent(props) {
  const dispatch = useDispatch();

  const { user } = props;
  return (
    <DrawerContentScrollView
      style={{
        backgroundColor: Colors.MAIN_COLOR,
      }}
      {...props}
    >
      <View style={styles.menuContainer}>
        <View style={styles.profileImageContainer}>
          <ProfileImage withDetails={true} />
        </View>
        <View
          style={{
            backgroundColor: props.state.index === 0 ? Colors.FAILED_COLOR : Colors.MAIN_COLOR,
            ...styles.option,
          }}
        >
          <DrawerItem
            label={i18n.t('main-screen')}
            icon={({}) => <FontAwesome5 color={Colors.WHITE_COLOR} size={24} name="home" />}
            onPress={() => {
              dispatch(setSearchWarehouseId(null));
              dispatch(setSearchCompanyId(null));
              props.navigation.navigate('Main');
            }}
            labelStyle={styles.drawerItemLabel}
          />
        </View>

        <View
          style={{
            backgroundColor: props.state.index === 1 ? Colors.FAILED_COLOR : Colors.MAIN_COLOR,
            ...styles.option,
          }}
        >
          <DrawerItem
            label={i18n.t('medicines-screen')}
            icon={({}) => <AntDesign color={Colors.WHITE_COLOR} size={24} name="medicinebox" />}
            onPress={() => {
              dispatch(setSearchWarehouseId(null));
              dispatch(setSearchCompanyId(null));
              props.navigation.navigate('Medicines', {
                screen: 'AllMedicines',
                params: { companyId: null, warehouseId: null },
              });
            }}
            labelStyle={styles.drawerItemLabel}
          />
        </View>

        <View
          style={{
            backgroundColor: props.state.index === 2 ? Colors.FAILED_COLOR : Colors.MAIN_COLOR,
            ...styles.option,
          }}
        >
          <DrawerItem
            label={i18n.t('companies-screen')}
            icon={({}) => <MaterialIcons name="groups" size={24} color={Colors.WHITE_COLOR} />}
            onPress={() => {
              dispatch(setSearchWarehouseId(null));
              dispatch(setSearchCompanyId(null));
              props.navigation.navigate('Companies');
            }}
            labelStyle={styles.drawerItemLabel}
          />
        </View>

        {(user.type === UserTypeConstants.ADMIN || user.type === UserTypeConstants.PHARMACY) && (
          <View
            style={{
              backgroundColor: props.state.index === 3 ? Colors.FAILED_COLOR : Colors.MAIN_COLOR,
              ...styles.option,
            }}
          >
            <DrawerItem
              label={i18n.t('warehouses-screen')}
              icon={({}) => <MaterialCommunityIcons name="warehouse" size={24} color={Colors.WHITE_COLOR} />}
              onPress={() => {
                dispatch(setSearchWarehouseId(null));
                dispatch(setSearchCompanyId(null));
                props.navigation.navigate('Warehouses');
              }}
              labelStyle={{
                color: Colors.WHITE_COLOR,
                fontSize: 16,
                fontWeight: 'bold',
              }}
            />
          </View>
        )}

        {(user.type === UserTypeConstants.PHARMACY ||
          user.type === UserTypeConstants.ADMIN ||
          user.type === UserTypeConstants.WAREHOUSE) && (
          <View
            style={{
              backgroundColor: props.state.index === 4 ? Colors.FAILED_COLOR : Colors.MAIN_COLOR,
              ...styles.option,
            }}
          >
            <DrawerItem
              label={i18n.t('orders-screen')}
              icon={({}) => <Entypo name="mail" size={24} color={Colors.WHITE_COLOR} />}
              onPress={() => {
                dispatch(setSearchWarehouseId(null));
                dispatch(setSearchCompanyId(null));
                props.navigation.navigate('Orders');
              }}
              labelStyle={{
                color: Colors.WHITE_COLOR,
                fontSize: 16,
                fontWeight: 'bold',
              }}
            />
          </View>
        )}

        {user.type === UserTypeConstants.PHARMACY && (
          <View
            style={{
              backgroundColor: props.state.index === 5 ? Colors.FAILED_COLOR : Colors.MAIN_COLOR,
              ...styles.option,
            }}
          >
            <DrawerItem
              label={i18n.t('cart-screen')}
              icon={({}) => <Ionicons name="cart" size={24} color={Colors.WHITE_COLOR} />}
              onPress={() => {
                dispatch(setSearchWarehouseId(null));
                dispatch(setSearchCompanyId(null));
                props.navigation.navigate('Cart');
              }}
              labelStyle={{
                color: Colors.WHITE_COLOR,
                fontSize: 16,
                fontWeight: 'bold',
              }}
            />
          </View>
        )}

        <View
          style={{
            backgroundColor: props.state.index === 6 ? Colors.FAILED_COLOR : Colors.MAIN_COLOR,
            ...styles.option,
          }}
        >
          <DrawerItem
            label={i18n.t('favorites-screen')}
            icon={({}) => <AntDesign name="star" size={24} color={Colors.WHITE_COLOR} />}
            onPress={() => {
              dispatch(setSearchWarehouseId(null));
              dispatch(setSearchCompanyId(null));
              props.navigation.navigate('Favorite');
            }}
            labelStyle={styles.drawerItemLabel}
          />
        </View>

        <View
          style={{
            backgroundColor: props.state.index === 7 ? Colors.FAILED_COLOR : Colors.MAIN_COLOR,
            ...styles.option,
          }}
        >
          <DrawerItem
            label={i18n.t('notifications-screen')}
            icon={({}) => <Ionicons name="notifications" size={24} color={Colors.WHITE_COLOR} />}
            onPress={() => {
              dispatch(setSearchWarehouseId(null));
              dispatch(setSearchCompanyId(null));
              props.navigation.navigate('Notifications', {
                screen: 'allNotifications',
              });
            }}
            labelStyle={styles.drawerItemLabel}
          />
        </View>

        <View
          style={{
            backgroundColor: props.state.index === 8 ? Colors.FAILED_COLOR : Colors.MAIN_COLOR,
            ...styles.option,
          }}
        >
          <DrawerItem
            label={i18n.t('profile-screen')}
            icon={({}) => <FontAwesome name="user" size={24} color={Colors.WHITE_COLOR} />}
            onPress={() => {
              dispatch(setSearchWarehouseId(null));
              dispatch(setSearchCompanyId(null));
              props.navigation.navigate('Profile');
            }}
            labelStyle={styles.drawerItemLabel}
          />
        </View>
      </View>
    </DrawerContentScrollView>
  );
}

function DrawerHeader({ navigation, route, options }) {
  const insets = useSafeAreaInsets();
  const cartCount = useSelector(selectCartItemCount);
  const title = getHeaderTitle(options, route.name);
  const user = useSelector(selectUser);
  return (
    <>
      <View style={{ ...styles.drawerHeader, paddingTop: insets.top }}>
        <View style={styles.drawerHeaderContent}>
          <MaterialIcons name="menu" size={30} color={Colors.WHITE_COLOR} onPress={() => navigation.openDrawer()} />
          <Text
            style={{
              fontSize: 20,
              flex: 1,
              color: Colors.WHITE_COLOR,
              marginStart: 5,
            }}
          >
            {title}
          </Text>
          {user.type === UserTypeConstants.PHARMACY && (
            <View style={styles.favoriteIcon}>
              <Ionicons
                name="cart"
                size={24}
                color={options.title === i18n.t('cart-screen') ? Colors.FAILED_COLOR : Colors.WHITE_COLOR}
                onPress={() => {
                  navigation.navigate('Cart');
                }}
              />
              {cartCount > 0 && <View style={styles.cartNotEmpty}></View>}
            </View>
          )}

          <View style={styles.favoriteIcon}>
            <Ionicons
              name="notifications"
              size={24}
              color={options.title === i18n.t('notifications-screen') ? Colors.FAILED_COLOR : Colors.WHITE_COLOR}
              onPress={() => {
                navigation.navigate('Notifications', {
                  screen: 'allNotifications',
                });
              }}
            />
          </View>
          <View style={styles.favoriteIcon}>
            <AntDesign
              name="star"
              size={24}
              color={options.title === i18n.t('favorites-screen') ? Colors.FAILED_COLOR : Colors.WHITE_COLOR}
              onPress={() => {
                navigation.navigate('Favorite');
              }}
            />
          </View>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.MAIN_COLOR,
  },
  menuContainer: {
    flex: 1,
    flexDirection: 'column',
    // justifyContent: 'space-evenly',
    alignItems: 'center',
    backgroundColor: Colors.MAIN_COLOR,
  },
  option: {
    borderRadius: 6,
    width: '90%',
  },
  profileImageContainer: {
    alignItems: 'center',
    justifyContent: 'space-around',
    width: '100%',
    height: 250,
    marginHorizontal: 'auto',
    marginBottom: 10,
    marginTop: -5,
    overflow: 'hidden',
    backgroundColor: Colors.MAIN_COLOR,
  },
  favoriteIcon: {
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 10,
  },
  cartNotEmpty: {
    position: 'absolute',
    top: -5,
    left: -5,
    backgroundColor: Colors.FAILED_COLOR,
    borderRadius: 6,
    width: 12,
    height: 12,
  },
  drawerHeader: {
    backgroundColor: Colors.MAIN_COLOR,
    justifyContent: 'flex-end',
    flexDirection: 'column',
  },
  drawerHeaderContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 5,
    paddingVertical: 10,
  },
  drawerItemLabel: {
    color: Colors.WHITE_COLOR,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default DrawerScreen;
