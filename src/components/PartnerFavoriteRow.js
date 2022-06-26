import React, { useEffect, useState } from 'react';

import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';

// redux stuff
import { selectToken, selectUserData } from '../redux/auth/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import { removeFavorite } from '../redux/favorites/favoritesSlice';

// navigation stuff
import { useNavigation } from '@react-navigation/native';

// constants
import { Colors, UserTypeConstants } from '../utils/constants';

// icons
import { AntDesign } from '@expo/vector-icons';
import { selectSettings } from '../redux/settings/settingsSlice';
import { addStatistics } from '../redux/statistics/statisticsSlice';
import { resetMedicines, setSearchCompanyId, setSearchWarehouseId } from '../redux/medicines/medicinesSlices';
import { setSelectedWarehouse } from '../redux/warehouse/warehousesSlice';

const PartnerFavoriteRow = ({ type, favorite }) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  // selector
  const { token, user } = useSelector(selectUserData);
  const {
    settings: { showWarehouseItem },
  } = useSelector(selectSettings);

  // own state
  const [loading, setLoading] = useState(false);
  const allowShowingWarehouseMedicines =
    user?.type === UserTypeConstants.ADMIN ||
    favorite.type === UserTypeConstants.COMPANY ||
    (favorite.type === UserTypeConstants.WAREHOUSE && showWarehouseItem && favorite.allowShowingMedicines);

  // method to handle remove company from user's favorite
  const removeCompanyFromFavorite = (id) => {
    if (type === 'company' || type === 'warehouse') {
      setLoading(true);
      dispatch(removeFavorite({ obj: { favoriteId: id }, token }));
    }
  };

  const goToCompanyItems = (id) => {
    if (
      favorite.type === UserTypeConstants.WAREHOUSE &&
      (user.type === UserTypeConstants.WAREHOUSE ||
        user.type === UserTypeConstants.COMPANY ||
        user.type === UserTypeConstants.GUEST)
    ) {
      return;
    }

    if (allowShowingWarehouseMedicines) {
      // if the partner type is pharmacy or normal, change the selectedCount
      // and selectedDates for this company
      if (user.type === UserTypeConstants.PHARMACY) {
        dispatch(
          addStatistics({
            obj: {
              sourceUser: user._id,
              targetUser: favorite._id,
              action: 'choose-company',
            },
            token,
          }),
        );
      }
    }

    dispatch(resetMedicines());

    if (favorite.type === UserTypeConstants.COMPANY) {
      dispatch(setSearchCompanyId(favorite._id));
    }

    if (favorite.type === UserTypeConstants.WAREHOUSE) {
      dispatch(setSearchWarehouseId(favorite._id));
    }

    if (favorite.type === UserTypeConstants.WAREHOUSE && user.type === UserTypeConstants.PHARMACY) {
      dispatch(setSelectedWarehouse(favorite._id));
    } else {
      dispatch(setSelectedWarehouse(null));
    }

    navigation.navigate('Medicines', {
      screen: 'AllMedicines',
      params: {
        myCompanies: favorite.ourCompanies,
      },
    });
  };

  return (
    <View key={favorite._id} style={styles.row}>
      <Text style={styles.name} onPress={() => goToCompanyItems(favorite._id)}>
        {favorite.name}
      </Text>
      {loading ? (
        <ActivityIndicator size="small" color={Colors.YELLOW_COLOR} />
      ) : (
        <AntDesign
          name="star"
          size={32}
          color={Colors.YELLOW_COLOR}
          onPress={() => removeCompanyFromFavorite(favorite._id)}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    writingDirection: 'rtl',
    padding: 10,
    borderBottomWidth: 1,
    borderColor: 'rgba(0, 0, 0, .1)',
  },
  name: {
    fontSize: 16,
    color: Colors.MAIN_COLOR,
    flex: 1,
    textAlign: 'left',
  },
});

export default PartnerFavoriteRow;
