import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableWithoutFeedback, Animated, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';

// icons
import { AntDesign } from '@expo/vector-icons';

// redux stuff
import { unwrapResult } from '@reduxjs/toolkit';
import { resetMedicines, setSearchWarehouseId, setSearchCompanyId } from '../redux/medicines/medicinesSlices';
import { useDispatch, useSelector } from 'react-redux';
import { addFavorite, removeFavorite, selectFavoritesPartners } from '../redux/favorites/favoritesSlice';
import { addStatistics } from '../redux/statistics/statisticsSlice';
import { selectUserData } from '../redux/auth/authSlice';
import { setSelectedWarehouse } from '../redux/warehouse/warehousesSlice';
import { selectSettings } from '../redux/settings/settingsSlice';

// constants
import { Colors, UserTypeConstants, SERVER_URL } from '../utils/constants';

const SPACING = 20;

const PartnerCard = ({ partner, advertisement }) => {
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
        dispatch(
          addStatistics({
            obj: {
              sourceUser: user._id,
              targetUser: partner._id,
              action: 'user-added-to-favorite',
            },
            token,
          }),
        );
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
    });
  };

  return (
    <TouchableWithoutFeedback onPress={dispatchPartnerSelected}>
      <Animated.View
        style={{
          ...styles.animatedView,
          flex: 1,
          marginHorizontal: 4,
        }}
      >
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
        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
          {partner.logo_url && partner.logo_url.length !== 0 ? (
            <Image
              source={{ uri: `${SERVER_URL}/profiles/${partner.logo_url}` }}
              style={advertisement ? styles.logoLarge : styles.logo}
            />
          ) : (
            <Image source={require('../../assets/logo.png')} style={advertisement ? styles.logoLarge : styles.logo} />
          )}
        </View>

        <View>
          <Text style={styles.title}>{partner.name}</Text>
        </View>
      </Animated.View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  animatedView: {
    padding: 10,
    marginBottom: SPACING,
    backgroundColor: 'rgba(255,255,255, 1)',
    borderRadius: 12,
    shadowColor: Colors.SECONDARY_COLOR,
    shadowOffset: {
      width: 0,
      height: 7,
    },
    shadowOpacity: 0.43,
    shadowRadius: 9.51,

    elevation: 25,

    minHeight: 200,
    justifyContent: 'flex-start',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.MAIN_COLOR,
    textAlign: 'center',
  },
  favoriteIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  logo: {
    width: 120,
    height: 100,
    borderRadius: 12,
    resizeMode: 'contain',
    marginVertical: 5,
  },
  logoLarge: {
    width: 130,
    height: 130,
    borderRadius: 12,
    resizeMode: 'contain',
    marginVertical: 5,
  },
});

export default PartnerCard;
