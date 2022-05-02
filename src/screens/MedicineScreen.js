import React, { useCallback, useEffect, useState } from 'react';
import i18n from '../i18n/index';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import axios from 'axios';

// component
import Loader from '../components/Loader';
import ExpandedView from '../components/ExpandedView';
import UserInfoRow from '../components/UserInfoRow';
import AddToCartModal from '../components/AddToCartModal';

// redux stuff
import { unwrapResult } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';
import { addItemToWarehouse, removeItemFromWarehouse, selectMedicines } from '../redux/medicines/medicinesSlices';
import { selectUserData } from '../redux/auth/authSlice';

// icons
import { Ionicons, AntDesign } from '@expo/vector-icons';

// constants
import { BASEURL, checkItemExistsInWarehouse, Colors, UserTypeConstants } from '../utils/constants';

const MedicineScreen = ({ route }) => {
  const { medicineId } = route.params;
  const dispatch = useDispatch();
  const { token, user } = useSelector(selectUserData);
  const { addToWarehouseStatus, removeFromWarehouseStatus } = useSelector(selectMedicines);

  const [showAddToCartModal, setShowAddToCartModal] = useState(false);
  const [loadingItem, setLoadingItem] = useState(false);
  const [item, setItem] = useState(null);

  const getItemFromDB = useCallback(() => {
    setLoadingItem(true);
    axios
      .get(`${BASEURL}/items/item/${medicineId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setItem(response.data.data.item);
        setLoadingItem(false);
      })
      .catch((err) => {
        setLoadingItem(false);
      });
  });

  const removeItemFromWarehouseHandler = () => {
    dispatch(
      removeItemFromWarehouse({
        obj: {
          itemId: item._id,
          warehouseId: user._id,
        },
        token,
      }),
    )
      .then(unwrapResult)
      .then(() => getItemFromDB())
      .catch((err) => {});
  };

  const addItemToWarehouseHandler = () => {
    dispatch(
      addItemToWarehouse({
        obj: {
          itemId: item._id,
          warehouseId: user._id,
        },
        token,
      }),
    )
      .then(unwrapResult)
      .then(() => getItemFromDB())
      .catch(() => {});
  };

  useEffect(() => {
    if (medicineId) {
      getItemFromDB();
    }
  }, [medicineId]);

  return item ? (
    <View style={{ flex: 1 }}>
      {user.type === UserTypeConstants.PHARMACY && item !== null && checkItemExistsInWarehouse(item, user) && (
        <TouchableOpacity
          style={{ backgroundColor: Colors.WHITE_COLOR, alignItems: 'center' }}
          onPress={() => {
            setShowAddToCartModal(true);
          }}
        >
          <View style={styles.addBtn}>
            <Ionicons name="cart" size={24} color={Colors.WHITE_COLOR} style={{ paddingHorizontal: 4 }} />
            <Text style={{ color: Colors.WHITE_COLOR }}>{i18n.t('add-to-cart')}</Text>
          </View>
        </TouchableOpacity>
      )}

      {user.type === UserTypeConstants.WAREHOUSE &&
        (item.warehouses?.map((w) => w.warehouse._id).includes(user._id) ? (
          <TouchableOpacity
            style={{ backgroundColor: Colors.WHITE_COLOR, alignItems: 'center' }}
            onPress={removeItemFromWarehouseHandler}
          >
            <View style={{ ...styles.addBtn, backgroundColor: Colors.FAILED_COLOR }}>
              <AntDesign name="delete" size={24} color={Colors.WHITE_COLOR} style={{ paddingHorizontal: 4 }} />
              <Text style={{ color: Colors.WHITE_COLOR }}>{i18n.t('remove-from-warehouse')}</Text>
            </View>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={{ backgroundColor: Colors.WHITE_COLOR, alignItems: 'center' }}
            onPress={addItemToWarehouseHandler}
          >
            <View style={styles.addBtn}>
              <Ionicons name="add-circle" size={24} color={Colors.WHITE_COLOR} style={{ paddingHorizontal: 4 }} />
              <Text style={{ color: Colors.WHITE_COLOR }}>{i18n.t('add-to-warehouse')}</Text>
            </View>
          </TouchableOpacity>
        ))}

      <ScrollView
        contentContainerStyle={{
          alignItems: 'center',
          paddingTop: 10,
        }}
        style={styles.container}
      >
        <ExpandedView title={i18n.t('item-main-info')}>
          <UserInfoRow label={i18n.t('item-trade-name')} value={item.name} editable={false} />
          <UserInfoRow label={i18n.t('item-formula')} value={item.formula} editable={false} />
          <UserInfoRow label={i18n.t('item-caliber')} value={item.caliber} editable={false} />
          <UserInfoRow label={i18n.t('item-packing')} value={item.packing} editable={false} />
        </ExpandedView>

        <ExpandedView title={i18n.t('item-price')}>
          {user.type !== UserTypeConstants.GUEST && (
            <UserInfoRow label={i18n.t('item-price')} value={item.price} editable={false} />
          )}
          <UserInfoRow label={i18n.t('item-customer-price')} value={item.customer_price} editable={false} />
        </ExpandedView>

        <ExpandedView title={i18n.t('item-composition')}>
          <Text
            style={{
              color: Colors.MAIN_COLOR,
              fontSize: 14,
              padding: 6,
            }}
          >
            {item.composition?.replace('+', ' + ')}
          </Text>
        </ExpandedView>

        <ExpandedView title={i18n.t('item-indication')}>
          <Text
            style={{
              color: Colors.MAIN_COLOR,
              fontSize: 14,
              padding: 6,
            }}
          >
            {item.indication.length > 0 ? item.indication.replace('+', ' + ') : i18n.t('empty-value')}
          </Text>
        </ExpandedView>
      </ScrollView>

      {(addToWarehouseStatus === 'loading' || removeFromWarehouseStatus === 'loading') && <Loader />}
      {showAddToCartModal && (
        <AddToCartModal
          close={() => {
            setShowAddToCartModal(false);
          }}
          item={item}
        />
      )}
    </View>
  ) : (
    <Loader />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.WHITE_COLOR,
  },
  addBtn: {
    flexDirection: 'row',
    backgroundColor: Colors.SUCCEEDED_COLOR,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 6,
    padding: 6,
    marginVertical: 5,
  },
});

export default MedicineScreen;
