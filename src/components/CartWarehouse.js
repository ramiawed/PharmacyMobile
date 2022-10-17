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
import Loader from './Loader';
import ConfirmBottomSheet from './ConfirmBottomSheet';

// redux stuff
import { unwrapResult } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';
import { selectUserData } from '../redux/auth/authSlice';
import { resetCartItems, selectCartItems } from '../redux/cart/cartSlice';
import { saveOrder } from '../redux/orders/ordersSlice';
import { addStatistics } from '../redux/statistics/statisticsSlice';

// icons
import { AntDesign, FontAwesome } from '@expo/vector-icons';

// constants
import { Colors, OfferTypes } from '../utils/constants';

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
  const [expanded, setExpanded] = useState(false);

  const computeTotalPrice = () => {
    let total = 0;

    cartItems
      .filter((item) => item.warehouse.warehouse.name === warehouse)
      .forEach((item) => {
        total =
          total +
          item.qty * item.item.price -
          (item.bonus && item.bonusType === OfferTypes.PERCENTAGE
            ? (item.qty * item.item.price * item.bonus) / 100
            : 0);
      });

    return total;
  };

  const sendOrderHandler = () => {
    setShowLoadingModal(true);

    let obj = {
      pharmacy: user._id,
      warehouse: cartItems.filter((item) => item.warehouse.warehouse.name === warehouse)[0].warehouse.warehouse._id,
      items: cartItems
        .filter((item) => item.warehouse.warehouse.name === warehouse)
        .map((e) => {
          return {
            item: e.item._id,
            qty: e.qty,
            bonus: e.bonus,
            bonusType: e.bonusType,
            price: e.item.price,
            customer_price: e.item.customer_price,
          };
        }),
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
          <View style={styles.headerView}>
            <Text style={styles.title}>{warehouse}</Text>
            <Text style={styles.totalPrice}>
              {i18n.t('order-total-price')} {computeTotalPrice()}
            </Text>
            <TouchableOpacity
              onPress={() => {
                setShowConfirmSaveOrder(true);
              }}
              style={{ ...styles.actionView, flex: 3, backgroundColor: Colors.BLUE_COLOR }}
            >
              <FontAwesome name="send" size={16} color={Colors.WHITE_COLOR} style={{ marginEnd: 10 }} />
              <Text style={{ ...styles.actionText }}>{i18n.t('send-order')}</Text>
            </TouchableOpacity>
          </View>

          {expanded &&
            cartItems
              .filter((item) => item.warehouse.warehouse.name === warehouse)
              .map((item, index) => <CartItem item={item} key={index} />)}

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

      {showLoadingModal && <Loader />}
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
  totalPrice: {
    color: Colors.SUCCEEDED_COLOR,
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 18,
    marginVertical: 10,
  },
  title: { color: Colors.MAIN_COLOR, fontSize: 18, fontWeight: 'bold', textAlign: 'center' },
  sendBtn: {
    backgroundColor: Colors.SUCCEEDED_COLOR,
    marginHorizontal: 5,
    padding: 5,
    borderRadius: 6,
  },
  bottomNavigationView: {
    backgroundColor: '#fff',
    width: '100%',
    height: 170,
    justifyContent: 'center',
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  okBtn: {
    backgroundColor: Colors.SUCCEEDED_COLOR,
    color: Colors.WHITE_COLOR,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
    marginHorizontal: 5,
  },
  cancelBtn: {
    backgroundColor: Colors.FAILED_COLOR,
    color: Colors.WHITE_COLOR,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
    marginHorizontal: 5,
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
    backgroundColor: Colors.SUCCEEDED_COLOR,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 6,
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
});

export default CartWarehouse;
