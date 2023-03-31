import i18n from '../i18n/index';
import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// components
import PointDetailsRow from './PointDetailRow';
import OfferDetailsRow from './OfferDetailsRow';

// redux stuff
import { addStatistics } from '../redux/statistics/statisticsSlice';
import { selectUserData } from '../redux/auth/authSlice';
import { addItemToCart } from '../redux/cart/cartSlice';
import { useDispatch, useSelector } from 'react-redux';

// constants
import { Colors, LinearGradientColors } from '../utils/constants';
import CustomLinearGradient from './CustomLinearGradient';

const AddToCartOffer = ({ item, close }) => {
  const addToCartItem = {
    ...item,
    company: {
      _id: item.company[0]._id,
      name: item.company[0].name,
    },
    warehouses: [
      {
        ...item.warehouses,
        warehouse: {
          _id: item.warehouses.warehouse[0]._id,
          name: item.warehouses.warehouse[0].name,
          city: item.warehouses.warehouse[0].city,
          isActive: item.warehouses.warehouse[0].isActive,
          invoiceMinTotal: item.warehouses.warehouse[0].invoiceMinTotal,
          costOfDeliver: item.warehouses.warehouse[0].costOfDeliver,
          fastDeliver: item.warehouses.warehouse[0].fastDeliver,
        },
      },
    ],
  };

  const dispatch = useDispatch();

  // selectors
  const { token, user } = useSelector(selectUserData);

  const [qty, setQty] = useState('');
  const [qtyError, setQtyError] = useState(false);

  const handleAddItemToCart = () => {
    if (qty.length === 0) {
      setQtyError(true);
      return;
    }

    if (addToCartItem.maxQty !== 0 && qty > addToCartItem.maxQty) {
      setQtyError(true);
      return;
    }

    const { warehouses, ...item } = addToCartItem;

    const w = {
      maxQty: warehouses[0].maxQty,
      offerMode: warehouses[0].offer?.mode ? warehouses[0].offer?.mode : '',
      offers: warehouses[0].offer?.offers ? warehouses[0].offer?.offers : [],
      points: warehouses[0].points,
      ...warehouses[0].warehouse,
    };

    dispatch(
      addItemToCart({
        key: `${item._id}${warehouses[0].warehouse._id}`,
        item,
        warehouse: w,
        qty: qty,
      }),
    );

    dispatch(
      addStatistics({
        obj: {
          sourceUser: user._id,
          targetItem: addToCartItem._id,
          action: 'item-added-to-cart',
        },
        token,
      }),
    );

    close();
  };

  return (
    <View
      style={{
        backgroundColor: Colors.WHITE_COLOR,
      }}
    >
      <Text style={styles.header}>{i18n.t('add-to-cart')}</Text>
      <View style={styles.body}>
        <View style={styles.row}>
          <Text style={{ fontSize: 14, color: Colors.MAIN_COLOR }}>{addToCartItem.warehouses[0].warehouse.name}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.rowLabel}>{i18n.t('item-max-qty')}</Text>
          <Text style={{ fontSize: 14, color: Colors.MAIN_COLOR }}>
            {addToCartItem.warehouses[0].maxQty === 0 ? '-' : addToCartItem.warehouses.maxQty}
          </Text>
        </View>
        <View
          style={{
            ...styles.row,
            borderBottomColor: qtyError ? Colors.FAILED_COLOR : '#e3e3e3',
          }}
        >
          <Text style={styles.rowLabel}>{i18n.t('selected-qty')}</Text>
          <TextInput
            value={qty}
            onChangeText={(val) => {
              setQty(val);
              setQtyError(false);
            }}
            style={styles.selectedQty}
            keyboardType="number-pad"
          />
        </View>
      </View>

      {addToCartItem.warehouses[0].offer.offers.length > 0 && (
        <CustomLinearGradient colors={LinearGradientColors.OFFERS}>
          <View style={{ backgroundColor: Colors.WHITE_COLOR }}>
            {addToCartItem.warehouses[0].offer.offers.map((o, index) => (
              <OfferDetailsRow offerMode={addToCartItem.warehouses[0].offer.mode} key={index} offer={o} />
            ))}
          </View>
        </CustomLinearGradient>
      )}

      {/* {addToCartItem.warehouses[0].points && <Separator />} */}

      {addToCartItem.warehouses[0].points?.length > 0 && (
        <CustomLinearGradient colors={LinearGradientColors.POINTS}>
          <View style={{ backgroundColor: Colors.WHITE_COLOR }}>
            {addToCartItem.warehouses[0].points?.map((o, index) => (
              <PointDetailsRow key={index} point={o} />
            ))}
          </View>
        </CustomLinearGradient>
      )}

      <View style={styles.actions}>
        <TouchableOpacity
          onPress={handleAddItemToCart}
          style={{
            ...styles.actionView,
            flex: 3,
            backgroundColor: Colors.SUCCEEDED_COLOR,
          }}
        >
          <Ionicons name="cart" size={24} color={Colors.WHITE_COLOR} style={{ marginEnd: 10 }} />
          <Text style={{ ...styles.actionText }}>{i18n.t('add-to-cart')}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={close}
          style={{
            ...styles.actionView,
            flex: 1,
            backgroundColor: Colors.FAILED_COLOR,
          }}
        >
          <Text style={{ ...styles.actionText }}>{i18n.t('cancel')}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  textInput: {
    width: '90%',
    marginHorizontal: 10,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.SECONDARY_COLOR,
  },
  row: {
    backgroundColor: Colors.WHITE_COLOR,
    width: '90%',
    borderBottomWidth: 1,
    borderBottomColor: '#e3e3e3',
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  rowLabel: { fontSize: 10, marginEnd: 10 },
  actions: {
    width: '90%',
    flexDirection: 'row',
    alignItems: 'stretch',
    marginHorizontal: 20,
    marginBottom: 10,
  },
  actionView: {
    flex: 3,
    marginEnd: 10,
    flexDirection: 'row',
    backgroundColor: Colors.SUCCEEDED_COLOR,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 6,
  },
  actionText: {
    fontSize: 14,
    textAlign: 'center',
    color: Colors.WHITE_COLOR,
    paddingVertical: 10,
  },
  header: {
    backgroundColor: Colors.MAIN_COLOR,
    color: Colors.WHITE_COLOR,
    paddingVertical: 20,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  body: {
    alignItems: 'center',
    paddingTop: 10,
  },
  selectedQty: { flex: 1, writingDirection: 'rtl', textAlign: 'right' },
});

export default AddToCartOffer;
