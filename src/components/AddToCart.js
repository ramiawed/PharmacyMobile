import i18n from '../i18n/index';
import React, { useState } from 'react';

import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import 'react-native-get-random-values';

// icons
import { Ionicons } from '@expo/vector-icons';

// components
import CustomLinearGradient from './CustomLinearGradient';
import OfferDetailsRow from './OfferDetailsRow';
import PointDetailRow from './PointDetailRow';
import CheckBox from 'expo-checkbox';

// redux stuff
import { useDispatch, useSelector } from 'react-redux';
import { selectUserData } from '../redux/auth/authSlice';
import { addItemToCart } from '../redux/cart/cartSlice';
import { addStatistics } from '../redux/statistics/statisticsSlice';
import { selectMedicines } from '../redux/medicines/medicinesSlices';
import { removeSavedItem } from '../redux/savedItems/savedItemsSlice';

// constants
import { Colors, LinearGradientColors } from '../utils/constants';

const AddToCart = ({ item, close, fromSavedItems }) => {
  const dispatch = useDispatch();

  // selectors
  const { token, user } = useSelector(selectUserData);
  const {
    pageState: { searchWarehouseId: sWarehouse },
  } = useSelector(selectMedicines);

  // build the warehouse option array that contains this item
  // get all the warehouse that contains this item
  // put asterisk after warehouse name if the warehouse has an offer
  const itemWarehousesOption = item.warehouses
    .filter((w) => w.warehouse.city === user.city && w.warehouse.isActive)
    .map((w) => {
      const asterisk = w.offer.offers.length > 0 ? '*' : '';
      return {
        label: `${w.warehouse.name} ${asterisk}`,
        value: w.warehouse._id,
      };
    });

  // select the first warehouse in the list
  const [selectedWarehouse, setSelectedWarehouse] = useState(
    sWarehouse !== null
      ? item.warehouses
          .filter((w) => w.warehouse.city === user.city && w.warehouse.isActive)
          .find((w) => w.warehouse._id == sWarehouse)
      : item.warehouses.filter((w) => w.warehouse.city === user.city && w.warehouse.isActive)[0],
  );

  const [offer, setOffer] = useState(
    sWarehouse !== null
      ? item.warehouses
          .filter((w) => w.warehouse.city === user.city && w.warehouse.isActive)
          .find((w) => w.warehouse._id == sWarehouse).offer
      : item.warehouses.filter((w) => w.warehouse.city === user.city && w.warehouse.isActive)[0].offer,
  );
  const [qty, setQty] = useState('');
  const [qtyError, setQtyError] = useState(false);
  const [selectedWarehouseError, setSelectedWarehouseError] = useState(false);

  const handleWarehouseChange = (val) => {
    setSelectedWarehouse(item.warehouses.find((w) => w.warehouse._id == val));
    setOffer(item.warehouses.find((w) => w.warehouse._id == val).offer);
  };

  const handleAddItemToCart = () => {
    if (!selectedWarehouse) {
      setSelectedWarehouseError(true);
      return;
    }

    if (qty.length === 0) {
      setQtyError(true);
      return;
    }

    if (selectedWarehouse.maxQty !== 0 && qty > selectedWarehouse.maxQty) {
      setQtyError(true);
      return;
    }

    const { addedAt, warehouses, ...itemRest } = item;

    const w = {
      maxQty: selectedWarehouse.maxQty,
      offerMode: selectedWarehouse.offer?.mode ? selectedWarehouse.offer?.mode : '',
      offers: selectedWarehouse.offer?.offers ? selectedWarehouse.offer?.offers : [],
      points: selectedWarehouse.points,
      ...selectedWarehouse.warehouse,
    };

    dispatch(
      addItemToCart({
        key: `${itemRest._id}${selectedWarehouse.warehouse._id}`,
        item: itemRest,
        warehouse: w,
        qty: qty,
      }),
    );

    dispatch(
      addStatistics({
        obj: {
          sourceUser: user._id,
          targetItem: item._id,
          action: 'item-added-to-cart',
        },
        token,
      }),
    );

    if (fromSavedItems) {
      dispatch(removeSavedItem({ obj: { savedItemId: item._id }, token }));
    }

    close();
  };

  return (
    <View
      style={{
        backgroundColor: Colors.WHITE_COLOR,
        zIndex: 100,
      }}
    >
      <Text style={styles.header}>{i18n.t('add-to-cart')}</Text>
      <View style={styles.body}>
        <View
          style={{
            ...styles.availableWarehouseView,
            borderBottomColor: selectedWarehouseError ? Colors.FAILED_COLOR : '#e3e3e3',
          }}
        >
          <Text style={{ color: Colors.SUCCEEDED_COLOR, fontWeight: 'bold' }}>{i18n.t('available-warehouses')}</Text>
          {itemWarehousesOption.map((opt) => (
            <View key={opt.value} style={styles.warehouseView}>
              <CheckBox
                value={selectedWarehouse.warehouse._id === opt.value}
                onValueChange={() => handleWarehouseChange(opt.value)}
              />
              <Text
                style={{
                  marginStart: 10,
                  color: Colors.MAIN_COLOR,
                  fontWeight: 'bold',
                }}
              >
                {opt.label}
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.row}>
          <Text style={styles.rowLabel}>{i18n.t('item-max-qty')}:</Text>
          <Text style={{ fontSize: 14, color: Colors.MAIN_COLOR }}>
            {selectedWarehouse.maxQty === 0 ? i18n.t('no-limit-qty') : selectedWarehouse.maxQty}
          </Text>
        </View>
        <View
          style={{
            ...styles.row,
            borderBottomColor: qtyError ? Colors.FAILED_COLOR : '#e3e3e3',
          }}
        >
          <Text style={styles.rowLabel}>{i18n.t('selected-qty')}:</Text>
          <TextInput
            value={qty}
            onChangeText={(val) => {
              setQty(val);
              setQtyError(false);
            }}
            style={styles.selectedQty}
            keyboardType="number-pad"
            maxLength={3}
            autoFocus={true}
          />
        </View>
      </View>

      {offer?.offers.length > 0 && (
        <CustomLinearGradient colors={LinearGradientColors.OFFERS}>
          <View style={{ backgroundColor: Colors.WHITE_COLOR }}>
            {offer.offers.map((o, index) => (
              <OfferDetailsRow key={index} offer={o} offerMode={offer.mode} />
            ))}
          </View>
        </CustomLinearGradient>
      )}

      {selectedWarehouse?.points.length > 0 && (
        <CustomLinearGradient colors={LinearGradientColors.POINTS}>
          <View style={{ backgroundColor: Colors.WHITE_COLOR }}>
            {selectedWarehouse.points.map((point, index) => (
              <PointDetailRow key={index} point={point} />
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
    borderBottomColor: Colors.DARK_COLOR,
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
  rowLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    marginEnd: 10,
    color: Colors.LIGHT_COLOR,
  },
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
  selectedQty: {
    flex: 1,
    writingDirection: 'rtl',
    textAlign: 'right',
    color: Colors.MAIN_COLOR,
  },
  availableWarehouseView: {
    backgroundColor: Colors.WHITE_COLOR,
    width: '90%',
    borderBottomWidth: 1,
    borderBottomColor: '#e3e3e3',
    padding: 10,
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: 10,
  },
  warehouseView: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    width: '100%',
    marginVertical: 5,
  },
  gradient: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 6,
  },
});

export default AddToCart;
