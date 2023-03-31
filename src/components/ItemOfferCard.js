import React, { memo, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { View, Text, StyleSheet, TouchableWithoutFeedback, LayoutAnimation } from 'react-native';

// redux stuff
import { useDispatch, useSelector } from 'react-redux';
import { selectUserData } from '../redux/auth/authSlice';
import { addStatistics } from '../redux/statistics/statisticsSlice';

// constants
import { Colors, LinearGradientColors, UserTypeConstants } from '../utils/constants';

// icons
import { AntDesign, Ionicons } from '@expo/vector-icons';

// components
import OfferSwipeableRow from './OfferSwipeableRow';
import PointDetailsRow from './PointDetailRow';
import OfferDetailsRow from './OfferDetailsRow';
import ItemNames from './ItemNames';
import ItemPrices from './ItemPrices';
import CustomLinearGradient from './CustomLinearGradient';

const ItemOfferCard = ({ item, addToCart, type, searchString }) => {
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
              {user.type === UserTypeConstants.PHARMACY && (
                <View style={styles.actionIcon}>
                  <Ionicons
                    name="cart"
                    size={32}
                    color={Colors.SUCCEEDED_COLOR}
                    style={{ paddingHorizontal: 2, marginVertical: 4 }}
                    onPress={() => addToCart(item)}
                  />
                </View>
              )}
            </View>

            <View style={{ ...styles.row, marginVertical: 5 }}>
              <Text style={styles.companyName}>{item.company[0].name}</Text>
              <ItemPrices
                price={item.price}
                customerPrice={item.customer_price}
                showPrice={user.type !== UserTypeConstants.GUEST}
                showCustomerPrice={true}
              />
            </View>
          </View>
        </TouchableWithoutFeedback>

        <CustomLinearGradient colors={type === 'offer' ? LinearGradientColors.OFFERS : LinearGradientColors.POINTS}>
          <TouchableWithoutFeedback onPress={changeExpandedStatus}>
            <View style={{ backgroundColor: Colors.WHITE_COLOR, borderRadius: 6, padding: 3 }}>
              {/* {type === 'offer' && <CustomLinearGradient colors={LinearGradientColors.OFFERS} />} */}

              {/* {type === 'point' && <CustomLinearGradient colors={LinearGradientColors.POINTS} />} */}

              <Text style={styles.warehouseName}>{item.warehouses.warehouse[0].name}</Text>

              {expanded &&
                type === 'offer' &&
                item.warehouses.offer.offers.map((o, index) => (
                  <OfferDetailsRow key={index} offerMode={item.warehouses.offer.mode} offer={o} />
                ))}

              {expanded &&
                type === 'point' &&
                item.warehouses.points.map((o, index) => <PointDetailsRow key={index} point={o} />)}
            </View>
          </TouchableWithoutFeedback>
        </CustomLinearGradient>
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
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  companyName: {
    flex: 1,
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.SUCCEEDED_COLOR,
  },
  actionIcon: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.WHITE_COLOR,
  },
  warehouseName: {
    fontSize: 14,
    color: Colors.DARK_COLOR,
    textAlign: 'center',
  },
});

export default memo(ItemOfferCard);
