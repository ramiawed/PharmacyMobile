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

import { AntDesign } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { addFavorite, removeFavorite, selectFavoritesPartners } from '../redux/favorites/favoritesSlice';
import { statisticsCompanySelected, statisticsUserFavorites } from '../redux/statistics/statisticsSlice';
import { Colors, baseUrl, UserTypeConstants } from '../utils/constants';
import { selectUserData } from '../redux/auth/authSlice';
import { unwrapResult } from '@reduxjs/toolkit';
import { resetMedicines } from '../redux/medicines/medicinesSlices';
import { useNavigation } from '@react-navigation/core';
import { selectSettings } from '../redux/settings/settingsSlice';

const PartnerRow = ({ partner, type }) => {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  // selectors
  const {
    settings: { showWarehouseItem },
  } = useSelector(selectSettings);
  const { token, user } = useSelector(selectUserData);
  const favorites = useSelector(selectFavoritesPartners);

  const [changeFavoriteLoading, setChangeFavoriteLoading] = useState(false);

  // method to handle add company to user's favorite
  const addCompanyToFavorite = () => {
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
  const removeCompanyFromFavorite = (id) => {
    setChangeFavoriteLoading(true);

    dispatch(removeFavorite({ obj: { favoriteId: id }, token }))
      .then(unwrapResult)
      .then(() => {
        setChangeFavoriteLoading(false);
      })
      .catch(() => setChangeFavoriteLoading(false));
  };

  const handlePartnerRowPress = () => {
    dispatchCompanySelectedHandler();

    if (type === 'company') {
      navigation.navigate('Medicines', {
        screen: 'AllMedicines',
        params: {
          companyId: partner._id,
          warehouseId: null,
        },
      });
    }

    if (type === 'warehouse' && showWarehouseItem) {
      navigation.navigate('Medicines', {
        screen: 'AllMedicines',
        params: {
          companyId: null,
          warehouseId: partner._id,
        },
      });
    }
  };

  const dispatchCompanySelectedHandler = () => {
    // if the user type is pharmacy or normal, change the selectedCount
    // and selectedDates for this company
    if (type === 'company' && (user.type === UserTypeConstants.PHARMACY || user.type === UserTypeConstants.GUEST)) {
      dispatch(
        statisticsCompanySelected({
          obj: { companyId: partner._id },
          token,
        }),
      );
    }
  };

  return (
    <TouchableWithoutFeedback onPress={handlePartnerRowPress}>
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
                onPress={() => removeCompanyFromFavorite(partner._id)}
              />
            ) : (
              <AntDesign
                name="staro"
                size={24}
                color={Colors.YELLOW_COLOR}
                onPress={() => addCompanyToFavorite(partner._id)}
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
    borderColor: 'rgba(0, 0, 0, .1)',
  },

  title: {
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
    color: Colors.SECONDARY_COLOR,
    textAlign: 'center',
  },
  favoriteIcon: {},
});

export default PartnerRow;
