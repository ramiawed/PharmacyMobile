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
import { t } from 'i18n-js';
import i18n from '../i18n';

const SPACING = 10;

const WarehouseCard = ({ warehouse }) => {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const { token, user } = useSelector(selectUserData);
  const favorites = useSelector(selectFavoritesPartners);
  const {
    settings: { showWarehouseItem },
  } = useSelector(selectSettings);

  const [changeFavoriteLoading, setChangeFavoriteLoading] = useState(false);

  const allowShowingWarehouseMedicines =
    user.type === UserTypeConstants.ADMIN ||
    warehouse.type === UserTypeConstants.COMPANY ||
    (warehouse.type === UserTypeConstants.WAREHOUSE && showWarehouseItem && warehouse.allowShowingMedicines);

  // method to handle add company to user's favorite
  const addWarehouseToFavorites = () => {
    setChangeFavoriteLoading(true);

    dispatch(addFavorite({ obj: { favoriteId: warehouse._id }, token }))
      .then(unwrapResult)
      .then(() => {
        setChangeFavoriteLoading(false);
        dispatch(
          addStatistics({
            obj: {
              sourceUser: user._id,
              targetUser: warehouse._id,
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
  const removeWarehouseFromFavorites = (id) => {
    setChangeFavoriteLoading(true);

    dispatch(removeFavorite({ obj: { favoriteId: id }, token }))
      .then(unwrapResult)
      .then(() => {
        setChangeFavoriteLoading(false);
      })
      .catch(() => setChangeFavoriteLoading(false));
  };

  const dispatchWarehouseSelected = () => {
    if (
      warehouse.type === UserTypeConstants.WAREHOUSE &&
      (user.type === UserTypeConstants.WAREHOUSE ||
        user.type === UserTypeConstants.COMPANY ||
        user.type === UserTypeConstants.GUEST)
    ) {
      return;
    }

    if (allowShowingWarehouseMedicines) {
      dispatch(resetMedicines());

      if (warehouse.type === UserTypeConstants.COMPANY) {
        dispatch(setSearchCompanyId(warehouse._id));
      }

      if (warehouse.type === UserTypeConstants.WAREHOUSE) {
        dispatch(setSearchWarehouseId(warehouse._id));
      }

      if (warehouse.type === UserTypeConstants.WAREHOUSE && user.type === UserTypeConstants.PHARMACY) {
        dispatch(setSelectedWarehouse(warehouse._id));
      } else {
        dispatch(setSelectedWarehouse(null));
      }

      navigation.navigate('Items', {
        myCompanies: warehouse.ourCompanies,
      });
    }
  };

  return (
    <TouchableWithoutFeedback onPress={dispatchWarehouseSelected}>
      <Animated.View
        style={{
          ...styles.animatedView,
        }}
      >
        <TouchableWithoutFeedback>
          <View style={styles.favoriteIcon}>
            {changeFavoriteLoading ? (
              <ActivityIndicator size="small" color={Colors.YELLOW_COLOR} />
            ) : favorites && favorites.map((favorite) => favorite._id).includes(warehouse?._id) ? (
              <AntDesign
                name="star"
                size={24}
                color={Colors.YELLOW_COLOR}
                onPress={() => removeWarehouseFromFavorites(warehouse._id)}
              />
            ) : (
              <AntDesign
                name="staro"
                size={24}
                color={Colors.YELLOW_COLOR}
                onPress={() => addWarehouseToFavorites(warehouse._id)}
              />
            )}
          </View>
        </TouchableWithoutFeedback>

        <View>
          {warehouse.logo_url && warehouse.logo_url.length !== 0 ? (
            <Image source={{ uri: `${SERVER_URL}/profiles/${warehouse.logo_url}` }} style={styles.logo} />
          ) : (
            <Image source={require('../../assets/logo.png')} style={styles.logo} />
          )}
        </View>
        <View style={styles.contentView}>
          <Text
            style={{
              ...styles.title,
            }}
          >
            {warehouse.name}
          </Text>
          {user.type === UserTypeConstants.PHARMACY && warehouse.pointForAmount ? (
            <Text style={styles.pointHint}>
              {i18n.t('number of points that you get when buy from warehouse')} {i18n.t('every')}{' '}
              {warehouse.amountToGetPoint} {i18n.t('get points')} {warehouse.pointForAmount} {i18n.t('point')}
            </Text>
          ) : (
            <></>
          )}

          {warehouse.fastDeliver && (
            <View style={styles.fastDeliverView}>
              <Image
                source={require('../../assets/small-logo.png')}
                style={{ width: 24, height: 24, marginHorizontal: 10 }}
              />
              <Text style={{ color: Colors.SUCCEEDED_COLOR, fontWeight: 'bold' }}>{t('fast-deliver')}</Text>
            </View>
          )}
        </View>
      </Animated.View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  animatedView: {
    flexDirection: 'row',
    alignItems: 'center',
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
    elevation: 10,
    justifyContent: 'flex-start',
    paddingVertical: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.MAIN_COLOR,
    flexWrap: 'wrap',
    textAlign: 'center',
  },
  pointHint: {
    color: Colors.BLUE_COLOR,
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  favoriteIcon: {
    position: 'absolute',
    top: 5,
    right: 5,
  },
  logo: {
    width: 85,
    height: 85,
    marginHorizontal: 5,
    borderRadius: 12,
    resizeMode: 'contain',
  },
  contentView: {
    flex: 1,
  },
  fastDeliverView: {
    flexDirection: 'row',
    marginTop: 10,
  },
});

export default WarehouseCard;
