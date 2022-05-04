import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { View, Text, StyleSheet, CheckBox, TouchableWithoutFeedback } from 'react-native';

// libraries
import { BottomSheet } from 'react-native-btr';
import ConfirmBottomSheet from '../components/ConfirmBottomSheet';

// redux stuff
import { unwrapResult } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';
import { selectUserData } from '../redux/auth/authSlice';
import { decrementUnreadOrder, selectedChange, updateOrder } from '../redux/orders/ordersSlice';

// icons
import { Ionicons, FontAwesome, MaterialIcons, AntDesign } from '@expo/vector-icons';

// constants
import { Colors, UserTypeConstants } from '../utils/constants';

const OrderRow = ({ order, deleteAction }) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const { user, token } = useSelector(selectUserData);

  const [showDeleteConfirmBts, setShowDeleteConfirmBts] = useState(false);

  const rowClickHandler = (id) => {
    if (user.type !== UserTypeConstants.PHARMACY) {
      let obj = {};

      if (user.type === UserTypeConstants.ADMIN && !order.seenByAdmin) {
        obj = {
          seenByAdmin: true,
        };
      }

      if (user.type === UserTypeConstants.WAREHOUSE && order.warehouseStatus === 'unread') {
        obj = {
          warehouseStatus: 'received',
        };
      }

      if (Object.keys(obj).length > 0) {
        dispatch(updateOrder({ id, obj, token }))
          .then(unwrapResult)
          .then(() => {
            dispatch(decrementUnreadOrder({ token }));
          });
      }
    }

    navigation.navigate('Orders', {
      screen: 'Order',
      params: {
        orderId: order._id,
      },
    });
  };

  return order ? (
    <View style={styles.container}>
      {user.type !== UserTypeConstants.ADMIN && (
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <CheckBox value={order.selected} onValueChange={() => dispatch(selectedChange(order._id))} />
        </View>
      )}

      <TouchableWithoutFeedback
        style={{ ...styles.details, borderStartWidth: user.type === UserTypeConstants.ADMIN ? 0 : 1 }}
        onPress={() => rowClickHandler(order._id)}
      >
        <View style={styles.details}>
          {(user.type === UserTypeConstants.ADMIN || user.type === UserTypeConstants.WAREHOUSE) && (
            <View style={styles.row}>
              {order.pharmacyStatus === 'received' && (
                <Ionicons name="checkmark-done" size={16} color={Colors.SUCCEEDED_COLOR} />
              )}
              {order.pharmacyStatus === 'sent' && <FontAwesome name="send" size={16} color={Colors.SUCCEEDED_COLOR} />}
              <Text style={styles.name}>{order.pharmacy?.name}</Text>
              <Text style={styles.address}>{order.pharmacy?.addressDetails}</Text>
            </View>
          )}

          {(user.type === UserTypeConstants.ADMIN || user.type === UserTypeConstants.PHARMACY) && (
            <View style={styles.row}>
              {order.warehouseStatus === 'unread' && (
                <Ionicons name="mail-unread-outline" size={16} color={Colors.MAIN_COLOR} />
              )}
              {order.warehouseStatus === 'received' && (
                <Ionicons name="checkmark-done" size={16} color={Colors.SUCCEEDED_COLOR} />
              )}
              {order.warehouseStatus === 'sent' && (
                <MaterialIcons name="local-shipping" size={16} color={Colors.SUCCEEDED_COLOR} />
              )}
              {order.warehouseStatus === 'dontServe' && (
                <MaterialIcons name="remove-done" size={16} color={Colors.FAILED_COLOR} />
              )}
              <Text style={styles.name}>{order.warehouse?.name}</Text>
            </View>
          )}

          <View style={[styles.date]}>
            <Text style={styles.dateText}>{order.createdAt?.split('T')[0]}</Text>
          </View>
        </View>
      </TouchableWithoutFeedback>

      <View style={styles.actions}>
        {user.type === UserTypeConstants.ADMIN && !order.seenByAdmin && (
          <Ionicons name="mail-unread-outline" size={16} color={Colors.MAIN_COLOR} />
        )}
        {user.type === UserTypeConstants.WAREHOUSE && order.warehouseStatus === 'sent' && (
          <MaterialIcons name="local-shipping" size={16} color={Colors.SUCCEEDED_COLOR} />
        )}
        {user.type === UserTypeConstants.WAREHOUSE && order.warehouseStatus === 'unread' && (
          <Ionicons name="mail-unread-outline" size={16} color={Colors.MAIN_COLOR} />
        )}
        {user.type === UserTypeConstants.WAREHOUSE && order.warehouseStatus === 'received' && (
          <Ionicons name="checkmark-done" size={16} color={Colors.SUCCEEDED_COLOR} />
        )}
        {user.type === UserTypeConstants.WAREHOUSE && order.warehouseStatus === 'dontServe' && (
          <MaterialIcons name="remove-done" size={16} color={Colors.FAILED_COLOR} />
        )}

        {user.type === UserTypeConstants.PHARMACY && order.pharmacyStatus === 'sent' && (
          <FontAwesome name="send" size={16} color={Colors.SUCCEEDED_COLOR} />
        )}

        {user.type === UserTypeConstants.PHARMACY && order.pharmacyStatus === 'received' && (
          <Ionicons name="checkmark-done" size={16} color={Colors.SUCCEEDED_COLOR} />
        )}

        {user.type !== UserTypeConstants.WAREHOUSE ? (
          <AntDesign
            name="delete"
            size={20}
            color={Colors.FAILED_COLOR}
            onPress={() => setShowDeleteConfirmBts(true)}
          />
        ) : null}
      </View>

      <BottomSheet
        visible={showDeleteConfirmBts}
        onBackButtonPress={() => setShowDeleteConfirmBts(false)}
        onBackdropPress={() => setShowDeleteConfirmBts(false)}
      >
        <ConfirmBottomSheet
          okLabel="ok-label"
          cancelLabel="cancel-label"
          header="delete-order-confirm-header"
          message="delete-order-confirm-msg"
          cancelAction={() => setShowDeleteConfirmBts(false)}
          okAction={() => deleteAction(order._id)}
        />
      </BottomSheet>
    </View>
  ) : null;
};

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: '#e3e3e3',
    flexDirection: 'row',
    padding: 5,
    marginBottom: 10,
    borderRadius: 6,
  },
  details: {
    paddingHorizontal: 10,
    flex: 1,
    borderStartColor: Colors.SECONDARY_COLOR,
    // borderStartWidth: 1,
    borderEndColor: Colors.SECONDARY_COLOR,
    borderEndWidth: 1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: Colors.SECONDARY_COLOR,
    flex: 1,
    paddingVertical: 5,
  },
  name: {
    color: Colors.MAIN_COLOR,
    fontWeight: 'bold',
    marginStart: 10,
    flex: 1,
  },
  address: {
    color: Colors.SECONDARY_COLOR,
    fontSize: 10,
  },
  date: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    flex: 1,
    paddingVertical: 5,
  },
  dateText: {
    color: Colors.SUCCEEDED_COLOR,
  },
  actions: {
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingStart: 10,
  },
});

export default OrderRow;
