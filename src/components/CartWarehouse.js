import i18n from '../i18n/index';
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native';
import { BottomSheet } from 'react-native-btr';
import Toast from 'react-native-toast-message';

// component
import CartItem from './CartItem';
import ConfirmBottomSheet from './ConfirmBottomSheet';

// redux stuff
import { unwrapResult } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';
import { changeMyPoints, selectUserData } from '../redux/auth/authSlice';
import { resetCartItems, selectCartItems } from '../redux/cart/cartSlice';
import { saveOrder } from '../redux/orders/ordersSlice';
import { addStatistics } from '../redux/statistics/statisticsSlice';

// icons
import { AntDesign, FontAwesome } from '@expo/vector-icons';

// constants
import { Colors, OfferTypes, OrdersStatusOptions } from '../utils/constants';

if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

const CartWarehouse = ({ warehouse, index }) => {
  const dispatch = useDispatch();

  // selectors
  const { user, token } = useSelector(selectUserData);
  const cartItems = useSelector(selectCartItems);

  // owns state
  const [showLoadingModal, setShowLoadingModal] = useState(false);
  const [showConfirmSaveOrder, setShowConfirmSaveOrder] = useState(false);
  const [showWarningMsg, setShowWarningMsg] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const computeTotalPrice = (() => {
    let invoiceTotal = 0;
    let itemsPoints = 0;

    cartItems
      .filter((ci) => ci.warehouse.name === warehouse.name)
      .forEach((ci) => {
        invoiceTotal =
          invoiceTotal +
          ci.qty * ci.item.price -
          (ci.bonus && ci.bonusType === OfferTypes.PERCENTAGE ? (ci.qty * ci.item.price * ci.bonus) / 100 : 0);

        itemsPoints = itemsPoints + ci.point;
      });

    return { invoiceTotal, itemsPoints };
  })();

  const numbersOfPoint =
    warehouse.includeInPointSystem && warehouse.pointForAmount && warehouse.amountToGetPoint
      ? Math.floor(computeTotalPrice.invoiceTotal / warehouse.amountToGetPoint) * warehouse.pointForAmount
      : 0;

  const checkOrderHandler = () => {
    if (warehouse.invoiceMinTotal > 0 && computeTotalPrice.invoiceTotal < warehouse.invoiceMinTotal) {
      setShowWarningMsg(true);
      return;
    }

    setShowConfirmSaveOrder(true);
  };

  const sendOrderHandler = () => {
    setShowLoadingModal(true);

    let obj = {
      pharmacy: user._id,
      warehouse: warehouse._id,
      items: cartItems
        .filter((ci) => ci.warehouse.name === warehouse.name)
        .map((ci) => {
          return {
            item: ci.item._id,
            qty: ci.qty,
            bonus: ci.bonus,
            bonusType: ci.bonusType,
            price: ci.item.price,
          };
        }),
      totalInvoicePrice: computeTotalPrice.invoiceTotal,
      totalInvoicePoints: numbersOfPoint + computeTotalPrice.itemsPoints,
      status: OrdersStatusOptions.SENT_BY_PHARMACY,
    };

    dispatch(saveOrder({ obj, token }))
      .then(unwrapResult)
      .then(() => {
        dispatch(
          addStatistics({
            obj: {
              sourceUser: user._id,
              targetUser: null,
              action: 'user-made-an-order',
            },
            token,
          }),
        );
        dispatch(resetCartItems(warehouse));

        if (numbersOfPoint + computeTotalPrice.itemsPoints > 0) {
          try {
            dispatch(
              changeMyPoints({
                token,
                obj: {
                  id: user._id,
                  amount: numbersOfPoint + computeTotalPrice.itemsPoints,
                },
              }),
            );
          } catch (err) {}
        }

        setShowConfirmSaveOrder(false);
        setShowLoadingModal(false);
        Toast.show({
          type: 'success',
          text1: i18n.t('send-order'),
          text2: i18n.t('send-order-succeeded'),
        });
      })
      .catch((err) => {
        setShowConfirmSaveOrder(false);
        setShowLoadingModal(false);
        Toast.show({
          type: 'error',
          text1: i18n.t('send-order'),
          text2: i18n.t('send-order-failed'),
        });
      });
  };

  const onPress = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded(!expanded);
  };

  return (
    <>
      <ScrollView>
        <View style={{ ...styles.container, backgroundColor: index % 2 === 0 ? Colors.WHITE_COLOR : '#ffe' }}>
          <View>
            <Text style={{ ...styles.text, ...styles.bold, color: Colors.DARK_COLOR }}>{warehouse.name}</Text>
            <Text style={{ ...styles.text, color: Colors.SUCCEEDED_COLOR }}>
              {i18n.t('order-total-price')} {computeTotalPrice.invoiceTotal}
            </Text>

            <Text style={{ ...styles.text, color: Colors.SUCCEEDED_COLOR }}>
              {i18n.t('number of points that you get')} {computeTotalPrice.itemsPoints + numbersOfPoint}
            </Text>

            {warehouse.costOfDeliver > 0 && (
              <Text style={{ ...styles.text, color: Colors.LIGHT_COLOR }}>
                {i18n.t('deliver-cost')}: {warehouse.costOfDeliver} %
              </Text>
            )}

            {warehouse.invoiceMinTotal > 0 && (
              <Text style={{ ...styles.text, color: Colors.LIGHT_COLOR }}>
                {i18n.t('minimum-invoice-cost')}: {warehouse.invoiceMinTotal}
              </Text>
            )}

            <TouchableOpacity onPress={checkOrderHandler} style={{ ...styles.actionView }}>
              <FontAwesome name="send" size={16} color={Colors.WHITE_COLOR} style={{ marginEnd: 10 }} />
              <Text style={{ ...styles.actionText }}>{i18n.t('send-order')}</Text>
            </TouchableOpacity>
            {warehouse.fastDeliver && (
              <Text style={{ ...styles.text, color: Colors.DARK_COLOR }}>{i18n.t('fast-deliver')}</Text>
            )}
            {warehouse.payAtDeliver && (
              <Text style={{ ...styles.text, color: Colors.FAILED_COLOR }}>
                {i18n.t('dear-partner-pay-when-deliver')}
              </Text>
            )}
          </View>

          {expanded &&
            cartItems
              .filter((ci) => ci.warehouse.name === warehouse.name)
              .map((ci, index) => <CartItem cartItem={ci} key={index} />)}

          <View style={styles.expandedIcon}>
            <AntDesign
              name={expanded ? 'caretup' : 'caretdown'}
              size={20}
              color={Colors.MAIN_COLOR}
              onPress={onPress}
            />
          </View>
        </View>
      </ScrollView>

      <BottomSheet
        visible={showConfirmSaveOrder}
        //setting the visibility state of the bottom shee
        onBackButtonPress={() => setShowConfirmSaveOrder(false)}
        //Toggling the visibility state on the click of the back botton
        onBackdropPress={() => setShowConfirmSaveOrder(false)}
        //Toggling the visibility state on the clicking out side of the sheet
      >
        <ConfirmBottomSheet
          header="send-order"
          message="confirm-save-order"
          okLabel="ok-label"
          cancelLabel="cancel-label"
          okAction={sendOrderHandler}
          cancelAction={() => setShowConfirmSaveOrder(false)}
        />
      </BottomSheet>

      <BottomSheet
        visible={showWarningMsg}
        //setting the visibility state of the bottom shee
        onBackButtonPress={() => setShowWarningMsg(false)}
        //Toggling the visibility state on the click of the back botton
        onBackdropPress={() => setShowWarningMsg(false)}
        //Toggling the visibility state on the clicking out side of the sheet
      >
        <ConfirmBottomSheet
          header="minimum-invoice-cost"
          message="minimum-invoice-cost-error"
          cancelLabel="cancel-label"
          cancelAction={() => setShowWarningMsg(false)}
        />
      </BottomSheet>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    margin: 5,
    marginBottom: 25,
    padding: 10,
    paddingBottom: 25,
    borderWidth: 1,
    borderColor: '#e3e3e3',
    borderRadius: 12,
  },
  actionText: {
    fontSize: 16,
    textAlign: 'center',
    color: Colors.WHITE_COLOR,
    paddingVertical: 10,
    fontWeight: 'bold',
  },
  actionView: {
    flexDirection: 'row',
    backgroundColor: Colors.BLUE_COLOR,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 6,
    marginVertical: 5,
  },
  expandedIcon: {
    borderWidth: 1,
    borderColor: '#e3e3e3',
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 18,
    position: 'absolute',
    bottom: -18,
    backgroundColor: '#e3e3e3',
    alignSelf: 'center',
  },
  text: {
    fontSize: 16,
    textAlign: 'center',
  },
  bold: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default CartWarehouse;
