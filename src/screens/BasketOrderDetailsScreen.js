import React, { useEffect, useState } from 'react';
import i18n from 'i18n-js';
import axios from 'axios';

import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';

// redux stuff
import { useDispatch, useSelector } from 'react-redux';
import { selectUserData } from '../redux/auth/authSlice';
import { selectBasketOrders, updateOrders } from '../redux/basketOrdersSlice/basketOrdersSlice';

// icons
import { Ionicons, FontAwesome, MaterialIcons } from '@expo/vector-icons';

// constants
import { BASEURL, Colors, OfferTypes, UserTypeConstants } from '../utils/constants';

// component
import Loader from '../components/Loader';
import CartItem from '../components/CartItem';
import ExpandedView from '../components/ExpandedView';
import Basket from '../components/Basket';

const BasketOrderDetailsScreen = ({ route }) => {
  const { params :{orderId} } = route.params;
  const dispatch = useDispatch();

  const { token, user } = useSelector(selectUserData);
  const { status } = useSelector(selectBasketOrders);

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

  const getBasketOrderDetails = async () => {
    setEmptyMsg("");
    setLoading(true);
    axios
      .get(`${BASEURL}/ordered-baskets/details?id=${orderId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        if (response.data.data.order === null) {
          setEmptyMsg("order-deleted");
        } else {
          setOrderDetails(response.data.data.basketOrder);
        }
      })
      .catch((err) => {
        setEmptyMsg("order-details-error");
      });

    setLoading(false);
  };

  useEffect(() => {
    getBasketOrderDetails();
  }, []);

  return orderDetails ? (
    <View style={styles.container}>
      {orderDetails && (
        <>
          <ExpandedView title={i18n.t('order-details')}>
            <View style={styles.row}>
              <Text style={styles.label}>{i18n.t('pharmacy-name')}</Text>
              <Text style={styles.value}>{orderDetails.pharmacy.name}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>{i18n.t('user-certificate-name')}</Text>
              <Text style={styles.value}>{orderDetails.pharmacy.certificateName}</Text>
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
          </ExpandedView>

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

          <Basket  basket={orderDetails.basket} />
        </>
      )}

      {status === 'loading' && <Loader />}
    </View>
  ) : (
    <Loader />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.WHITE_COLOR,
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 5,
    paddingStart: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e3e3e3',
  },
  label: {
    width: 90,
    color: Colors.GREY_COLOR,
    fontSize: 12,
  },
  value: {
    flex: 1,
    color: Colors.MAIN_COLOR,
    fontSize: 14,
    textAlign: 'left',
  },
  topActionsView: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    flexWrap: 'wrap',
    marginVertical: 10,
    marginHorizontal: 20,
  },
  action: {
    flexDirection: 'row',
    backgroundColor: Colors.SECONDARY_COLOR,
    padding: 5,
    borderRadius: 6,
    marginEnd: 10,
  },
  actionText: { color: Colors.WHITE_COLOR, marginEnd: 10 },
});

export default BasketOrderDetailsScreen;
