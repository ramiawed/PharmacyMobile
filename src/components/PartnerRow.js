import React, { useState } from 'react';

import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableWithoutFeedback,
  Platform,
  Animated,
  ActivityIndicator,
} from 'react-native';

// icons
import { AntDesign } from '@expo/vector-icons';

// redux stuff
import { unwrapResult } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';
import { resetMedicines, setSearchWarehouseId, setSearchCompanyId } from '../redux/medicines/medicinesSlices';
import { addFavorite, removeFavorite, selectFavoritesPartners } from '../redux/favorites/favoritesSlice';
import { addStatistics } from '../redux/statistics/statisticsSlice';
import { selectUserData } from '../redux/auth/authSlice';
import { useNavigation } from '@react-navigation/core';
import { selectSettings } from '../redux/settings/settingsSlice';

// constants
import { Colors, BASEURL, UserTypeConstants } from '../utils/constants';
import { setSelectedWarehouse } from '../redux/warehouse/warehousesSlice';

const PartnerRow = ({ partner, type }) => {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const { token, user } = useSelector(selectUserData);
  const favorites = useSelector(selectFavoritesPartners);
  const {
    settings: { showWarehouseItem },
  } = useSelector(selectSettings);

  const [changeFavoriteLoading, setChangeFavoriteLoading] = useState(false);

  const allowShowingWarehouseMedicines =
    user?.type === UserTypeConstants.ADMIN ||
    partner.type === UserTypeConstants.COMPANY ||
    (partner.type === UserTypeConstants.WAREHOUSE && showWarehouseItem && partner.allowShowingMedicines);

  // method to handle add company to user's favorite
  const addPartnerToFavorites = () => {
    setChangeFavoriteLoading(true);

    dispatch(addFavorite({ obj: { favoriteId: partner._id }, token }))
      .then(unwrapResult)
      .then(() => {
        setChangeFavoriteLoading(false);
        dispatch(statisticsUserFavorites({ obj: { userId: user._id }, token }));
      })
      .catch(() => {
        setChangeFavoriteLoading(false);
      });
  };

  // method to handle remove company from user's favorite
  const removePartnerFromFavorites = (id) => {
    setChangeFavoriteLoading(true);

    dispatch(removeFavorite({ obj: { favoriteId: id }, token }))
      .then(unwrapResult)
      .then(() => {
        setChangeFavoriteLoading(false);
      })
      .catch(() => setChangeFavoriteLoading(false));
  };

  const dispatchPartnerSelected = () => {
    if (
      partner.type === UserTypeConstants.WAREHOUSE &&
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
              targetUser: partner._id,
              action: 'choose-company',
            },
            token,
          }),
        );
      }

      dispatch(resetMedicines());

      if (partner.type === UserTypeConstants.COMPANY) {
        dispatch(setSearchCompanyId(partner._id));
      }

      if (partner.type === UserTypeConstants.WAREHOUSE) {
        dispatch(setSearchWarehouseId(partner._id));
      }

      if (partner.type === UserTypeConstants.WAREHOUSE && user.type === UserTypeConstants.PHARMACY) {
        dispatch(setSelectedWarehouse(partner._id));
      } else {
        dispatch(setSelectedWarehouse(null));
      }

      navigation.navigate('Medicines', {
        screen: 'AllMedicines',
        params: {
          myCompanies: partner.ourCompanies,
        },
      });
    }
  };

  return (
    <TouchableWithoutFeedback onPress={dispatchPartnerSelected}>
      <View style={styles.container}>
        <View>
          <Text style={styles.title}>{partner.name}</Text>
        </View>

        <TouchableWithoutFeedback onPress={() => {}}>
          <View style={styles.favoriteIcon}>
            {changeFavoriteLoading ? (
              <ActivityIndicator size="small" color={Colors.YELLOW_COLOR} />
            ) : favorites && favorites.map((favorite) => favorite._id).includes(partner?._id) ? (
              <AntDesign
                name="star"
                size={24}
                color={Colors.YELLOW_COLOR}
                onPress={() => removePartnerFromFavorites(partner._id)}
              />
            ) : (
              <AntDesign
                name="staro"
                size={24}
                color={Colors.YELLOW_COLOR}
                onPress={() => addPartnerToFavorites(partner._id)}
              />
            )}
          </View>
        </TouchableWithoutFeedback>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    borderBottomWidth: 1,
    borderColor: '#e3e3e3',
  },

  title: {
    flex: 1,
    fontSize: 14,
    color: Colors.MAIN_COLOR,
    textAlign: 'center',
  },
  favoriteIcon: {},
});

export default PartnerRow;
