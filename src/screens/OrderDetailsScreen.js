import React, { useEffect, useState } from 'react';
import axios from 'axios';

import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';

// redux stuff
import { useDispatch, useSelector } from 'react-redux';
import { selectUserData } from '../redux/auth/authSlice';
import { selectOrders, updateOrders } from '../redux/orders/ordersSlice';

// icons
import { Ionicons, FontAwesome, MaterialIcons } from '@expo/vector-icons';

// constants
import { BASEURL, Colors, OfferTypes, UserTypeConstants } from '../utils/constants';

// component
import Loader from '../components/Loader';
import CartItem from '../components/CartItem';
import i18n from 'i18n-js';

const OrderDetailsScreen = ({ route }) => {
  const { orderId } = route.params;

  const dispatch = useDispatch();

  const { token, user } = useSelector(selectUserData);
  const { status } = useSelector(selectOrders);

  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [emptyMsg, setEmptyMsg] = useState('');

  const markOrdersAs = (verb) => {
    const ids = [orderId];

    if (ids.length > 0) {
      let body = {};
      if (user.type === UserTypeConstants.PHARMACY) {
        body = {
          pharmacyStatus: verb,
        };
      }
      if (user.type === UserTypeConstants.WAREHOUSE) {
        body = {
          warehouseStatus: verb,
        };
      }
      dispatch(
        updateOrders({
          obj: {
            ids,
            body,
          },
          token,
        }),
      );
    }
  };

  const getOrderDetails = async () => {
    setEmptyMsg('');
    setLoading(true);
    axios
      .get(`${BASEURL}/orders/details?id=${orderId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        if (response.data.data.order === null) {
          setEmptyMsg('order-deleted');
        } else {
          setOrderDetails(response.data.data.order);
        }
      })
      .catch((err) => {
        setEmptyMsg('order-details-error');
      });

    setLoading(false);
  };

  const computeTotalPrice = () => {
    let total = 0;

    orderDetails.items.forEach((item) => {
      total =
        total +
        item.qty * item.price -
        (item.bonus && item.bonusType === OfferTypes.PERCENTAGE ? (item.qty * item.price * item.bonus) / 100 : 0);
    });

    return total;
  };

  useEffect(() => {
    getOrderDetails();
  }, []);

  return loading ? (
    <Loader />
  ) : (
    <View style={styles.container}>
      {orderDetails && (
        <>
          <View>
            <View style={styles.row}>
              <Text style={styles.label}>{i18n.t('pharmacy-name')}</Text>
              <Text style={styles.value}>{orderDetails.pharmacy.name}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>{i18n.t('user-address-details')}</Text>
              <Text style={styles.value}>{orderDetails.pharmacy.addressDetails}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>{i18n.t('user-mobile')}</Text>
              <Text style={styles.value}>{orderDetails.pharmacy.mobile}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>{i18n.t('warehouse-name')}</Text>
              <Text style={styles.value}>{orderDetails.warehouse.name}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>{i18n.t('total-invoice-price')}</Text>
              <Text style={styles.value}>{computeTotalPrice()}</Text>
            </View>
          </View>

          <View style={styles.topActionsView}>
            {user.type === UserTypeConstants.PHARMACY && (
              <TouchableOpacity onPress={() => markOrdersAs('received')}>
                <View style={styles.action}>
                  <Text style={styles.actionText}>{i18n.t('mark-as-received')}</Text>
                  <Ionicons name="checkmark-done" size={16} color={Colors.SUCCEEDED_COLOR} />
                </View>
              </TouchableOpacity>
            )}

            {user.type === UserTypeConstants.PHARMACY && (
              <TouchableOpacity onPress={() => markOrdersAs('sent')}>
                <View style={styles.action}>
                  <Text style={styles.actionText}>{i18n.t('mark-as-sent')}</Text>
                  <FontAwesome name="send" size={16} color={Colors.SUCCEEDED_COLOR} />
                </View>
              </TouchableOpacity>
            )}

            {user.type === UserTypeConstants.WAREHOUSE && (
              <>
                <TouchableOpacity onPress={() => markOrdersAs('sent')}>
                  <View style={styles.action}>
                    <Text style={styles.actionText}>{i18n.t('mark-as-shipped')}</Text>
                    <MaterialIcons name="local-shipping" size={16} color={Colors.SUCCEEDED_COLOR} />
                  </View>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => markOrdersAs('received')}>
                  <View style={styles.action}>
                    <Text style={styles.actionText}>{i18n.t('mark-as-received')}</Text>
                    <Ionicons name="checkmark-done" size={16} color={Colors.SUCCEEDED_COLOR} />
                  </View>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => markOrdersAs('dontServe')}>
                  <View style={styles.action}>
                    <Text style={styles.actionText}>{i18n.t('mark-as-will-dont-server')}</Text>
                    <MaterialIcons name="remove-done" size={16} color={Colors.FAILED_COLOR} />
                  </View>
                </TouchableOpacity>
              </>
            )}
          </View>

          {orderDetails.items?.length > 0 && (
            <FlatList
              data={orderDetails.items}
              keyExtractor={(item) => item._id}
              contentContainerStyle={{ backgroundColor: Colors.WHITE_COLOR, padding: 10 }}
              numColumns={1}
              renderItem={({ item, index }) => <CartItem item={item} key={index} inOrderDetails={true} />}
            />
          )}
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.WHITE_COLOR,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 5,
  },
  label: {
    width: 90,
    color: Colors.GREY_COLOR,
    fontSize: 12,
  },
  value: {
    flex: 1,
    color: Colors.MAIN_COLOR,
    fontSize: 18,
    textAlign: 'left',
  },
  topActionsView: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
    marginVertical: 10,
    marginHorizontal: 20,
  },
  action: {
    flexDirection: 'row',
    backgroundColor: Colors.SECONDARY_COLOR,
    padding: 5,
    borderRadius: 6,
  },
  actionText: { color: Colors.WHITE_COLOR, marginEnd: 10 },
});

export default OrderDetailsScreen;
