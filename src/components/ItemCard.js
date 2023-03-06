import React, { memo, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { View, Text, StyleSheet, TouchableWithoutFeedback, ActivityIndicator, Platform, UIManager } from 'react-native';

// redux stuff
import { unwrapResult } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';
import { addFavoriteItem, removeFavoriteItem, selectFavoritesItems } from '../redux/favorites/favoritesSlice';
import { addSavedItem, removeSavedItem, selectSavedItems } from '../redux/savedItems/savedItemsSlice';
import { addItemToWarehouse, removeItemFromWarehouse } from '../redux/medicines/medicinesSlices';
import { addStatistics } from '../redux/statistics/statisticsSlice';
import { selectUserData } from '../redux/auth/authSlice';

// constants
import { Colors, UserTypeConstants, checkItemExistsInWarehouse } from '../utils/constants';

// icons
import { AntDesign, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

// components
import SwipeableRow from './SwipeableRow';
import FilteredText from './FilteredText';
import ItemPrices from './ItemPrices';
import ItemNames from './ItemNames';

if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

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

const ItemCard = ({ item, addToCart, searchString }) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  // selectors
  const { user, token } = useSelector(selectUserData);
  const favorites = useSelector(selectFavoritesItems);
  const { savedItems } = useSelector(selectSavedItems);

  // own state
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
        <View style={styles.contentView}>
          <TouchableWithoutFeedback
            onPress={() => {
              dispatchStatisticsHandler();
              navigation.navigate('ItemDetails', {
                medicineId: item._id,
              });
            }}
          >
            <View>
              <View style={styles.row}>
                <ItemNames item={item} searchString={searchString} />
                <View style={styles.actionsView}>
                  {changeAddToWarehouseLoading ? (
                    <View>
                      <ActivityIndicator size="small" color={Colors.YELLOW_COLOR} />
                    </View>
                  ) : (
                    user.type === UserTypeConstants.WAREHOUSE && (
                      <View>
                        {isInWarehouse ? (
                          <AntDesign
                            name="delete"
                            size={28}
                            color={Colors.FAILED_COLOR}
                            style={{ paddingHorizontal: 2, marginVertical: 4 }}
                            onPress={removeItemFromWarehouseHandler}
                          />
                        ) : (
                          <Ionicons
                            name="add-circle"
                            size={28}
                            color={Colors.SUCCEEDED_COLOR}
                            style={{ paddingHorizontal: 2, marginVertical: 4 }}
                            onPress={addItemToWarehouseHandler}
                          />
                        )}
                      </View>
                    )
                  )}
                  {user?.type === UserTypeConstants.PHARMACY ? (
                    checkItemExistsInWarehouse(item, user) ? (
                      <View>
                        <Ionicons
                          name="cart"
                          size={28}
                          color={Colors.SUCCEEDED_COLOR}
                          style={{ paddingHorizontal: 2, marginVertical: 4 }}
                          onPress={() => addToCart(item)}
                        />
                      </View>
                    ) : changeSaveItemLoading ? (
                      <View>
                        <ActivityIndicator size="small" color={Colors.YELLOW_COLOR} />
                      </View>
                    ) : savedItems.map((si) => si._id).includes(item._id) ? (
                      <View>
                        <MaterialCommunityIcons
                          name="bookmark-minus"
                          size={28}
                          color={Colors.FAILED_COLOR}
                          style={{ paddingHorizontal: 2, marginVertical: 4 }}
                          onPress={removeItemFromSavedItemsHandler}
                        />
                      </View>
                    ) : (
                      <View>
                        <MaterialCommunityIcons
                          name="bookmark-plus"
                          size={28}
                          color={Colors.SUCCEEDED_COLOR}
                          style={{ paddingHorizontal: 2, marginVertical: 4 }}
                          onPress={addItemToSavedItemsHandler}
                        />
                      </View>
                    )
                  ) : (
                    <></>
                  )}
                  {changeFavoriteLoading ? (
                    <View style={{ ...styles.actionIcon, ...styles.favIcon }}>
                      <ActivityIndicator size="small" color={Colors.YELLOW_COLOR} />
                    </View>
                  ) : (
                    <View style={{ ...styles.actionIcon, ...styles.favIcon }}>
                      {isFavorite ? (
                        <AntDesign
                          name="star"
                          size={28}
                          color={Colors.YELLOW_COLOR}
                          style={{ paddingHorizontal: 2, marginVertical: 4 }}
                          onPress={removeItemFromFavoritesItems}
                        />
                      ) : (
                        <AntDesign
                          name="staro"
                          size={28}
                          color={Colors.YELLOW_COLOR}
                          style={{ paddingHorizontal: 2, marginVertical: 4 }}
                          onPress={addItemToFavoriteItems}
                        />
                      )}
                    </View>
                  )}
                </View>
              </View>

              <View style={{ ...styles.row, marginVertical: 4, alignItems: 'center' }}>
                <Text style={styles.companyName}>{item.company.name}</Text>
                <ItemPrices
                  price={item.price}
                  customerPrice={item.customer_price}
                  showCustomerPrice={user.type !== UserTypeConstants.GUEST}
                  showPrice={true}
                />
              </View>

              {item.composition?.length > 0 ? (
                <FilteredText
                  searchText={searchString}
                  value={item.composition.replaceAll('+', ' ')}
                  style={styles.composition}
                />
              ) : (
                <></>
              )}
            </View>
          </TouchableWithoutFeedback>
        </View>
      </View>
    </SwipeableRow>
  ) : null;
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 5,
    margin: 5,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.LIGHT_GREY_COLOR,
  },
  row: {
    flexDirection: 'row',
  },
  companyName: {
    flex: 1,
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.SUCCEEDED_COLOR,
  },
  composition: {
    flex: 1,
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.BLUE_COLOR,
    alignItems: 'flex-start',
    textAlign: 'center',
  },
  contentView: {
    flex: 1,
  },
  actionsView: {
    alignItems: 'center',
  },
});

export default memo(ItemCard);
