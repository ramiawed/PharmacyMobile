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
import { addSavedItem, removeSavedItem, selectSavedItems } from '../redux/savedItems/savedItemsSlice';

// constants
import { Colors, UserTypeConstants, checkItemExistsInWarehouse } from '../utils/constants';

// icons
import { AntDesign, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

// components
import SwipeableRow from './SwipeableRow';
import i18n from 'i18n-js';

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

const ItemCard = ({ item, addToCart }) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  // selectors
  const { user, token } = useSelector(selectUserData);
  const favorites = useSelector(selectFavoritesItems);
  const { savedItems } = useSelector(selectSavedItems);

  // own state
  const [expanded, setExpanded] = useState(false);
  const [changeFavoriteLoading, setChangeFavoriteLoading] = useState(false);
  const [changeAddToWarehouseLoading, setChangeAddToWarehouseLoading] = useState(false);
  const [changeSaveItemLoading, setChangeSaveItemLoading] = useState(false);

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

  const addToCartHandler = (item) => {
    addToCart(item);
  };

  const addItemToSavedItemsHandler = (e) => {
    setChangeSaveItemLoading(true);

    dispatch(addSavedItem({ obj: { savedItemId: item._id }, token }))
      .then(unwrapResult)
      .then(() => {
        setChangeSaveItemLoading(false);
      })
      .catch(() => {
        setChangeSaveItemLoading(false);
      });
  };

  const removeItemFromSavedItemsHandler = (e) => {
    setChangeSaveItemLoading(true);

    dispatch(removeSavedItem({ obj: { savedItemId: item._id }, token }))
      .then(unwrapResult)
      .then(() => {
        setChangeSaveItemLoading(false);
      })
      .catch(() => {
        setChangeSaveItemLoading(false);
      });
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
      addToCart={() => addToCartHandler(item)}
      item={item}
    >
      <View
        style={{
          ...styles.container,
          backgroundColor: checkOffer(item, user) ? Colors.OFFER_COLOR : Colors.WHITE_COLOR,
        }}
      >
        <View style={{ flexDirection: 'row' }}>
          <View style={{ flex: 1, justifyContent: 'space-between' }}>
            <View style={{ flexDirection: 'row' }}>
              {expanded ? (
                <AntDesign
                  name="caretup"
                  size={24}
                  color={Colors.MAIN_COLOR}
                  onPress={() => {
                    setExpanded(!expanded);
                  }}
                />
              ) : (
                <AntDesign
                  name="caretdown"
                  size={24}
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
                  <Text
                    style={{ ...styles.title, fontSize: item.name.length >= 35 ? 14 : item.name.length > 25 ? 14 : 18 }}
                  >
                    {item.name}
                  </Text>
                </View>
              </TouchableWithoutFeedback>
            </View>
            {item.nameAr?.length > 0 ? (
              <View style={styles.subHeader}>
                <View style={styles.fullWidth}>
                  <Text
                    style={{
                      ...styles.nameAr,
                      fontSize: item.nameAr.length >= 35 ? 14 : item.nameAr.length > 25 ? 14 : 18,
                    }}
                  >
                    {item.nameAr}
                  </Text>
                </View>
              </View>
            ) : (
              <View style={{ height: 5 }}></View>
            )}

            <View style={styles.subHeader}>
              <View style={styles.fullWidth}>
                <Text style={styles.companyName}>{item.company.name}</Text>
              </View>
              {user.type !== UserTypeConstants.GUEST && (
                <Text style={{ ...styles.priceValue, color: Colors.SUCCEEDED_COLOR }}>{item.price}</Text>
              )}
              <Text style={{ ...styles.priceValue, color: Colors.FAILED_COLOR }}>{item.customer_price}</Text>
            </View>
          </View>

          <View style={styles.actionsView}>
            {user?.type === UserTypeConstants.PHARMACY ? (
              checkItemExistsInWarehouse(item, user) ? (
                <Ionicons
                  name="cart"
                  size={32}
                  color={Colors.SUCCEEDED_COLOR}
                  style={{ paddingHorizontal: 2, marginVertical: 4 }}
                  onPress={() => addToCart(item)}
                />
              ) : changeSaveItemLoading ? (
                <ActivityIndicator size="small" color={Colors.YELLOW_COLOR} />
              ) : savedItems.map((si) => si._id).includes(item._id) ? (
                <MaterialCommunityIcons
                  name="bookmark-minus"
                  size={32}
                  color={Colors.FAILED_COLOR}
                  style={{ paddingHorizontal: 2, marginVertical: 4 }}
                  onPress={removeItemFromSavedItemsHandler}
                />
              ) : (
                <MaterialCommunityIcons
                  name="bookmark-plus"
                  size={32}
                  color={Colors.SUCCEEDED_COLOR}
                  style={{ paddingHorizontal: 2, marginVertical: 4 }}
                  onPress={addItemToSavedItemsHandler}
                />
              )
            ) : (
              <></>
            )}

            {changeFavoriteLoading ? (
              <ActivityIndicator size="small" color={Colors.YELLOW_COLOR} />
            ) : isFavorite ? (
              <AntDesign
                name="star"
                size={32}
                color={Colors.YELLOW_COLOR}
                style={{ paddingHorizontal: 2, marginVertical: 4 }}
                onPress={removeItemFromFavoritesItems}
              />
            ) : (
              <AntDesign
                name="staro"
                size={32}
                color={Colors.YELLOW_COLOR}
                style={{ paddingHorizontal: 2, marginVertical: 4 }}
                onPress={addItemToFavoriteItems}
              />
            )}

            {changeAddToWarehouseLoading ? (
              <ActivityIndicator size="small" color={Colors.YELLOW_COLOR} />
            ) : (
              user.type === UserTypeConstants.WAREHOUSE &&
              (isInWarehouse ? (
                <AntDesign
                  name="delete"
                  size={32}
                  color={Colors.FAILED_COLOR}
                  style={{ paddingHorizontal: 2, marginVertical: 4 }}
                  onPress={removeItemFromWarehouseHandler}
                />
              ) : (
                <Ionicons
                  name="add-circle"
                  size={32}
                  color={Colors.SUCCEEDED_COLOR}
                  style={{ paddingHorizontal: 2, marginVertical: 4 }}
                  onPress={addItemToWarehouseHandler}
                />
              ))
            )}
          </View>
        </View>

        {expanded && (
          <View>
            <View style={styles.separator}></View>
            <View style={{ ...styles.fullWidth, ...styles.moreData }}>
              {item.packing ? (
                <Text style={styles.moreDataText}>
                  {i18n.t('item-packing')}: {item.packing}
                </Text>
              ) : null}
              {item.caliber ? (
                <Text style={styles.moreDataText}>
                  {i18n.t('item-caliber')}: {item.caliber}
                </Text>
              ) : null}
              {item.composition ? (
                <Text style={styles.moreDataText}>
                  {i18n.t('item-composition')}: {item.composition?.split('+').join(' ')}
                </Text>
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
    margin: 5,
    backgroundColor: Colors.WHITE_COLOR,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e3e3e3',
    width: '95%',
  },
  nameAr: {
    fontWeight: '700',
    color: Colors.MAIN_COLOR,
    writingDirection: 'rtl',
    paddingHorizontal: 5,
    marginStart: 20,
    marginVertical: 5,
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
    fontSize: 14,
    paddingHorizontal: 6,
  },
  title: {
    fontWeight: '700',
    color: Colors.MAIN_COLOR,
    writingDirection: 'rtl',
    paddingHorizontal: 5,
  },
  companyName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.SUCCEEDED_COLOR,
    marginStart: 25,
  },
  moreData: {
    flexDirection: 'column',
  },
  moreDataText: {
    color: Colors.GREY_COLOR,
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 3,
    marginStart: 10,
    flexWrap: 'wrap',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    textAlign: 'left',
  },
  actionsView: {
    justifyContent: 'space-evenly',
    borderStartColor: '#e3e3e3',
    borderStartWidth: 1,
    paddingStart: 5,
  },
});

export default memo(ItemCard);
