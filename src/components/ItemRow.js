import React, { memo, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { View, Text, StyleSheet, TouchableWithoutFeedback, ActivityIndicator } from 'react-native';

// redux stuff
import { unwrapResult } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';
import { selectUserData } from '../redux/auth/authSlice';
import { addFavoriteItem, removeFavoriteItem, selectFavoritesItems } from '../redux/favorites/favoritesSlice';
import { addStatistics } from '../redux/statistics/statisticsSlice';
import { addItemToWarehouse, removeItemFromWarehouse } from '../redux/medicines/medicinesSlices';

// constants
import {
  Colors,
  UserTypeConstants,
  checkItemExistsInWarehouse,
  checkOffer,
  checkPoints,
  LinearGradientColors,
} from '../utils/constants';

// icons
import { AntDesign, Ionicons } from '@expo/vector-icons';

// components
import CustomLinearGradient from './CustomLinearGradient';
import FilteredText from './FilteredText';
import ItemPrices from './ItemPrices';
import ItemNames from './ItemNames';

const ItemRow = ({ item, searchString, addToCart }) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  // selectors
  const { user, token } = useSelector(selectUserData);
  const favorites = useSelector(selectFavoritesItems);

  // own state
  const [changeFavoriteLoading, setChangeFavoriteLoading] = useState(false);
  const [changeAddToWarehouseLoading, setChangeAddToWarehouseLoading] = useState(false);

  const canAddToCart = user?.type === UserTypeConstants.PHARMACY && checkItemExistsInWarehouse(item, user);

  const isInWarehouse = item.warehouses
    .filter((w) => w.warehouse.isActive)
    .map((w) => w.warehouse._id)
    .includes(user._id);

  const isFavorite = favorites.map((favorite) => favorite._id).includes(item._id);

  // method to handle add company to user's favorite
  const addItemToFavoriteItems = () => {
    setChangeFavoriteLoading(true);

    dispatch(addFavoriteItem({ obj: { favoriteItemId: item._id }, token }))
      .then(unwrapResult)
      .then(() => {
        dispatch(
          addStatistics({
            obj: {
              sourceUser: user._id,
              targetItem: item._id,
              action: 'item-added-to-favorite',
            },
          }),
        );
        setChangeFavoriteLoading(false);
      })
      .catch(() => {
        setChangeFavoriteLoading(false);
      });
  };

  // method to handle remove company from user's favorite
  const removeItemFromFavoritesItems = () => {
    setChangeFavoriteLoading(true);
    dispatch(removeFavoriteItem({ obj: { favoriteItemId: item._id }, token }))
      .then(unwrapResult)
      .then(() => {
        setChangeFavoriteLoading(false);
      })
      .catch(() => {
        setChangeFavoriteLoading(false);
      });
  };

  // method to handle add item to warehouse
  const addItemToWarehouseHandler = () => {
    setChangeAddToWarehouseLoading(true);

    dispatch(
      addItemToWarehouse({
        obj: {
          itemId: item._id,
          warehouseId: user._id,
        },
        token,
      }),
    )
      .then(unwrapResult)
      .then(() => {
        setChangeAddToWarehouseLoading(false);
      })
      .catch(() => {
        setChangeAddToWarehouseLoading(false);
      });
  };

  const removeItemFromWarehouseHandler = () => {
    setChangeAddToWarehouseLoading(true);

    dispatch(
      removeItemFromWarehouse({
        obj: {
          itemId: item._id,
          warehouseId: user._id,
        },
        token,
      }),
    )
      .then(unwrapResult)
      .then(() => {
        setChangeAddToWarehouseLoading(false);
      })
      .catch(() => {
        setChangeAddToWarehouseLoading(false);
      });
  };

  const dispatchStatisticsHandler = () => {
    if (user.type === UserTypeConstants.PHARMACY || user.type === UserTypeConstants.GUEST) {
      dispatch(
        addStatistics({
          obj: {
            sourceUser: user._id,
            targetItem: item._id,
            action: 'choose-item',
          },
          token,
        }),
      );
    }
  };

  const hasOffer = checkOffer(item, user);
  const hasPoint = checkPoints(item, user);

  return user ? (
    <>
      <View
        style={{
          ...styles.container,
        }}
      >
        {hasOffer && hasPoint ? (
          <CustomLinearGradient colors={LinearGradientColors.OFFERS_POINTS} />
        ) : hasOffer ? (
          <CustomLinearGradient colors={LinearGradientColors.OFFERS} />
        ) : hasPoint ? (
          <CustomLinearGradient colors={LinearGradientColors.POINTS} />
        ) : undefined}

        <View style={{ padding: 5 }}>
          <View style={styles.header}>
            <TouchableWithoutFeedback
              onPress={() => {
                dispatchStatisticsHandler();
                navigation.navigate('ItemDetails', {
                  medicineId: item._id,
                });
              }}
            >
              <ItemNames item={item} searchString={searchString} />
            </TouchableWithoutFeedback>

            {canAddToCart && (
              <Ionicons
                name="cart"
                size={28}
                color={Colors.SUCCEEDED_COLOR}
                style={{ paddingHorizontal: 2 }}
                onPress={() => addToCart(item)}
              />
            )}

            {changeAddToWarehouseLoading ? (
              <ActivityIndicator size="small" color={Colors.YELLOW_COLOR} />
            ) : (
              user.type === UserTypeConstants.WAREHOUSE &&
              (isInWarehouse ? (
                <AntDesign
                  name="delete"
                  size={28}
                  color={Colors.FAILED_COLOR}
                  style={{ paddingHorizontal: 2 }}
                  onPress={removeItemFromWarehouseHandler}
                />
              ) : (
                <Ionicons
                  name="add-circle"
                  size={28}
                  color={Colors.SUCCEEDED_COLOR}
                  style={{ paddingHorizontal: 2 }}
                  onPress={addItemToWarehouseHandler}
                />
              ))
            )}

            {changeFavoriteLoading ? (
              <ActivityIndicator size="small" color={Colors.YELLOW_COLOR} />
            ) : isFavorite ? (
              <AntDesign
                name="star"
                size={28}
                color={Colors.YELLOW_COLOR}
                style={{ paddingHorizontal: 2 }}
                onPress={removeItemFromFavoritesItems}
              />
            ) : (
              <AntDesign
                name="staro"
                size={28}
                color={Colors.YELLOW_COLOR}
                style={{ paddingHorizontal: 2 }}
                onPress={addItemToFavoriteItems}
              />
            )}
          </View>

          <View style={styles.subHeader}>
            <View style={styles.fullWidth}>
              <Text style={styles.companyName}>{item.company.name}</Text>
            </View>
            <ItemPrices
              showPrice={user.type !== UserTypeConstants.GUEST}
              price={item.price}
              showCustomerPrice={true}
              customerPrice={item.customer_price}
            />
          </View>

          <View style={styles.subHeader}>
            <View style={styles.fullWidth}>
              <Text style={styles.caliber}>{item.caliber}</Text>
            </View>
          </View>

          <View style={styles.subHeader}>
            <View style={styles.fullWidth}>
              <FilteredText value={item.composition} searchText={searchString} style={styles.composition} />
            </View>
          </View>
        </View>
      </View>
    </>
  ) : null;
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    backgroundColor: Colors.WHITE_COLOR,
    borderBottomWidth: 1,
    borderBottomColor: '#e3e3e3',
    width: '100%',
    marginBottom: 5,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginBottom: 10,
  },
  fullWidth: {
    flex: 1,
    writingDirection: 'rtl',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  subHeader: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },

  title: {
    fontWeight: 'bold',
    color: Colors.DARK_COLOR,
    writingDirection: 'rtl',
    paddingHorizontal: 5,
  },
  companyName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.SUCCEEDED_COLOR,
  },
  caliber: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.LIGHT_COLOR,
  },
  composition: {
    fontSize: 14,
    color: Colors.BLUE_COLOR,
  },
  filterResult: {
    backgroundColor: '#FCDA00',
    color: '#FF0000',
    borderRadius: 4,
    fontWeight: 'bold',
  },
});

export default memo(ItemRow);
