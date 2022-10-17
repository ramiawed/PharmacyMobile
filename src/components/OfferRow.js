import React, { memo, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { View, Text, StyleSheet, TouchableWithoutFeedback, LayoutAnimation } from 'react-native';

// redux stuff
import { useDispatch, useSelector } from 'react-redux';
import { selectUserData } from '../redux/auth/authSlice';
import { addStatistics } from '../redux/statistics/statisticsSlice';

// constants
import { Colors, UserTypeConstants, OfferTypes } from '../utils/constants';

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

  // own state
  const [expanded, setExpanded] = useState(false);

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

  const changeExpandedStatus = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded(!expanded);
  };

  return user ? (
    <OfferSwipeableRow user={user} addToCart={() => addToCartHandler(item)} item={item}>
      <View
        style={{
          ...styles.container,
        }}
      >
        <View style={{ flexDirection: 'row' }}>
          <View style={{ flex: 1, justifyContent: 'space-between' }}>
            <View style={{ flexDirection: 'row' }}>
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
                    style={{
                      ...styles.title,
                      fontSize: item.name.length >= 35 ? 16 : item.name.length > 25 ? 18 : 18,
                    }}
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
                <Text style={styles.companyName}>{item.company[0].name}</Text>
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

            <View style={styles.subHeader}>
              <View style={styles.fullWidth}>
                <Text style={styles.warehouseName}>{item.warehouses.warehouse[0].name}</Text>
              </View>
            </View>
          </View>
        </View>
        <View style={{ ...styles.actionIcon, ...styles.addToCartIcon }}>
          {user.type === UserTypeConstants.PHARMACY && (
            <Ionicons
              name="cart"
              size={32}
              color={Colors.SUCCEEDED_COLOR}
              style={{ paddingHorizontal: 2, marginVertical: 4 }}
              onPress={() => addToCart(item)}
            />
          )}
        </View>

        <TouchableWithoutFeedback onPress={changeExpandedStatus}>
          <View style={{ ...styles.actionIcon, ...styles.expandedIcon }}>
            {expanded ? (
              <AntDesign name="caretup" size={16} color={Colors.MAIN_COLOR} />
            ) : (
              <AntDesign name="caretdown" size={16} color={Colors.MAIN_COLOR} />
            )}
          </View>
        </TouchableWithoutFeedback>

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
    paddingVertical: 23,
    marginHorizontal: 5,
    marginVertical: 30,
    backgroundColor: Colors.WHITE_COLOR,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e3e3e3',
    width: '95%',
  },
  nameAr: {
    width: '100%',
    textAlign: 'center',
    color: Colors.MAIN_COLOR,
    writingDirection: 'rtl',
    paddingHorizontal: 5,
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
    paddingStart: 6,
  },
  title: {
    width: '100%',
    textAlign: 'center',
    fontWeight: '700',
    color: Colors.MAIN_COLOR,
    writingDirection: 'rtl',
    paddingHorizontal: 5,
  },
  companyName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.SUCCEEDED_COLOR,
  },
  actionIcon: {
    borderWidth: 1,
    borderColor: '#e3e3e3',
    borderRadius: 50,
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
    backgroundColor: Colors.WHITE_COLOR,
  },
  favIcon: {
    top: -22,
    right: 10,
    width: 45,
    height: 45,
  },
  addToCartIcon: {
    top: -22,
    right: 20,
    width: 45,
    height: 45,
  },
  expandedIcon: {
    bottom: -18,
    width: 36,
    height: 36,
    alignSelf: 'center',
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
    height: 1,
    width: '100%',
    backgroundColor: Colors.SECONDARY_COLOR,
    marginVertical: 10,
  },
  warehouseName: {
    flex: 1,
    textAlign: 'center',
    marginVertical: 5,
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.BLUE_COLOR,
  },
});

export default memo(OfferCard);
