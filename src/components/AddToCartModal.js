import i18n from 'i18n-js';
import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TextInput, TouchableOpacity } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { selectUserData } from '../redux/auth/authSlice';
import { selectWarehouses } from '../redux/warehouse/warehousesSlice';
import { addItemToCart } from '../redux/cart/cartSlice';
import { addStatistics } from '../redux/statistics/statisticsSlice';
import { Colors, OfferTypes } from '../utils/constants';
import CustomPicker from './CustomPicker';

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

const AddToCartModal = ({ item, close }) => {
  const dispatch = useDispatch();

  // selectors
  const { token, user } = useSelector(selectUserData);
  const { selectedWarehouse: sWarehouse } = useSelector(selectWarehouses);

  // build the warehouse option array that contains this item
  // get all the warehouse that contains this item
  // put asterisk after warehouse name if the warehouse has an offer
  const itemWarehousesOption = item.warehouses
    .filter((w) => w.warehouse.city === user.city && w.warehouse.isActive && w.warehouse.isApproved)
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
      ? item.warehouses.filter((w) => w.warehouse.city === user.city).find((w) => w.warehouse._id == sWarehouse)
      : item.warehouses.filter((w) => w.warehouse.city === user.city)[0],
  );

  const [offer, setOffer] = useState(
    sWarehouse !== null
      ? item.warehouses.filter((w) => w.warehouse.city === user.city).find((w) => w.warehouse._id == sWarehouse).offer
      : item.warehouses.filter((w) => w.warehouse.city === user.city)[0].offer,
  );
  const [qty, setQty] = useState('');
  const [qtyError, setQtyError] = useState(false);

  const handleWarehouseChange = (val) => {
    setSelectedWarehouse(item.warehouses.find((w) => w.warehouse._id == val));
    setOffer(item.warehouses.find((w) => w.warehouse._id == val).offer);
  };

  const handleAddItemToCart = () => {
    if (qty.length === 0) {
      setQtyError(true);
      return;
    }

    if (selectedWarehouse.maxQty !== 0 && qty > selectedWarehouse.maxQty) {
      setQtyError(true);
      return;
    }

    const bonusQty = checkOfferQty(selectedWarehouse, qty);

    dispatch(
      addItemToCart({
        item: item,
        warehouse: selectedWarehouse,
        qty: qty,
        bonus: bonusQty > 0 ? bonusQty : null,
        bonusType: bonusQty > 0 ? selectedWarehouse.offer.mode : null,
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

    close();
  };

  return (
    <View style={styles.centeredView}>
      <View style={styles.background}></View>
      <Modal animationType="slide" transparent={true}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.header}>{i18n.t('add-to-cart')}</Text>
            <View
              style={{
                alignItems: 'center',
                paddingTop: 10,
              }}
            >
              <CustomPicker
                selectedValue={{
                  label: selectedWarehouse.warehouse.name,
                  value: selectedWarehouse.warehouse._id,
                }}
                data={itemWarehousesOption}
                onChange={handleWarehouseChange}
                label={i18n.t('warehouse')}
              />

              <View style={styles.row}>
                <Text style={{ fontSize: 10, marginEnd: 10 }}>{i18n.t('item-max-qty')}</Text>
                <Text style={{ fontSize: 14, color: Colors.MAIN_COLOR }}>
                  {selectedWarehouse.maxQty === 0 ? i18n.t('no-limit-qty') : selectedWarehouse.maxQty}
                </Text>
              </View>
              <View style={styles.row}>
                <Text style={{ fontSize: 10, marginEnd: 10 }}>{i18n.t('selected-qty')}</Text>
                <TextInput
                  value={qty}
                  onChangeText={setQty}
                  style={{ flex: 1, writingDirection: 'rtl', textAlign: 'right' }}
                  keyboardType="number-pad"
                />
              </View>
            </View>

            {offer?.offers.length > 0 &&
              offer.offers.map((o, index) => (
                <View style={styles.offerRow} key={index}>
                  <View style={styles.offerRowFirst}>
                    <Text style={styles.label}>{i18n.t('quantity-label')}</Text>
                    <Text style={styles.value}>{o.qty}</Text>
                    <Text style={styles.label}>{i18n.t('after-quantity-label')}</Text>
                  </View>
                  <View style={styles.offerRowSecond}>
                    <Text style={styles.label}>
                      {offer.mode === OfferTypes.PIECES
                        ? i18n.t('bonus-quantity-label')
                        : i18n.t('bonus-percentage-label')}
                    </Text>
                    <Text style={styles.value}>{o.bonus}</Text>
                    <Text style={styles.label}>
                      {offer.mode === OfferTypes.PIECES
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
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  background: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: '#000',
    opacity: 0.4,
  },
  modalView: {
    width: '90%',
    marginHorizontal: 'auto',
    backgroundColor: 'white',
    borderRadius: 6,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    overflow: 'hidden',
  },
  header: {
    backgroundColor: Colors.MAIN_COLOR,
    color: Colors.WHITE_COLOR,
    paddingHorizontal: 8,
    paddingVertical: 16,
    fontSize: 18,
    fontWeight: 'bold',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingVertical: 5,
  },
  okBtn: {
    backgroundColor: Colors.SUCCEEDED_COLOR,
    color: Colors.WHITE_COLOR,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 6,
    fontSize: 16,
  },
  cancelBtn: {
    backgroundColor: Colors.FAILED_COLOR,
    color: Colors.WHITE_COLOR,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 6,
    marginHorizontal: 5,
    fontSize: 16,
  },
  textInput: {
    width: '90%',
    marginHorizontal: 10,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.SECONDARY_COLOR,
  },
  row: {
    backgroundColor: '#fff',
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
    backgroundColor: '#0f04',
    width: '90%',
    borderWidth: 1,
    borderRadius: 15,
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: 10,
    borderColor: Colors.MAIN_COLOR,
    marginHorizontal: 15,
  },
  offerRowFirst: {
    flexDirection: 'row',
    // flex: 1,
  },
  offerRowSecond: {
    flexDirection: 'row',
    // flex: 1,
  },
  value: {
    color: Colors.FAILED_COLOR,
    marginHorizontal: 10,
    fontWeight: 'bold',
  },
  label: {
    color: Colors.MAIN_COLOR,
  },
});

export default AddToCartModal;
