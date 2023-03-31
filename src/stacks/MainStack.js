import React, { useEffect } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { View, StyleSheet, Text, Image, TouchableOpacity } from 'react-native';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import * as SecureStore from 'expo-secure-store';
import i18n from '../i18n';
import logo from '../../assets/adaptive-icon.png';

// navigation stuff
import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack';
import { getHeaderTitle } from '@react-navigation/elements';

// screen
import NotificationDetailsScreen from '../screens/NotificationDetailsScreen';
import BasketOrderDetailsScreen from '../screens/BasketOrderDetailsScreen';
import ItemsWithPointsScreen from '../screens/ItemsWithPointsScreen';
import NotificationsScreen from '../screens/NotificationsScreen';
import OrderDetailsScreen from '../screens/OrderDetailsScreen';
import ItemDetailsScreen from '../screens/ItemDetailsScreen';
import WarehousesScreen from '../screens/WarehousesScreen';
import FavoritesScreen from '../screens/FavoritesScreen';
import CompaniesScreen from '../screens/CompaniesScreen';
import ProfileScreen from '../screens/ProfileScreens';
import BasketsScreen from '../screens/BasketsScreen';
import OrdersScreen from '../screens/OrdersScreen';
import OffersScreen from '../screens/OffersScreen';
import ItemsScreen from '../screens/ItemsScreen';
import HomeScreen from '../screens/HomeScreen';
import CartScreen from '../screens/CartScreen';
import Loader from '../components/Loader';
import MyPointsScreen from '../screens/MyPointsScreen';
import SavedItemsScreen from '../screens/SavedItemsScreen';
import SearchScreen from '../screens/SearchScreen';

// icons
import { AntDesign, Ionicons } from '@expo/vector-icons';

// constants
import { Colors, UserTypeConstants } from '../utils/constants';

// redux stuff
import { useSelector, useDispatch } from 'react-redux';
import { saveExpoPushToken, selectUser, selectUserData, signOut } from '../redux/auth/authSlice';
import { selectCartItemCount } from '../redux/cart/cartSlice';
import { selectSettings } from '../redux/settings/settingsSlice';
import { resetFavorites, selectFavorites } from '../redux/favorites/favoritesSlice';
import { selectAdvertisements } from '../redux/advertisements/advertisementsSlice';
import { resetCompanies } from '../redux/company/companySlice';
import { selectMenuSettings } from '../redux/menu/menuSlice';

const mainStack = createStackNavigator();

const MainStack = () => {
  const dispatch = useDispatch();
  const { user, token } = useSelector(selectUserData);
  const { completed: settingsCompleted } = useSelector(selectSettings);
  const { completed: favoritesCompleted } = useSelector(selectFavorites);
  const { completed: advertisementsCompleted } = useSelector(selectAdvertisements);

  useEffect(() => {
    registerForPushNotificationsAsync();

    return () => {
      dispatch(resetCompanies());
      dispatch(resetFavorites());
      dispatch(signOut());
    };
  }, []);

  async function registerForPushNotificationsAsync() {
    const expoPushTokenFromSecureStore = await SecureStore.getItemAsync('expoPushToken');
    if (expoPushTokenFromSecureStore) {
      dispatch(
        saveExpoPushToken({
          expoPushToken: expoPushTokenFromSecureStore,
          token,
        }),
      );
    } else {
      let expoToken;
      if (Device.isDevice) {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== 'granted') {
          const { status } = await Notifications.requestPermissionsAsync();
          finalStatus = status;
        }
        if (finalStatus !== 'granted') {
          // alert('Failed to get push token for push notification!');
          return;
        }
        expoToken = (await Notifications.getExpoPushTokenAsync()).data;
        if (expoToken) {
          dispatch(saveExpoPushToken({ expoPushToken: expoToken, token }));
          await SecureStore.setItemAsync('expoPushToken', expoToken);
        }
      } else {
        // alert('Must use physical device for Push Notifications');
      }
    }

    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }
  }

  return user ? (
    settingsCompleted === 'loading' || favoritesCompleted === 'loading' || advertisementsCompleted === 'loading' ? (
      <Loader />
    ) : (
      <mainStack.Navigator
        screenOptions={(navigation) => ({
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
          header: ({ navigation, route, options }) => (
            <MainStackHeader navigation={navigation} route={route} options={options} />
          ),
        })}
      >
        <mainStack.Screen name="Home" component={HomeScreen} />
        <mainStack.Screen name="Items" component={ItemsScreen} />
        <mainStack.Screen name="ItemDetails" component={ItemDetailsScreen} />
        <mainStack.Screen name="Companies" component={CompaniesScreen} />
        <mainStack.Screen name="Warehouses" component={WarehousesScreen} />
        <mainStack.Screen name="Offers" component={OffersScreen} />
        <mainStack.Screen name="ItemsWithPoints" component={ItemsWithPointsScreen} />
        <mainStack.Screen name="Cart" component={CartScreen} />
        <mainStack.Screen name="Notifications" component={NotificationsScreen} />
        <mainStack.Screen name="NotificationDetails" component={NotificationDetailsScreen} />
        <mainStack.Screen name="Favorites" component={FavoritesScreen} />
        <mainStack.Screen name="Baskets" component={BasketsScreen} />
        <mainStack.Screen name="Orders" component={OrdersScreen} />
        <mainStack.Screen name="OrderDetails" component={OrderDetailsScreen} />
        <mainStack.Screen name="BasketOrderDetails" component={BasketOrderDetailsScreen} />
        <mainStack.Screen name="Profile" component={ProfileScreen} />
        <mainStack.Screen name="SavedItems" component={SavedItemsScreen} />
        <mainStack.Screen name="MyPoints" component={MyPointsScreen} />
        <mainStack.Screen name="Search" component={SearchScreen} />
      </mainStack.Navigator>
    )
  ) : (
    <></>
  );
};

function MainStackHeader({ navigation, route, options }) {
  const insets = useSafeAreaInsets();
  const title = getHeaderTitle(options, route.name);

  // selectors
  const user = useSelector(selectUser);
  const cartCount = useSelector(selectCartItemCount);

  const { open } = useSelector(selectMenuSettings);

  const newTitle =
    title.toLocaleLowerCase() === 'orders'
      ? user.type === UserTypeConstants.ADMIN
        ? 'orders'
        : 'my orders'
      : title.toLocaleLowerCase();

  return user ? (
    <View
      style={{
        ...styles.stackHeader,
        paddingTop: insets.top,
        backgroundColor: open ? '#000' : Colors.MAIN_COLOR,
        opacity: open ? 0.7 : 1,
      }}
    >
      <View style={styles.stackHeaderContent}>
        <Text style={styles.headerTitle}>{i18n.t(newTitle)}</Text>
        <View style={styles.icon}>
          <AntDesign
            name="search1"
            size={24}
            color={title === 'Search' ? Colors.FAILED_COLOR : Colors.WHITE_COLOR}
            onPress={() => {
              if (!open) navigation.navigate('Search');
            }}
          />
        </View>
        {user.type === UserTypeConstants.PHARMACY && (
          <View style={styles.icon}>
            <Ionicons
              name="cart"
              size={24}
              color={title === 'Cart' ? Colors.FAILED_COLOR : Colors.WHITE_COLOR}
              onPress={() => {
                if (!open) navigation.navigate('Cart');
              }}
            />
            {cartCount > 0 && <View style={styles.cartNotEmpty}></View>}
          </View>
        )}

        <View style={styles.icon}>
          <Ionicons
            name="notifications"
            size={24}
            color={title === 'Notifications' ? Colors.FAILED_COLOR : Colors.WHITE_COLOR}
            onPress={() => {
              if (!open)
                navigation.navigate('Notifications', {
                  screen: 'allNotifications',
                });
            }}
          />
        </View>

        <View style={styles.icon}>
          <AntDesign
            name="star"
            size={24}
            color={title === 'Favorites' ? Colors.FAILED_COLOR : Colors.WHITE_COLOR}
            onPress={() => {
              if (!open) navigation.navigate('Favorites');
            }}
          />
        </View>

        <View style={styles.icon}>
          <TouchableOpacity
            onPress={() => {
              if (!open) navigation.navigate('Home');
            }}
          >
            <Image source={logo} style={styles.image} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  ) : (
    <></>
  );
}

const styles = StyleSheet.create({
  icon: {
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
  stackHeader: {
    justifyContent: 'flex-end',
    flexDirection: 'column',
  },
  stackHeaderContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 5,
    paddingVertical: 10,
  },
  image: {
    width: 32,
    height: 32,
    resizeMode: 'cover',
    borderRadius: 16,
    backgroundColor: Colors.WHITE_COLOR,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
    color: Colors.WHITE_COLOR,
    marginStart: 5,
  },
});

export default MainStack;
