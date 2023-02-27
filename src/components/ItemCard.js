import React, { memo, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import {
  View,
  Text,
  StyleSheet,
  TouchableWithoutFeedback,
  ActivityIndicator,
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native';

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

  // const changeExpandedStatus = () => {
  //   LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
  //   setExpanded(!expanded);
  // };

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
            <View style={{ justifyContent: 'space-between', flex: 1 }}>
              <View style={styles.fullWidth}>
                {itemNameArraySplit.length > 0 ? (
                  <Text
                    style={{
                      ...styles.title,
                      color: Colors.DARK_COLOR,
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
                      color: Colors.DARK_COLOR,
                      fontSize: item.name.length < 25 ? 14 : 14,
                    }}
                  >
                    {item.name}
                  </Text>
                )}
                {/* <Text
                  style={{
                    ...styles.title,
                    color: Colors.DARK_COLOR,
                    fontSize: item.name.length >= 35 ? 18 : item.name.length > 25 ? 18 : 18,
                  }}
                >
                  {item.name}
                </Text> */}
              </View>

              {item.nameAr?.length > 0 ? (
                <View style={styles.fullWidth}>
                  <Text
                    style={{
                      ...styles.nameAr,
                      color: Colors.LIGHT_COLOR,
                      fontSize: item.nameAr.length >= 35 ? 16 : item.nameAr.length > 25 ? 16 : 16,
                    }}
                  >
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
                  </Text>
                </View>
              ) : (
                <View style={{ height: 5 }}></View>
              )}

              <View style={styles.row}>
                <View style={styles.fullWidth}>
                  <Text style={styles.companyName}>{item.company.name}</Text>
                </View>
                {user.type !== UserTypeConstants.GUEST && (
                  <Text
                    style={{
                      ...styles.priceValue,
                      color: Colors.SUCCEEDED_COLOR,
                    }}
                  >
                    {item.price}
                  </Text>
                )}
                <Text style={{ ...styles.priceValue, color: Colors.FAILED_COLOR }}>{item.customer_price}</Text>
              </View>

              {item.composition?.length > 0 ? (
                <View style={styles.fullWidth}>
                  <Text
                    style={{
                      ...styles.nameAr,
                      color: Colors.LIGHT_COLOR,
                      fontSize: item.nameAr.length >= 35 ? 16 : item.nameAr.length > 25 ? 16 : 16,
                    }}
                  >
                    {itemCompositionArraySplit.length > 0 ? (
                      <Text
                        style={{
                          ...styles.title,
                          fontSize: item.name.length < 25 ? 14 : 14,
                        }}
                      >
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
                      <Text
                        style={{
                          ...styles.title,
                          fontSize: item.name.length < 25 ? 14 : 14,
                        }}
                      >
                        {item.composition}
                      </Text>
                    )}
                  </Text>
                </View>
              ) : (
                <View style={{ height: 5 }}></View>
              )}
            </View>
          </TouchableWithoutFeedback>
        </View>

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

        {/* {item.caliber.length === 0 && item.packing.length === 0 && item.composition.length === 0 ? (
          <></>
        ) : (
          <TouchableWithoutFeedback onPress={changeExpandedStatus}>
            <View style={{ ...styles.actionIcon, ...styles.expandedIcon }}>
              {expanded ? (
                <AntDesign name="caretup" size={16} color={Colors.MAIN_COLOR} />
              ) : (
                <AntDesign name="caretdown" size={16} color={Colors.MAIN_COLOR} />
              )}
            </View>
          </TouchableWithoutFeedback>
        )} */}

        {/* {expanded && (
          <>
            <View style={styles.separator}></View>
            <View>
              {item.packing ? <LabelValueRow label={`${i18n.t('item-packing')}:`} value={item.packing} /> : null}
              {item.caliber ? <LabelValueRow label={`${i18n.t('item-caliber')}:`} value={item.caliber} /> : null}
              {item.composition ? (
                <LabelValueRow
                  label={`${i18n.t('item-composition')}:`}
                  value={item.composition?.split('+').join(' ')}
                />
              ) : null}
            </View>
          </>
        )} */}
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
  nameAr: {
    color: Colors.MAIN_COLOR,
    writingDirection: 'rtl',
    marginVertical: 5,
    fontSize: 14,
  },
  fullWidth: {
    flex: 1,
    writingDirection: 'rtl',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    flexDirection: 'row',
  },
  row: {
    flexDirection: 'row',
  },
  priceValue: {
    fontSize: 14,
    paddingStart: 6,
    fontWeight: 'bold',
  },
  title: {
    textAlign: 'left',
    fontWeight: '700',
    writingDirection: 'rtl',
  },
  companyName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.SUCCEEDED_COLOR,
  },
  contentView: {
    flex: 1,
  },
  actionsView: {
    alignItems: 'center',
  },
  filterResult: {
    backgroundColor: '#FCDA00',
    color: '#FF0000',
    borderRadius: 4,
    fontWeight: 'bold',
  },
});

export default memo(ItemCard);
