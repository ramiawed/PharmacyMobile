import React, { useState } from 'react';
import i18n from '../i18n/index';
import { View, Text, StyleSheet, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';

// redux stuff
import { useDispatch } from 'react-redux';
import { decreaseItemQty, increaseItemQty, removeItemFromCart } from '../redux/cart/cartSlice';

// icons
import { AntDesign, Ionicons, MaterialIcons } from '@expo/vector-icons';

// constants
import { Colors, OfferTypes } from '../utils/constants';
import { t } from 'i18n-js';

const CartItem = ({ item, inOrderDetails }) => {
  const dispatch = useDispatch();
  const [expanded, setExpanded] = useState(false);

  return (
    <View style={{ ...styles.container }}>
      {!inOrderDetails && (
        <View style={{ ...styles.deleteIcon, ...styles.icon }}>
          <MaterialIcons
            name="delete"
            size={24}
            color={Colors.FAILED_COLOR}
            onPress={() => dispatch(removeItemFromCart(item))}
          />
        </View>
      )}
      <View style={styles.header}>
        <Text
          style={{
            ...styles.name,
            fontSize: item.item.name.length >= 35 ? 16 : item.item.name.length > 25 ? 16 : 18,
          }}
        >
          {item.item.name}
        </Text>
        {item.item.nameAr ? (
          <Text
            style={{
              ...styles.name,
              fontSize: item.item.nameAr.length >= 35 ? 14 : item.item.nameAr.length > 14 ? 14 : 16,
            }}
          >
            {item.item.nameAr}
          </Text>
        ) : (
          <></>
        )}

        <View style={{ height: 5 }}></View>

        {!item.bonus && !inOrderDetails && (
          <TouchableOpacity
            style={{ ...styles.minusIcon, ...styles.icon, top: item.item.nameAr ? 50 : 35 }}
            onPress={() => {
              if (item.qty > 1) dispatch(decreaseItemQty(item));
            }}
          >
            <View>
              <AntDesign name="minus" size={24} color={Colors.FAILED_COLOR} />
            </View>
          </TouchableOpacity>
        )}
        <View style={{ flexDirection: 'row' }}>
          <Text style={styles.qty}>{item.qty}</Text>

          {item.bonus && (
            <>
              <View style={{ padding: 5, justifyContent: 'center', alignItems: 'center' }}>
                <Text>+</Text>
              </View>
              <Text style={styles.qty}>
                {item.bonus}{' '}
                {item.bonus
                  ? item.bonusType === OfferTypes.PERCENTAGE
                    ? i18n.t('after-bonus-percentage-label')
                    : i18n.t('after-quantity-label')
                  : '-'}
              </Text>
            </>
          )}
        </View>

        {!item.bonus && !inOrderDetails && (
          <TouchableOpacity
            style={{ ...styles.addIcon, ...styles.icon, top: item.item.nameAr ? 50 : 35 }}
            onPress={() => {
              if (item.warehouse.maxQty !== 0 && item.qty < item.warehouse.maxQty) dispatch(increaseItemQty(item));
              else if (item.warehouse.maxQty === 0) {
                dispatch(increaseItemQty(item));
              }
            }}
          >
            <View>
              <Ionicons name="md-add" size={24} color={Colors.SUCCEEDED_COLOR} />
            </View>
          </TouchableOpacity>
        )}

        <View style={{ height: 5 }}></View>

        <View style={styles.row}>
          <Text style={styles.company}>{item.item.company.name}</Text>
          <Text style={styles.price}>{item.item.price}</Text>
        </View>

        <View style={{ height: 1, backgroundColor: '#e3e3e3', width: '100%' }}></View>

        <View style={{ ...styles.row, borderBottomWidth: 0, justifyContent: 'flex-end' }}>
          <Text style={styles.totalPrice}>{t('item-total-price')}</Text>
          <Text style={styles.totalPrice}>
            {item.qty * (inOrderDetails ? item.price : item.item.price) -
              (item.bonus && item.bonusType === OfferTypes.PERCENTAGE
                ? (item.qty * (inOrderDetails ? item.price : item.item.price) * item.bonus) / 100
                : 0)}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    borderWidth: 1,
    borderColor: '#e3e3e3',
    borderRadius: 6,
    marginTop: 22,
    marginHorizontal: 12,
    paddingTop: 20,
  },
  header: {
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
    padding: 5,
  },
  name: {
    color: Colors.MAIN_COLOR,
    fontWeight: 'bold',
    textAlign: 'center',
    marginStart: 10,
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
  price: {
    color: Colors.SUCCEEDED_COLOR,
  },
  icon: {
    borderWidth: 1,
    borderColor: '#e3e3e3',
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 18,
    position: 'absolute',
    backgroundColor: Colors.WHITE_COLOR,
  },
  minusIcon: {
    left: 50,
  },
  addIcon: {
    right: 50,
  },
  deleteIcon: {
    top: -18,
    alignSelf: 'center',
  },
  qty: {
    fontSize: 20,
    color: Colors.BLUE_COLOR,
    paddingHorizontal: 10,
    borderRadius: 6,
  },
  totalPrice: {
    color: Colors.SUCCEEDED_COLOR,
    marginStart: 10,
  },
});

export default CartItem;
