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

import { FontAwesome5, AntDesign, MaterialCommunityIcons, MaterialIcons, FontAwesome } from '@expo/vector-icons';

// constants
import { Colors, BASEURL, UserTypeConstants } from '../utils/constants';

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
    <Drawer.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: Colors.MAIN_COLOR,
        },
        headerTintColor: Colors.WHITE_COLOR,
      }}
      drawerContent={(props) => <CustomDrawerContent {...props} user={user} />}
    >
      <Drawer.Screen
        name="Main"
        component={MainScreen}
        options={{
          title: i18n.t('main-screen'),
        }}
      />
      <Drawer.Screen name="Medicines" component={MedicinesStack} options={{ title: i18n.t('medicines-screen') }} />
      <Drawer.Screen name="Companies" component={CompaniesScreen} options={{ title: i18n.t('companies-screen') }} />
      <Drawer.Screen name="Warehouses" component={WarehousesScreen} options={{ title: i18n.t('warehouses-screen') }} />
      <Drawer.Screen name="Profile" component={ProfileScreen} options={{ title: i18n.t('profile-screen') }} />
    </Drawer.Navigator>
  ) : null;
};

function CustomDrawerContent(props) {
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
          <ProfileImage />
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
              props.navigation.navigate('Main');
            }}
            labelStyle={{
              color: Colors.WHITE_COLOR,
              fontSize: 16,
              fontWeight: 'bold',
            }}
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
              props.navigation.navigate('Medicines', {
                screen: 'AllMedicines',
                params: { companyId: null, warehouseId: null },
              });
            }}
            labelStyle={{
              color: Colors.WHITE_COLOR,
              fontSize: 16,
              fontWeight: 'bold',
            }}
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
              props.navigation.navigate('Companies');
            }}
            labelStyle={{
              color: Colors.WHITE_COLOR,
              fontSize: 16,
              fontWeight: 'bold',
            }}
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

        <View
          style={{
            backgroundColor: props.state.index === 4 ? Colors.FAILED_COLOR : Colors.MAIN_COLOR,
            ...styles.option,
          }}
        >
          <DrawerItem
            label={i18n.t('profile-screen')}
            icon={({}) => <FontAwesome name="user" size={24} color={Colors.WHITE_COLOR} />}
            onPress={() => {
              props.navigation.navigate('Profile');
            }}
            labelStyle={{
              color: Colors.WHITE_COLOR,
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
    backgroundColor: Colors.MAIN_COLOR,
  },
  menuContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    backgroundColor: Colors.MAIN_COLOR,
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
    backgroundColor: Colors.MAIN_COLOR,
  },
});

export default DrawerScreen;
