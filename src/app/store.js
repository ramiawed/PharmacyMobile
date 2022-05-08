import { combineReducers, configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import { persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';

import authSlice from '../redux/auth/authSlice';
import AdvertisementsSlice from '../redux/advertisements/advertisementsSlice';
import usersSlice from '../redux/users/usersSlice';
import companiesSlice from '../redux/company/companySlice';
import favoritesSlice from '../redux/favorites/favoritesSlice';
import warehousesSlice from '../redux/warehouse/warehousesSlice';
import cartSlice from '../redux/cart/cartSlice';
import statisticsSlice from '../redux/statistics/statisticsSlice';
import medicinesSlice from '../redux/medicines/medicinesSlices';
import companiesSectionOneSlice from '../redux/advertisements/companiesSectionOneSlice';
import companiesSectionTwoSlice from '../redux/advertisements/companiesSectionTwoSlice';
import itemsSectionOneSlice from '../redux/advertisements/itemsSectionOneSlice';
import itemsSectionTwoSlice from '../redux/advertisements/itemsSectionTwoSlice';
import itemsSectionThreeSlice from '../redux/advertisements/itemsSectionThreeSlice';
import settingsSlice from '../redux/settings/settingsSlice';
import userNotificationsSlice from '../redux/userNotifications/userNotificationsSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ordersSlice from '../redux/orders/ordersSlice';
import warehousesSectionOneSlice from '../redux/advertisements/warehousesSectionOneSlice';

const rootReducer = combineReducers({
  auth: authSlice,
  users: usersSlice,
  companies: companiesSlice,
  warehouses: warehousesSlice,
  favorites: favoritesSlice,
  cart: cartSlice,
  statistics: statisticsSlice,
  medicines: medicinesSlice,
  companiesSectionOne: companiesSectionOneSlice,
  companiesSectionTwo: companiesSectionTwoSlice,
  warehousesSectionOne: warehousesSectionOneSlice,
  itemsSectionOne: itemsSectionOneSlice,
  itemsSectionTwo: itemsSectionTwoSlice,
  itemsSectionThree: itemsSectionThreeSlice,
  settings: settingsSlice,
  userNotifications: userNotificationsSlice,
  orders: ordersSlice,
  advertisements: AdvertisementsSlice,
});

const persistConfig = {
  key: 'root',
  version: 1,
  storage: AsyncStorage,
  whitelist: ['auth', 'settings'],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export default configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware({
    serializableCheck: {
      ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
    },
    immutableCheck: false,
  }),
});
