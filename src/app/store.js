import { configureStore } from '@reduxjs/toolkit';

import authSlice from '../redux/auth/authSlice';
import usersSlice from '../redux/users/usersSlice';
import companiesSlice from '../redux/company/companySlice';
import favoritesSlice from '../redux/favorites/favoritesSlice';
import warehousesSlice from '../redux/warehouse/warehousesSlice';
import itemsSlice from '../redux/items/itemsSlices';
import companyItemsSlice from '../redux/companyItems/companyItemsSlices';
import warehouseItemsSlices from '../redux/warehouseItems/warehouseItemsSlices';
import cartSlice from '../redux/cart/cartSlice';
import statisticsSlice from '../redux/statistics/statisticsSlice';
import onlineSlice from '../redux/online/onlineSlice';

export default configureStore({
  reducer: {
    auth: authSlice,
    users: usersSlice,
    companies: companiesSlice,
    warehouses: warehousesSlice,
    favorites: favoritesSlice,
    items: itemsSlice,
    companyItems: companyItemsSlice,
    warehouseItems: warehouseItemsSlices,
    cart: cartSlice,
    statistics: statisticsSlice,
    online: onlineSlice,
  },
});

// const persistConfig = {
//   key: 'root',
//   storage,
//   whitelist: ['auth', 'cart'],
//   blacklist: [],
// };

// const persistedReducer = persistReducer(persistConfig, reducers);

// export default configureStore({
//   reducer: persistedReducer,
// });
