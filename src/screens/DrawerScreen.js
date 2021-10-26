import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import MainScreen from './MainScreen';

import ProfileScreen from './ProfileScreens';
import CompaniesScreen from './CompaniesScreen';
import MedicineScreen from './MedicineScreen';
import i18n from '../i18n';
import WarehousesScreen from './WarehousesScreen';

const Drawer = createDrawerNavigator();

const DrawerScreen = () => {
  return (
    <Drawer.Navigator>
      <Drawer.Screen name="Main" component={MainScreen} options={{ title: i18n.t('main-screen') }} />
      <Drawer.Screen name="Medicines" component={MedicineScreen} options={{ title: i18n.t('medicines-screen') }} />
      <Drawer.Screen name="Companies" component={CompaniesScreen} options={{ title: i18n.t('companies-screen') }} />
      <Drawer.Screen name="Warehouses" component={WarehousesScreen} options={{ title: i18n.t('warehouses-screen') }} />
      <Drawer.Screen name="Profile" component={ProfileScreen} options={{ title: i18n.t('profile-screen') }} />
    </Drawer.Navigator>
  );
};

export default DrawerScreen;
