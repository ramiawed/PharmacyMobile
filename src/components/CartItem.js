import React, { useState } from 'react';
import i18n from 'i18n-js';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

// redux stuff
import { useDispatch } from 'react-redux';
import { decreaseItemQty, increaseItemQty, removeItemFromCart } from '../redux/cart/cartSlice';

// icons
import { AntDesign, Ionicons } from '@expo/vector-icons';

// constants
import { Colors, OfferTypes } from '../utils/constants';

const CartItem = ({ item, inOrderDetails }) => {
  const dispatch = useDispatch();
  const [expanded, setExpanded] = useState(false);

  return (
    <View style={{ ...styles.container }}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => setExpanded(!expanded)}
          style={{
            flex: 1,
            flexDirection: 'row',
          }}
        >
          {expanded ? (
            <AntDesign name="caretup" size={16} color={Colors.WHITE_COLOR} />
          ) : (
            <AntDesign name="caretdown" size={16} color={Colors.WHITE_COLOR} />
          )}
          <View
            style={{
              flex: 1,
            }}
          >
            <Text style={styles.name}>{item.item.name}</Text>
          </View>
        </TouchableOpacity>

        <AntDesign
          name="delete"
          size={24}
          color={Colors.FAILED_COLOR}
          onPress={() => dispatch(removeItemFromCart(item))}
        />
      </View>
      {expanded && (
        <>
          <View style={styles.row}>
            <Text style={styles.label}>{i18n.t('item-company')}</Text>
            <Text style={[styles.value]}>{item.item.company.name}</Text>
          </View>
          <View style={styles.row}>
            <View
              style={{
                flexDirection: 'row',
                flex: 1,
                alignItems: 'center',
              }}
            >
              <Text style={styles.label}>{i18n.t('item-formula')}</Text>
              <Text style={[styles.value]}>{item.item.formula}</Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                flex: 1,
                alignItems: 'center',
              }}
            >
              <Text style={styles.label}>{i18n.t('item-caliber')}</Text>
              <Text style={[styles.value]}>{item.item.caliber}</Text>
            </View>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>{i18n.t('item-packing')}</Text>
            <Text style={[styles.value]}>{item.item.packing}</Text>
          </View>
        </>
      )}

      <View style={styles.row}>
        <View
          style={{
            flexDirection: 'row',
            flex: 1,
            alignItems: 'center',
          }}
        >
          <Text style={styles.label}>{i18n.t('item-price')}</Text>
          <Text style={[styles.value, styles.price]}>{item.item.price}</Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            flex: 1,
            alignItems: 'center',
          }}
        >
          <Text style={styles.label}>{i18n.t('item-customer-price')}</Text>
          <Text style={[styles.value, styles.customerPrice]}>{item.item.customer_price}</Text>
        </View>
      </View>

      {expanded && (
        <View style={styles.row}>
          <Text style={styles.label}>{i18n.t('item-max-qty')}</Text>
          <Text style={[styles.value]}>{item.warehouse.maxQty ? item.warehouse.maxQty : ''}</Text>
        </View>
      )}

      <View style={styles.row}>
        <View
          style={{
            flexDirection: 'row',
            flex: 1,
            alignItems: 'center',
          }}
        >
          <Text style={styles.label}>{i18n.t('quantity-label')}:</Text>
          {!item.bonus && (
            <AntDesign
              name="minus"
              size={24}
              color={Colors.FAILED_COLOR}
              onPress={() => {
                if (item.qty > 0) dispatch(decreaseItemQty(item));
              }}
            />
          )}
          <Text style={styles.value}>{item.qty}</Text>
          {!item.bonus && (
            <Ionicons
              name="md-add"
              size={24}
              color={Colors.SUCCEEDED_COLOR}
              onPress={() => {
                if (item.warehouse.maxQty !== 0 && item.qty < item.warehouse.maxQty) dispatch(increaseItemQty(item));
                else if (item.warehouse.maxQty === 0) {
                  dispatch(increaseItemQty(item));
                }
              }}
            />
          )}
        </View>
        <View
          style={{
            flexDirection: 'row',
            flex: 1,
            alignItems: 'center',
          }}
        >
          <Text style={styles.label}>{i18n.t('offer-label')}:</Text>
          <Text style={styles.value}>
            {item.bonus && item.bonus}
            {item.bonus
              ? item.bonusType === OfferTypes.PERCENTAGE
                ? i18n.t('after-bonus-percentage-label')
                : i18n.t('after-quantity-label')
              : '-'}
          </Text>
        </View>
      </View>

      <View style={styles.row}>
        <Text style={styles.totalPrice}>
          {item.qty * (inOrderDetails ? item.price : item.item.price) -
            (item.bonus && item.bonusType === OfferTypes.PERCENTAGE
              ? (item.qty * (inOrderDetails ? item.price : item.item.price) * item.bonus) / 100
              : 0)}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    borderWidth: 1,
    borderColor: Colors.SECONDARY_COLOR,
    borderRadius: 6,
    marginVertical: 5,
    overflow: 'hidden',
  },
  header: {
    backgroundColor: Colors.MAIN_COLOR,
    flexDirection: 'row',
    alignItems: 'center',
    width: '90%',
    padding: 5,
    borderBottomWidth: 2,
    borderBottomColor: Colors.GREY_COLOR,
  },
  name: {
    color: Colors.WHITE_COLOR,
    writingDirection: 'rtl',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'left',
    marginStart: 10,
  },
  row: {
    flexDirection: 'row',
    paddingVertical: 5,
    paddingHorizontal: 3,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: Colors.SECONDARY_COLOR,
  },
  value: {
    textAlign: 'center',
    padding: 5,
    borderRadius: 4,
    color: Colors.MAIN_COLOR,
    marginStart: 10,
  },
  label: {
    color: Colors.SECONDARY_COLOR,
    fontSize: 10,
    fontWeight: 'bold',
    width: 65,
  },
  price: {
    backgroundColor: Colors.SUCCEEDED_COLOR,
    color: Colors.WHITE_COLOR,
  },
  customerPrice: {
    backgroundColor: Colors.FAILED_COLOR,
    color: Colors.WHITE_COLOR,
  },
  totalPrice: {
    color: Colors.SUCCEEDED_COLOR,
    fontWeight: 'bold',
    textAlign: 'right',
    flex: 1,
    marginEnd: 10,
  },
});

export default CartItem;
