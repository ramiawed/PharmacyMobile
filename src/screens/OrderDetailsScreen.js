import React, { useEffect, useState } from 'react';
import axios from 'axios';
import i18n from 'i18n-js';
// libraries
import { BottomSheet } from 'react-native-btr';
import Toast from 'react-native-toast-message';

import { View, StyleSheet, FlatList, Text } from 'react-native';

// redux stuff
import { unwrapResult } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';
import { selectUserData } from '../redux/auth/authSlice';
import { updateOrder } from '../redux/orders/ordersSlice';

// icons

// constants
import { BASEURL, Colors, OfferTypes, OrdersStatusOptions, UserTypeConstants } from '../utils/constants';

// component
import OrderDetailsInfoBottomSheet from '../components/OrderDetailsInfoBottomSheet';
import ChooseDateBottomSheet from '../components/ChooseDateBottomSheet';
import ConfirmBottomSheet from '../components/ConfirmBottomSheet';
import CartItem from '../components/CartItem';
import Loader from '../components/Loader';
import Button from '../components/Button';
import ScreenWrapper from './ScreenWrapper';

const OrderDetailsScreen = ({ route }) => {
  let { orderId } = route.params;

  // if (!orderId) {
  //   orderId = route.params?.orderId;
  // }
  const dispatch = useDispatch();

  const { token, user } = useSelector(selectUserData);

  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [emptyMsg, setEmptyMsg] = useState('');
  const [showOrderDetailsInfo, setShowOrderDetailsInfo] = useState(false);
  const [showConfirmDontServerModal, setShowConfirmDontServeModal] = useState(false);
  const [showConfirmDateBottomSheet, setShowConfirmDateBottomSheet] = useState(false);
  const [showDeliverDateBottomSheet, setShowDeliverDateBottomSheet] = useState(false);
  const [showShippedDateBottomSheet, setShowShippedDateBottomSheet] = useState(false);

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

  const showToast = (type, msg) => {
    Toast.show({
      type: type,
      text1: i18n.t('edit-order-label'),
      text2: i18n.t(msg),
    });
  };

  const warehouseDontServeHanlder = () => {
    dispatch(
      updateOrder({
        obj: {
          status: OrdersStatusOptions.WILL_DONT_SERVER,
          couldNotDeliverDate: Date.now(),
        },
        id: orderId,
        token,
      }),
    )
      .then(unwrapResult)
      .then(() => {
        showToast('success', 'change-order-status-success');
        getOrderDetails();
      })
      .catch(() => {
        showToast('error', 'change-order-status-failed');
      });
  };

  const confirmOrderHanlder = (date) => {
    const confirmDate = date ? new Date(date) : new Date();

    dispatch(
      updateOrder({
        obj: {
          status: OrdersStatusOptions.CONFIRM,
          confirmDate: confirmDate,
        },
        id: orderId,
        token,
      }),
    )
      .then(unwrapResult)
      .then(() => {
        showToast('success', 'change-order-status-success');
      })
      .catch(() => {
        showToast('error', 'change-order-status-failed');
      });
  };

  const deliverHandler = (date, time) => {
    const deliverDate = date ? new Date(date) : new Date();
    const deliverTime = time ? time : '';

    dispatch(
      updateOrder({
        obj: {
          status: OrdersStatusOptions.DELIVERY,
          deliverDate,
          deliverTime,
        },
        id: orderId,
        token,
      }),
    )
      .then(unwrapResult)
      .then(() => {
        showToast('success', 'change-order-status-success');
      })
      .catch(() => {
        showToast('error', 'change-order-status-failed');
      });
  };

  const shippedHandler = (date, time) => {
    const shippedDate = date ? new Date(date) : null;
    const shippedTime = time ? time : '';

    dispatch(
      updateOrder({
        obj: {
          status: OrdersStatusOptions.SHIPPING,
          shippedDate,
          shippedTime,
        },
        id: orderId,
        token,
      }),
    )
      .then(unwrapResult)
      .then(() => {
        showToast('success', 'change-order-status-success');
      })
      .catch(() => {
        showToast('error', 'change-order-status-failed');
      });
  };

  useEffect(() => {
    getOrderDetails();
  }, []);

  return loading ? (
    <Loader />
  ) : orderDetails ? (
    <ScreenWrapper>
      <View style={styles.container}>
        <View style={styles.actionsView}>
          <Button
            color={Colors.LIGHT_COLOR}
            pressHandler={() => {
              setShowOrderDetailsInfo(true);
            }}
            text={i18n.t('order-details')}
          />
          {(user.type === UserTypeConstants.ADMIN || user.type === UserTypeConstants.WAREHOUSE) && (
            <>
              <Button
                color={Colors.LIGHT_COLOR}
                pressHandler={() => {
                  setShowConfirmDontServeModal(true);
                }}
                text={i18n.t('will-dont-serve-label')}
              />
              <Button
                color={Colors.LIGHT_COLOR}
                pressHandler={() => {
                  setShowConfirmDateBottomSheet(true);
                }}
                text={i18n.t('confirm-order-label')}
              />
              <Button
                color={Colors.LIGHT_COLOR}
                pressHandler={() => {
                  setShowDeliverDateBottomSheet(true);
                }}
                text={i18n.t('deliver-order-label')}
              />
              <Button
                color={Colors.LIGHT_COLOR}
                pressHandler={() => {
                  setShowShippedDateBottomSheet(true);
                }}
                text={i18n.t('shipped-order-label')}
              />
            </>
          )}
        </View>

        <View style={{ ...styles.row, ...styles.center }}>
          <Text style={styles.status}>{i18n.t(orderDetails.status)}</Text>
          {orderDetails.status === OrdersStatusOptions.WILL_DONT_SERVER && (
            <Text style={styles.status}>{orderDetails.couldNotDeliverDate.split('T')[0]}</Text>
          )}
          {orderDetails.status === OrdersStatusOptions.CONFIRM && (
            <Text style={styles.status}>{orderDetails.confirmDate.split('T')[0]}</Text>
          )}
          {orderDetails.status === OrdersStatusOptions.DELIVERY && (
            <Text style={styles.status}>
              {orderDetails.deliverDate?.split('T')[0]}{' '}
              {orderDetails.deliverTime ? `---${i18n.t('time-label')}: ${orderDetails.deliverTime}` : ''}
            </Text>
          )}
          {orderDetails.status === OrdersStatusOptions.SHIPPING && (
            <Text style={styles.status}>
              {orderDetails.shippedDate ? orderDetails.shippedDate.split('T')[0] : i18n.t('shipped-done')}
              {orderDetails.shippedTime ? `---${i18n.t('time-label')}: ${orderDetails.shippedTime}` : ''}
            </Text>
          )}
        </View>

        <FlatList
          data={orderDetails.items}
          keyExtractor={(item) => item._id}
          contentContainerStyle={{ backgroundColor: Colors.WHITE_COLOR }}
          numColumns={1}
          renderItem={({ item, index }) => <CartItem item={item} key={index} inOrderDetails={true} />}
        />

        <BottomSheet
          visible={showOrderDetailsInfo}
          onBackButtonPress={() => setShowOrderDetailsInfo(false)}
          onBackdropPress={() => setShowOrderDetailsInfo(false)}
        >
          <OrderDetailsInfoBottomSheet
            cancelLabel="close-label"
            header="order-details"
            cancelAction={() => setShowOrderDetailsInfo(false)}
            orderDetails={orderDetails}
            computeTotalPrice={computeTotalPrice}
          />
        </BottomSheet>

        <BottomSheet
          visible={showConfirmDontServerModal}
          onBackButtonPress={() => setShowConfirmDontServeModal(false)}
          onBackdropPress={() => setShowConfirmDontServeModal(false)}
        >
          <ConfirmBottomSheet
            header="will-dont-serve-label"
            message="dont-serve-confirm-msg"
            okAction={() => {
              warehouseDontServeHanlder();
              setShowConfirmDontServeModal(false);
            }}
            okLabel="ok-label"
            cancelAction={() => setShowConfirmDontServeModal(false)}
            cancelLabel="cancel-label"
          />
        </BottomSheet>

        <BottomSheet
          visible={showConfirmDateBottomSheet}
          onBackButtonPress={() => setShowConfirmDateBottomSheet(false)}
          onBackdropPress={() => setShowConfirmDateBottomSheet(false)}
        >
          <ChooseDateBottomSheet
            cancelAction={() => setShowConfirmDateBottomSheet(false)}
            header="confirm-order-label"
            message="confirm-order-confirm-msg"
            handler={confirmOrderHanlder}
            // withTime={true}
          />
        </BottomSheet>

        <BottomSheet
          visible={showDeliverDateBottomSheet}
          onBackButtonPress={() => setShowDeliverDateBottomSheet(false)}
          onBackdropPress={() => setShowDeliverDateBottomSheet(false)}
        >
          <ChooseDateBottomSheet
            cancelAction={() => setShowDeliverDateBottomSheet(false)}
            header="deliver-order-label"
            message="deliver-confirm-msg"
            handler={deliverHandler}
            withTime={true}
          />
        </BottomSheet>

        <BottomSheet
          visible={showShippedDateBottomSheet}
          onBackButtonPress={() => setShowShippedDateBottomSheet(false)}
          onBackdropPress={() => setShowShippedDateBottomSheet(false)}
        >
          <ChooseDateBottomSheet
            cancelAction={() => setShowShippedDateBottomSheet(false)}
            header="shipped-order-label"
            message="shipped-confirm-msg"
            handler={shippedHandler}
            withTime={true}
          />
        </BottomSheet>
      </View>
    </ScreenWrapper>
  ) : (
    <></>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.WHITE_COLOR,
    width: '100%',
  },
  actionsView: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-around',
    padding: 5,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    paddingVertical: 5,
  },
  status: {
    color: Colors.SUCCEEDED_COLOR,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  center: { alignItems: 'center', justifyContent: 'center' },
});

export default OrderDetailsScreen;
