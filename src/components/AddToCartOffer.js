import i18n from '../i18n/index';
import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';

// components
import CustomPicker from './CustomPicker';

// redux stuff
import { useDispatch, useSelector } from 'react-redux';
import { selectUserData } from '../redux/auth/authSlice';
import { addItemToCart } from '../redux/cart/cartSlice';
import { addStatistics } from '../redux/statistics/statisticsSlice';
import { selectMedicines } from '../redux/medicines/medicinesSlices';

// constants
import { Colors, OfferTypes } from '../utils/constants';

const checkOfferQty = (selectedWarehouse, qty) => {
  // check if the specified warehouse has an offer
  if (selectedWarehouse.offer.offers.length > 0) {
    // through all the offers, check if the entered quantity has an offer
    for (let i = 0; i < selectedWarehouse.offer.offers.length; i++) {
      // check if the entered quantity has an offer
      if (qty >= selectedWarehouse.offer.offers[i].qty) {
        // if it has return:
        // 1- mode of the offer (pieces, percentage)
        // 2- bonus
        // 2-1: if the mode is pieces return the bonus * (entered qty / bonus qty)
        // 2-2: if the mode is percentage return the bonus
        if (selectedWarehouse.offer.mode === OfferTypes.PERCENTAGE) {
          return selectedWarehouse.offer.offers[i].bonus;
        } else {
          return (
            selectedWarehouse.offer.offers[i].bonus +
            checkOfferQty(selectedWarehouse, qty - selectedWarehouse.offer.offers[i].qty)
          );
        }
      }
    }
  }

  return 0;
};

const AddToCartOffer = ({ item, close }) => {
  const addToCartItem = {
    ...item,
    company: {
      _id: item.company[0]._id,
      name: item.company[0].name,
    },
    warehouses: {
      ...item.warehouses,
      warehouse: {
        _id: item.warehouses.warehouse[0]._id,
        name: item.warehouses.warehouse[0].name,
        city: item.warehouses.warehouse[0].city,
        isActive: item.warehouses.warehouse[0].isActive,
        isApproved: item.warehouses.warehouse[0].isApproved,
      },
    },
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

    const bonusQty = checkOfferQty(addToCartItem.warehouses, qty);

    dispatch(
      addItemToCart({
        item: addToCartItem,
        warehouse: addToCartItem.warehouses,
        qty: qty,
        bonus: bonusQty > 0 ? bonusQty : null,
        bonusType: bonusQty > 0 ? addToCartItem.warehouses.offer.mode : null,
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
          <Text style={{ fontSize: 14, color: Colors.MAIN_COLOR }}>{addToCartItem.warehouses.warehouse.name}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.rowLabel}>{i18n.t('item-max-qty')}</Text>
          <Text style={{ fontSize: 14, color: Colors.MAIN_COLOR }}>
            {addToCartItem.warehouses.maxQty === 0 ? i18n.t('no-limit-qty') : addToCartItem.warehouses.maxQty}
          </Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.rowLabel}>{i18n.t('selected-qty')}</Text>
          <TextInput value={qty} onChangeText={setQty} style={styles.selectedQty} keyboardType="number-pad" />
        </View>
      </View>

      {addToCartItem.warehouses.offer.offers.map((o, index) => (
        <View style={styles.offerRow} key={index}>
          <View style={styles.offerRowFirst}>
            <Text style={styles.label}>{i18n.t('quantity-label')}</Text>
            <Text style={styles.value}>{o.qty}</Text>
            <Text style={styles.label}>{i18n.t('after-quantity-label')}</Text>
          </View>
          <View style={styles.offerRowSecond}>
            <Text style={styles.label}>
              {addToCartItem.warehouses.offer.mode === OfferTypes.PIECES
                ? i18n.t('bonus-quantity-label')
                : i18n.t('bonus-percentage-label')}
            </Text>
            <Text style={styles.value}>{o.bonus}</Text>
            <Text style={styles.label}>
              {addToCartItem.warehouses.offer.mode === OfferTypes.PIECES
                ? i18n.t('after-bonus-quantity-label')
                : i18n.t('after-bonus-percentage-label')}
            </Text>
          </View>
        </View>
      ))}

      <View style={styles.actions}>
        <TouchableOpacity onPress={handleAddItemToCart}>
          <Text style={styles.okBtn}>{i18n.t('add-label')}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={close}>
          <Text style={styles.cancelBtn}>{i18n.t('cancel-label')}</Text>
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
    borderWidth: 1,
    borderRadius: 15,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    borderColor: Colors.MAIN_COLOR,
  },
  offerRow: {
    backgroundColor: Colors.OFFER_COLOR,
    width: '90%',
    borderWidth: 1,
    borderRadius: 15,
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: 10,
    borderColor: Colors.MAIN_COLOR,
    marginHorizontal: 20,
  },
  offerRowFirst: {
    flexDirection: 'row',
  },
  offerRowSecond: {
    flexDirection: 'row',
  },
  value: {
    color: Colors.FAILED_COLOR,
    marginHorizontal: 10,
    fontWeight: 'bold',
  },
  label: {
    color: Colors.MAIN_COLOR,
  },
  rowLabel: { fontSize: 10, marginEnd: 10 },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingVertical: 10,
  },
  okBtn: {
    backgroundColor: Colors.MAIN_COLOR,
    color: Colors.WHITE_COLOR,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
    marginHorizontal: 5,
    fontSize: 18,
  },
  cancelBtn: {
    color: Colors.MAIN_COLOR,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
    marginHorizontal: 5,
    fontSize: 18,
  },
  header: {
    backgroundColor: Colors.MAIN_COLOR,
    color: Colors.WHITE_COLOR,
    padding: 10,
    fontSize: 18,
    fontWeight: 'bold',
  },
  body: {
    alignItems: 'center',
    paddingTop: 10,
  },
  selectedQty: { flex: 1, writingDirection: 'rtl', textAlign: 'right' },
});

export default AddToCartOffer;
