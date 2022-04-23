import React, { memo, useState } from 'react';
import { useNavigation } from '@react-navigation/core';

import { View, Text, StyleSheet, TouchableWithoutFeedback, ActivityIndicator } from 'react-native';

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
import SwipeableRow from './SwipeableRow';

// if logged user is
// 1- ADMIN: highlight the row by green color if the medicine has an offer.
// 2- COMPANY: don't highlight the row never.
// 3- GUEST: don't highlight the row never.
// 4- WAREHOUSE: highlight the row by green if the medicine has an offer by logging warehouse.
// 5- PHARMACY: highlight the row by green if the medicine has an offer by any warehouse
// in the same city with the logging user
const checkOffer = (item, user) => {
  if (user?.type === UserTypeConstants.GUEST || user.type === UserTypeConstants.COMPANY) {
    return false;
  }

  let result = false;

  if (user?.type === UserTypeConstants.ADMIN) {
    item.warehouses.forEach((w) => {
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
    item.warehouses.forEach((w) => {
      if (w.warehouse.city === user.city && w.offer.offers.length > 0) {
        result = true;
      }
    });
  }

  return result;
};

const ItemCard = ({ item, advertisement }) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { user, token } = useSelector(selectUserData);
  const favorites = useSelector(selectFavoritesItems);

  const [expanded, setExpanded] = useState(false);
  const [changeFavoriteLoading, setChangeFavoriteLoading] = useState(false);
  const [changeAddToWarehouseLoading, setChangeAddToWarehouseLoading] = useState(false);

  const canAddToCart = user?.type === UserTypeConstants.PHARMACY && checkItemExistsInWarehouse(item, user);
  const isInWarehouse = item.warehouses.map((w) => w.warehouse._id).includes(user._id);
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

  return user ? (
    <SwipeableRow
      user={user}
      addItemToWarehouse={addItemToWarehouseHandler}
      removeItemFromWarehouse={removeItemFromWarehouseHandler}
      addItemToFavorite={addItemToFavoriteItems}
      removeItemFromFavorite={removeItemFromFavoritesItems}
      canAddToCart={canAddToCart}
      isInWarehouse={isInWarehouse}
      isFavorite={isFavorite}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          {expanded ? (
            <AntDesign
              name="caretup"
              size={20}
              color={Colors.MAIN_COLOR}
              onPress={() => {
                setExpanded(!expanded);
              }}
            />
          ) : (
            <AntDesign
              name="caretdown"
              size={20}
              color={Colors.MAIN_COLOR}
              onPress={() => {
                setExpanded(!expanded);
              }}
            />
          )}
          <TouchableWithoutFeedback
            onPress={() => {
              dispatchStatisticsHandler();
              navigation.navigate('Medicines', {
                screen: 'Medicine',
                params: {
                  medicineId: item._id,
                },
              });
            }}
          >
            <View style={styles.fullWidth}>
              <Text style={{ ...styles.title, fontSize: item.name.length < 25 ? 14 : 12 }}>{item.name}</Text>
            </View>
          </TouchableWithoutFeedback>

          {canAddToCart && (
            <Ionicons name="cart" size={24} color={Colors.SUCCEEDED_COLOR} style={{ paddingHorizontal: 2 }} />
          )}

          {changeAddToWarehouseLoading ? (
            <ActivityIndicator size="small" color={Colors.YELLOW_COLOR} />
          ) : (
            user.type === UserTypeConstants.WAREHOUSE &&
            (isInWarehouse ? (
              <AntDesign
                name="delete"
                size={24}
                color={Colors.FAILED_COLOR}
                style={{ paddingHorizontal: 2 }}
                onPress={removeItemFromWarehouseHandler}
              />
            ) : (
              <Ionicons
                name="add-circle"
                size={24}
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
              size={24}
              color={Colors.YELLOW_COLOR}
              style={{ paddingHorizontal: 2 }}
              onPress={removeItemFromFavoritesItems}
            />
          ) : (
            <AntDesign
              name="staro"
              size={24}
              color={Colors.YELLOW_COLOR}
              style={{ paddingHorizontal: 2 }}
              onPress={addItemToFavoriteItems}
            />
          )}
        </View>
        <View style={styles.subHeader}>
          <View style={styles.fullWidth}>
            <Text style={styles.company}>{item.company.name}</Text>
          </View>
          <Text style={{ ...styles.priceValue, color: Colors.SUCCEEDED_COLOR }}>{item.price}</Text>
          <Text style={{ ...styles.priceValue, color: Colors.FAILED_COLOR }}>{item.customer_price}</Text>
        </View>
        {expanded && (
          <View>
            <View style={styles.separator}></View>
            <View style={{ ...styles.fullWidth, ...styles.moreData }}>
              {item.packing ? <Text style={styles.moreDataText}>{item.packing}</Text> : null}
              {item.caliber ? <Text style={styles.moreDataText}>{item.caliber}</Text> : null}
              {item.composition ? (
                <Text style={styles.moreDataText}>{item.composition?.split('+').join(' ')}</Text>
              ) : null}
            </View>
          </View>
        )}
      </View>
    </SwipeableRow>
  ) : null;
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    padding: 5,
    // marginBottom: 10,
    backgroundColor: Colors.WHITE_COLOR,
    // borderRadius: 12,
    // shadowColor: Colors.MAIN_COLOR,
    // shadowOffset: {
    //   width: 0,
    //   height: 0,
    // },
    // shadowOpacity: 1,
    // shadowRadius: 9.51,
    // elevation: 5,
    // borderWidth: 1,
    //   borderColor: Colors.SECONDARY_COLOR,
    borderBottomWidth: 1,
    borderBottomColor: Colors.SECONDARY_COLOR,
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
  },
  subHeader: {
    flexDirection: 'row',
  },
  separator: {
    height: 1,
    width: '100%',
    backgroundColor: Colors.SECONDARY_COLOR,
    marginVertical: 10,
  },
  priceValue: {
    fontSize: 12,
    paddingHorizontal: 6,
  },
  title: {
    fontWeight: '700',
    color: Colors.MAIN_COLOR,
    writingDirection: 'rtl',
    paddingHorizontal: 5,
  },
  company: {
    fontSize: 12,
    color: Colors.GREY_COLOR,
    marginStart: 20,
  },
  moreData: {
    flexDirection: 'column',
  },
  moreDataText: {
    color: Colors.SECONDARY_COLOR,
    fontSize: 12,
    marginBottom: 3,
    marginStart: 10,
    flexWrap: 'wrap',
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
});

export default memo(ItemCard);
