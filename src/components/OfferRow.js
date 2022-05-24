import React, { memo, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { View, Text, StyleSheet, TouchableWithoutFeedback, ActivityIndicator } from 'react-native';

// redux stuff
import { unwrapResult } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';
import { selectUserData } from '../redux/auth/authSlice';
import { addFavoriteItem, removeFavoriteItem, selectFavoritesItems } from '../redux/favorites/favoritesSlice';
import { addStatistics } from '../redux/statistics/statisticsSlice';

// constants
import { Colors, UserTypeConstants, checkItemExistsInWarehouse, OfferTypes } from '../utils/constants';

// icons
import { AntDesign, Ionicons } from '@expo/vector-icons';

// components
import OfferSwipeableRow from './OfferSwipeableRow';
import i18n from 'i18n-js';

const OfferCard = ({ item, addToCart }) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  // selectors
  const { user, token } = useSelector(selectUserData);
  const favorites = useSelector(selectFavoritesItems);

  // own state
  const [expanded, setExpanded] = useState(false);
  const [changeFavoriteLoading, setChangeFavoriteLoading] = useState(false);

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

  return user ? (
    <OfferSwipeableRow
      user={user}
      addItemToFavorite={addItemToFavoriteItems}
      removeItemFromFavorite={removeItemFromFavoritesItems}
      isFavorite={isFavorite}
      addToCart={() => addToCartHandler(item)}
      item={item}
    >
      <View
        style={{
          ...styles.container,
        }}
      >
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

          {user.type === UserTypeConstants.PHARMACY && (
            <Ionicons
              name="cart"
              size={24}
              color={Colors.SUCCEEDED_COLOR}
              style={{ paddingHorizontal: 2 }}
              onPress={() => addToCart(item)}
            />
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
            <Text style={styles.companyName}>{item.company[0].name}</Text>
          </View>
          {user.type !== UserTypeConstants.GUEST && (
            <Text style={{ ...styles.priceValue, color: Colors.SUCCEEDED_COLOR }}>{item.price}</Text>
          )}
          <Text style={{ ...styles.priceValue, color: Colors.FAILED_COLOR }}>{item.customer_price}</Text>
        </View>
        <View style={styles.subHeader}>
          <View style={styles.fullWidth}>
            <Text style={styles.companyName}>{item.warehouses.warehouse[0].name}</Text>
          </View>
        </View>
        {expanded && (
          <>
            <View style={styles.separator}></View>
            {item.warehouses.offer.offers.map((o, index) => (
              <View style={styles.offer} key={index}>
                <View style={styles.offerSection}>
                  <Text style={styles.label}>{i18n.t('quantity-label')}</Text>
                  <Text style={styles.value}>{o.qty}</Text>
                  <Text style={styles.label}>{i18n.t('after-quantity-label')}</Text>
                </View>
                <View style={styles.offerSection}>
                  <Text style={styles.label}>
                    {item.warehouses.offer.mode === OfferTypes.PIECES
                      ? i18n.t('bonus-quantity-label')
                      : i18n.t('bonus-percentage-label')}
                  </Text>
                  <Text style={styles.value}>{o.bonus}</Text>
                  <Text style={styles.label}>
                    {item.warehouses.offer.mode === OfferTypes.PIECES
                      ? i18n.t('after-bonus-quantity-label')
                      : i18n.t('after-bonus-percentage-label')}
                  </Text>
                </View>
              </View>
            ))}
          </>
        )}
      </View>
    </OfferSwipeableRow>
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
  companyName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.SECONDARY_COLOR,
    marginStart: 20,
  },
  offer: {
    flexDirection: 'row',
    padding: 4,
    backgroundColor: Colors.OFFER_COLOR,
    margin: 4,
    borderRadius: 6,
  },
  offerSection: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'center',
  },
  value: {
    borderRadius: 4,
    backgroundColor: Colors.WHITE_COLOR,
    color: Colors.FAILED_COLOR,
    marginHorizontal: 4,
    paddingHorizontal: 4,
  },
  label: {
    color: Colors.MAIN_COLOR,
  },
  separator: {
    backgroundColor: Colors.GREY_COLOR,
    height: 2,
    width: '90%',
    marginHorizontal: '5%',
    marginTop: 10,
    marginBottom: 5,
  },
});

export default memo(OfferCard);
