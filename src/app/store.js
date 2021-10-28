import { configureStore } from '@reduxjs/toolkit';

import authSlice from '../redux/auth/authSlice';
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

export default configureStore({
  reducer: {
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
    itemsSectionOne: itemsSectionOneSlice,
    itemsSectionTwo: itemsSectionTwoSlice,
    itemsSectionThree: itemsSectionThreeSlice,
    settings: settingsSlice,
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
