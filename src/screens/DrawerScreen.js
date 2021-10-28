import React, { useEffect } from 'react';
import i18n from '../i18n';
import { View, StyleSheet } from 'react-native';

// Screens
import MainScreen from './MainScreen';
import ProfileScreen from './ProfileScreens';
import CompaniesScreen from './CompaniesScreen';
import WarehousesScreen from './WarehousesScreen';
import ProfileImage from '../components/ProfileImage';
import MedicinesStack from './MedicinesStack';

// navigation stuff
import { createDrawerNavigator, DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';

// constants
import { Colors, baseUrl } from '../utils/constants';

// redux stuff
import { useDispatch, useSelector } from 'react-redux';
import { getAllSettings } from '../redux/settings/settingsSlice';
import { selectUserData, signOut } from '../redux/auth/authSlice';
import { getFavorites, resetFavorites } from '../redux/favorites/favoritesSlice';
import { statisticsSignin } from '../redux/statistics/statisticsSlice';
import { resetCompanies } from '../redux/company/companySlice';

const Drawer = createDrawerNavigator();

const DrawerScreen = () => {
  const dispatch = useDispatch();
  const { user, token } = useSelector(selectUserData);

  useEffect(() => {
    dispatch(getAllSettings({ token }));
    dispatch(getFavorites({ token }));
    dispatch(statisticsSignin({ token }));

    return () => {
      dispatch(resetCompanies());
      dispatch(resetFavorites());
      dispatch(signOut());
    };
  }, []);

  return (
    <Drawer.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: Colors.SECONDARY_COLOR,
        },
        headerTintColor: Colors.WHITE_COLOR,
      }}
      drawerContent={(props) => <CustomDrawerContent {...props} />}
    >
      <Drawer.Screen name="Main" component={MainScreen} options={{ title: i18n.t('main-screen') }} />
      <Drawer.Screen name="Medicines" component={MedicinesStack} options={{ title: i18n.t('medicines-screen') }} />
      <Drawer.Screen name="Companies" component={CompaniesScreen} options={{ title: i18n.t('companies-screen') }} />
      <Drawer.Screen name="Warehouses" component={WarehousesScreen} options={{ title: i18n.t('warehouses-screen') }} />
      <Drawer.Screen name="Profile" component={ProfileScreen} options={{ title: i18n.t('profile-screen') }} />
    </Drawer.Navigator>
  );
};

function CustomDrawerContent(props) {
  return (
    <DrawerContentScrollView {...props}>
      <View style={styles.menuContainer}>
        <View style={styles.profileImageContainer}>
          <ProfileImage />
        </View>
        <View
          style={{
            backgroundColor: props.state.index === 0 ? Colors.FAILED_COLOR : Colors.WHITE_COLOR,
            ...styles.option,
          }}
        >
          <DrawerItem
            label={i18n.t('main-screen')}
            onPress={() => {
              props.navigation.navigate('Main');
            }}
            labelStyle={{
              color: props.state.index === 0 ? Colors.WHITE_COLOR : Colors.SECONDARY_COLOR,
              fontSize: 16,
              fontWeight: 'bold',
            }}
          />
        </View>

        <View
          style={{
            backgroundColor: props.state.index === 1 ? Colors.FAILED_COLOR : Colors.WHITE_COLOR,
            ...styles.option,
          }}
        >
          <DrawerItem
            label={i18n.t('medicines-screen')}
            onPress={() => {
              props.navigation.navigate('Medicines', {
                screen: 'AllMedicines',
                params: { companyId: null, warehouseId: null },
              });
            }}
            labelStyle={{
              color: props.state.index === 1 ? Colors.WHITE_COLOR : Colors.SECONDARY_COLOR,
              fontSize: 16,
              fontWeight: 'bold',
            }}
          />
        </View>

        <View
          style={{
            backgroundColor: props.state.index === 2 ? Colors.FAILED_COLOR : Colors.WHITE_COLOR,
            ...styles.option,
          }}
        >
          <DrawerItem
            label={i18n.t('companies-screen')}
            onPress={() => {
              props.navigation.navigate('Companies');
            }}
            labelStyle={{
              color: props.state.index === 2 ? Colors.WHITE_COLOR : Colors.SECONDARY_COLOR,
              fontSize: 16,
              fontWeight: 'bold',
            }}
          />
        </View>

        <View
          style={{
            backgroundColor: props.state.index === 3 ? Colors.FAILED_COLOR : Colors.WHITE_COLOR,
            ...styles.option,
          }}
        >
          <DrawerItem
            label={i18n.t('warehouses-screen')}
            onPress={() => {
              props.navigation.navigate('Warehouses');
            }}
            labelStyle={{
              color: props.state.index === 3 ? Colors.WHITE_COLOR : Colors.SECONDARY_COLOR,
              fontSize: 16,
              fontWeight: 'bold',
            }}
          />
        </View>

        <View
          style={{
            backgroundColor: props.state.index === 4 ? Colors.FAILED_COLOR : Colors.WHITE_COLOR,
            ...styles.option,
          }}
        >
          <DrawerItem
            label={i18n.t('profile-screen')}
            onPress={() => {
              props.navigation.navigate('Profile');
            }}
            labelStyle={{
              color: props.state.index === 4 ? Colors.WHITE_COLOR : Colors.SECONDARY_COLOR,
              fontSize: 16,
              fontWeight: 'bold',
            }}
          />
        </View>
      </View>
    </DrawerContentScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  option: {
    marginHorizontal: 10,
    marginVertical: 5,
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
    backgroundColor: Colors.SECONDARY_COLOR,
  },
});

export default DrawerScreen;
