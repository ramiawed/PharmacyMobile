import React from 'react';
import i18n from '../i18n';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import { View, StyleSheet } from 'react-native';
import MainScreen from './MainScreen';
import ProfileScreen from './ProfileScreens';
import CompaniesScreen from './CompaniesScreen';
import WarehousesScreen from './WarehousesScreen';
import MedicinesScreen from './MedicinesScreen';
import { Colors, baseUrl } from '../utils/constants';
import ProfileImage from '../components/ProfileImage';

const Drawer = createDrawerNavigator();

const DrawerScreen = () => {
  return (
    <Drawer.Navigator drawerContent={(props) => <CustomDrawerContent {...props} />}>
      <Drawer.Screen name="Main" component={MainScreen} options={{ title: i18n.t('main-screen') }} />
      <Drawer.Screen
        name="Medicines"
        component={MedicinesScreen}
        options={{ title: i18n.t('medicines-screen') }}
        initialParams={{ companyId: null, warehouseId: null }}
      />
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
              props.navigation.navigate('Medicines', { companyId: null, warehouseId: null });
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
    justifyContent: 'center',
    width: '100%',
    height: 200,
    marginHorizontal: 'auto',
    marginBottom: 10,
    marginTop: -5,
    overflow: 'hidden',
    backgroundColor: Colors.SECONDARY_COLOR,
  },
});

export default DrawerScreen;
