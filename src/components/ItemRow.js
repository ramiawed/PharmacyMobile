import React, { memo, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { View, Text, StyleSheet, TouchableWithoutFeedback, ActivityIndicator } from 'react-native';

// libraries
import { BottomSheet } from 'react-native-btr';

// redux stuff
import { unwrapResult } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';
import { selectUserData } from '../redux/auth/authSlice';
import { addFavoriteItem, removeFavoriteItem, selectFavoritesItems } from '../redux/favorites/favoritesSlice';
import { addStatistics } from '../redux/statistics/statisticsSlice';
import { addItemToWarehouse, removeItemFromWarehouse } from '../redux/medicines/medicinesSlices';

// constants
import { Colors, UserTypeConstants, checkItemExistsInWarehouse } from '../utils/constants';

// icons
import { AntDesign, Ionicons } from '@expo/vector-icons';

// components
import SwipeableRow from './SwipeableRow';
import AddToCart from './AddToCart';

// if logged user is
// 1- ADMIN: highlight the row by green color if the medicine has an offer.
// 2- COMPANY: don't highlight the row never.
// 3- GUEST: don't highlight the row never.
// 4- WAREHOUSE: highlight the row by green if the medicine has an offer by logging warehouse.
// 5- PHARMACY: highlight the row by green if the medicine has an offer by any warehouse
// in the same city with the logging user
const checkOffer = (item, user) => {
  if (user.type === UserTypeConstants.GUEST || user.type === UserTypeConstants.COMPANY) {
    return false;
  }

  let result = false;

  if (user?.type === UserTypeConstants.ADMIN) {
    item.warehouses
      .filter((w) => w.warehouse.isActive)
      .forEach((w) => {
        if (w.offer.offers.length > 0) {
          result = true;
        }
      });
  }

  if (user?.type === UserTypeConstants.WAREHOUSE) {
    item.warehouses
      .filter((w) => w.warehouse._id === user._id)
      .forEach((w) => {
        if (w.offer.offers.length > 0) {
          result = true;
        }
      });
  }

  if (user?.type === UserTypeConstants.PHARMACY) {
    item.warehouses
      .filter((w) => w.warehouse.isActive)
      .forEach((w) => {
        if (w.warehouse.city === user.city && w.offer.offers.length > 0) {
          result = true;
        }
      });
  }

  return result;
};

const ItemRow = ({ item, searchString }) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  // selectors
  const { user, token } = useSelector(selectUserData);
  const favorites = useSelector(selectFavoritesItems);

  // own state
  const [changeFavoriteLoading, setChangeFavoriteLoading] = useState(false);
  const [changeAddToWarehouseLoading, setChangeAddToWarehouseLoading] = useState(false);
  const [showAddToCartModal, setShowAddToCartModal] = useState(false);

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

  const itemNameArraySplit = searchString
    ? item.name.toLowerCase().includes(searchString.toLowerCase())
      ? item.name.toLowerCase().split(searchString.toLowerCase())
      : []
    : [];

  const itemNameArArraySplit = searchString
    ? item.nameAr.toLowerCase().includes(searchString.toLowerCase())
      ? item.nameAr.toLowerCase().split(searchString.toLowerCase())
      : []
    : [];

  const itemCompositionArraySplit = searchString
    ? item.composition.toLowerCase().includes(searchString.toLowerCase())
      ? item.composition.toLowerCase().split(searchString.toLowerCase())
      : []
    : [];

  return user ? (
    <>
      <View
        style={{
          ...styles.container,
          backgroundColor: checkOffer(item, user) ? Colors.OFFER_COLOR : Colors.WHITE_COLOR,
        }}
      >
        <View style={styles.header}>
          <TouchableWithoutFeedback
            onPress={() => {
              dispatchStatisticsHandler();
              navigation.navigate('ItemDetails', {
                medicineId: item._id,
              });
            }}
          >
            <View style={styles.fullWidth}>
              {itemNameArraySplit.length > 0 ? (
                <Text
                  style={{
                    ...styles.title,
                    fontSize: item.name.length < 25 ? 14 : 14,
                  }}
                >
                  {itemNameArraySplit[0].toUpperCase()}
                  <Text
                    style={{
                      ...styles.filterResult,
                    }}
                  >
                    {searchString.toUpperCase()}
                  </Text>
                  {itemNameArraySplit[1].toUpperCase()}
                </Text>
              ) : (
                <Text
                  style={{
                    ...styles.title,
                    fontSize: item.name.length < 25 ? 14 : 14,
                  }}
                >
                  {item.name}
                </Text>
              )}
            </View>
          </TouchableWithoutFeedback>

          {canAddToCart && (
            <Ionicons
              name="cart"
              size={28}
              color={Colors.SUCCEEDED_COLOR}
              style={{ paddingHorizontal: 2 }}
              onPress={() => setShowAddToCartModal(true)}
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

        <View style={styles.fullWidth}>
          {itemNameArArraySplit.length > 0 ? (
            <Text
              style={{
                ...styles.title,
                fontSize: item.name.length < 25 ? 14 : 14,
              }}
            >
              {itemNameArArraySplit[0]}
              <Text
                style={{
                  ...styles.filterResult,
                }}
              >
                {searchString}
              </Text>
              {itemNameArArraySplit[1]}
            </Text>
          ) : (
            <Text
              style={{
                ...styles.title,
                fontSize: item.name.length < 25 ? 14 : 14,
              }}
            >
              {item.nameAr}
            </Text>
          )}
        </View>

        <View style={styles.subHeader}>
          <View style={styles.fullWidth}>
            <Text style={styles.companyName}>{item.company.name}</Text>
          </View>
          {user.type !== UserTypeConstants.GUEST && (
            <Text style={{ ...styles.priceValue, color: Colors.SUCCEEDED_COLOR }}>{item.price}</Text>
          )}
          <Text style={{ ...styles.priceValue, color: Colors.FAILED_COLOR }}>{item.customer_price}</Text>
        </View>
        <View style={styles.subHeader}>
          <View style={styles.fullWidth}>
            <Text style={styles.caliber}>{item.caliber}</Text>
          </View>
        </View>
        <View style={styles.subHeader}>
          <View style={styles.fullWidth}>
            {itemCompositionArraySplit.length > 0 ? (
              <Text style={styles.composition}>
                {itemCompositionArraySplit[0]}
                <Text
                  style={{
                    ...styles.filterResult,
                  }}
                >
                  {searchString}
                </Text>
                {itemCompositionArraySplit[1]}
              </Text>
            ) : (
              <Text style={styles.composition}>{item.composition.split('+').join(' ')}</Text>
            )}
          </View>
        </View>
      </View>
      <BottomSheet
        visible={showAddToCartModal}
        onBackButtonPress={() => setShowAddToCartModal(false)}
        onBackdropPress={() => setShowAddToCartModal(false)}
      >
        <AddToCart item={item} close={() => setShowAddToCartModal(false)} />
      </BottomSheet>
    </>
  ) : null;
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    padding: 5,
    backgroundColor: Colors.WHITE_COLOR,
    borderBottomWidth: 1,
    borderBottomColor: '#e3e3e3',
    width: '100%',
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
  priceValue: {
    fontSize: 14,
    fontWeight: 'bold',
    paddingHorizontal: 6,
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
