import { advertisementsSignOut } from '../redux/advertisements/advertisementsSlice';
import { companiesSectionOneSignOut } from '../redux/advertisements/companiesSectionOneSlice';
import { companiesSectionTwoSignOut } from '../redux/advertisements/companiesSectionTwoSlice';
import { itemsSectionOneSignOut } from '../redux/advertisements/itemsSectionOneSlice';
import { itemsSectionThreeSignOut } from '../redux/advertisements/itemsSectionThreeSlice';
import { itemsSectionTwoSignOut } from '../redux/advertisements/itemsSectionTwoSlice';
import { warehousesSectionOneSignOut } from '../redux/advertisements/warehousesSectionOneSlice';
import { authSliceSignOut, clearExpoPushToken } from '../redux/auth/authSlice';
import { basketOrderSliceSignOut } from '../redux/basketOrdersSlice/basketOrdersSlice';
import { basketsSliceSignOut } from '../redux/baskets/basketsSlice';
import { cartSliceSignOut } from '../redux/cart/cartSlice';
import { companySliceSignOut } from '../redux/company/companySlice';
import { favoritesSliceSignOut } from '../redux/favorites/favoritesSlice';
import { medicinesSliceSignOut, resetMedicines } from '../redux/medicines/medicinesSlices';
import { orderSliceSignOut } from '../redux/orders/ordersSlice';
import { savedItemsSliceSignOut } from '../redux/savedItems/savedItemsSlice';
import { settingsSignOut } from '../redux/settings/settingsSlice';
import { usersNotificationsSignOut } from '../redux/userNotifications/userNotificationsSlice';
import { warehouseSliceSignOut } from '../redux/warehouse/warehousesSlice';

import * as SecureStore from 'expo-secure-store';

export const signoutHandler = async (dispatch, token) => {
  dispatch(authSliceSignOut());
  dispatch(cartSliceSignOut());
  dispatch(companySliceSignOut());
  dispatch(favoritesSliceSignOut());
  dispatch(warehouseSliceSignOut());
  dispatch(orderSliceSignOut());
  dispatch(resetMedicines());
  dispatch(advertisementsSignOut());
  dispatch(companiesSectionOneSignOut());
  dispatch(companiesSectionTwoSignOut());
  dispatch(itemsSectionOneSignOut());
  dispatch(itemsSectionThreeSignOut());
  dispatch(itemsSectionTwoSignOut());
  dispatch(warehousesSectionOneSignOut());
  dispatch(medicinesSliceSignOut());
  dispatch(settingsSignOut());
  dispatch(usersNotificationsSignOut());
  dispatch(savedItemsSliceSignOut());
  dispatch(basketsSliceSignOut());
  dispatch(basketOrderSliceSignOut());

  const expoPushToken = await SecureStore.getItemAsync('expoPushToken');
  if (expoPushToken) {
    dispatch(clearExpoPushToken({ expoPushToken, token }));
  }
};
