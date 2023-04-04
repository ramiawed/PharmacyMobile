import React from 'react';
import i18n from '../i18n/index';
import { View, Text, StyleSheet, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';

// components
import ItemNames from './ItemNames';
import ItemPrices from './ItemPrices';
// redux stuff
import { useDispatch } from 'react-redux';
import { decreaseItemQty, increaseItemQty, removeItemFromCart } from '../redux/cart/cartSlice';

// icons
import { AntDesign, Ionicons, MaterialIcons } from '@expo/vector-icons';

// constants
import { Colors, OfferTypes } from '../utils/constants';

const CartItem = ({ cartItem, inOrderDetails }) => {
  const dispatch = useDispatch();

  return (
    <View style={{ ...styles.container }}>
      <View style={styles.row}>
        <ItemNames item={cartItem.item} />
        {!inOrderDetails && (
          <View>
            <MaterialIcons
              name="delete"
              size={28}
              color={Colors.FAILED_COLOR}
              onPress={() => dispatch(removeItemFromCart(cartItem))}
            />
          </View>
        )}
      </View>

      <View style={{ ...styles.row, justifyContent: 'space-around', alignItems: 'center' }}>
        <View style={styles.icons}>
          {!inOrderDetails && (
            <TouchableOpacity
              style={{ backgroundColor: Colors.FAILED_COLOR }}
              onPress={() => {
                if (cartItem.qty > 1) dispatch(decreaseItemQty(cartItem.key));
              }}
            >
              <View>
                <AntDesign name="minus" size={32} color={Colors.WHITE_COLOR} />
              </View>
            </TouchableOpacity>
          )}

          <Text style={styles.qty}>{cartItem.qty}</Text>

          {!inOrderDetails && (
            <TouchableOpacity
              style={{ backgroundColor: Colors.SUCCEEDED_COLOR }}
              onPress={() => {
                if (cartItem.warehouse.maxQty !== 0 && cartItem.qty < cartItem.warehouse.maxQty)
                  dispatch(increaseItemQty(cartItem.key));
                else if (cartItem.warehouse.maxQty === 0) {
                  dispatch(increaseItemQty(cartItem.key));
                }
              }}
            >
              <View>
                <Ionicons name="md-add" size={32} color={Colors.WHITE_COLOR} />
              </View>
            </TouchableOpacity>
          )}
        </View>

        <Text style={styles.offer}>
          {cartItem.bonus ? cartItem.bonus : '-'}{' '}
          {cartItem.bonus
            ? cartItem.bonusType === OfferTypes.PERCENTAGE
              ? i18n.t('after-bonus-percentage-label')
              : i18n.t('after-quantity-label')
            : ''}
        </Text>

        <Text style={styles.point}>{cartItem.point ? `${cartItem.point} ${i18n.t('point')}` : '-'}</Text>

        <Text style={styles.totalPrice}>{cartItem.item.price}</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.company}>{cartItem.item.company.name}</Text>
        <ItemPrices
          showCustomerPrice={false}
          showPrice={true}
          price={
            cartItem.qty * (inOrderDetails ? cartItem.price : cartItem.item.price) -
            (cartItem.bonus && cartItem.bonusType === OfferTypes.PERCENTAGE
              ? (cartItem.qty * (inOrderDetails ? cartItem.price : cartItem.item.price) * cartItem.bonus) / 100
              : 0)
          }
          customerPrice={cartItem.item.custmer_price}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    flexDirection: 'column',
    borderWidth: 1,
    borderColor: '#e3e3e3',
    borderRadius: 6,
    padding: 5,
  },
  row: {
    flexDirection: 'row',
    paddingVertical: 5,
    paddingHorizontal: 3,
    justifyContent: 'space-between',
    width: '100%',
  },
  company: {
    color: Colors.SUCCEEDED_COLOR,
  },
  qty: {
    fontSize: 18,
    color: Colors.BLUE_COLOR,
    paddingHorizontal: 10,
    borderRadius: 6,
    width: 60,
    textAlign: 'center',
  },
  totalPrice: {
    fontSize: 14,
    color: Colors.SUCCEEDED_COLOR,
  },
  icons: {
    flexDirection: 'row',
    borderRadius: 4,
    overflow: 'hidden',
    alignItems: 'center',
  },
  offer: {
    fontSize: 14,
    color: Colors.BLUE_COLOR,
  },
  point: {
    fontSize: 14,
    color: Colors.POINTS_OFFER_COLOR,
  },
});

export default CartItem;
