import React, { useCallback, useEffect, useState } from 'react';
import i18n from 'i18n-js';

import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Image,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
} from 'react-native';

// redux stuff
import { useDispatch, useSelector } from 'react-redux';
import { selectUserData } from '../redux/auth/authSlice';
import {
  getOrders,
  selectOrders,
  resetOrders,
  setPage,
  deleteOrder,
  getUnreadOrders,
  updateOrders,
} from '../redux/orders/ordersSlice';

import { Ionicons, FontAwesome, MaterialIcons } from '@expo/vector-icons';
// constants
import { Colors, UserTypeConstants } from '../utils/constants';

// components
import OrderRow from '../components/OrderRow';
import { unwrapResult } from '@reduxjs/toolkit';
import { useFocusEffect } from '@react-navigation/native';

const calculateSelectedOrdersCount = (orders) => {
  let count = 0;
  orders.forEach((o) => {
    count += o.selected ? 1 : 0;
  });
  return count;
};

const OrdersScreen = () => {
  const dispatch = useDispatch();

  const { user, token } = useSelector(selectUserData);
  const { status, error, count, orders, refresh, pageState, forceRefresh } = useSelector(selectOrders);
  const selectedOrdersCount = calculateSelectedOrdersCount(orders);

  const [refreshing, setRefreshing] = useState(false);

  const handleSearch = (page) => {
    dispatch(
      getOrders({
        token,
      }),
    );

    setRefreshing(false);
  };

  const onRefreshing = () => {
    setRefreshing(true);
    dispatch(resetOrders());
    dispatch(setPage(1));
    handleSearch();
  };

  const handleMoreResult = () => {
    if (orders.length < count) {
      handleSearch();
    }
  };

  const deleteOrderHandler = (orderId) => {
    dispatch(
      deleteOrder({
        token,
        orderId,
      }),
    );
  };

  // handle to change the status of the order
  const markOrdersAs = (verb) => {
    const ids = orders
      .filter(
        (o) =>
          o.selected &&
          ((user.type === UserTypeConstants.PHARMACY && o.pharmacyStatus !== verb) ||
            (user.type === UserTypeConstants.WAREHOUSE && o.warehouseStatus !== verb)),
      )
      .map((o) => o._id);

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
      )
        .then(unwrapResult)
        .then((result) => {
          dispatch(getUnreadOrders({ token }));
        });
    }
  };

  // useFocusEffect(
  //   useCallback(() => {
  //     // Do something when the screen is focused
  //     if (forceRefresh) {
  //       dispatch(setPage(1));
  //     }
  //     handleSearch();
  //     return () => {};
  //   }, [forceRefresh]),
  // );

  useEffect(() => {
    if (forceRefresh) {
      dispatch(setPage(1));
    }
    handleSearch();
  }, [forceRefresh]);

  return (
    <View style={styles.container}>
      {selectedOrdersCount > 0 && (
        <View style={styles.topActionsView}>
          {user.type === UserTypeConstants.PHARMACY && selectedOrdersCount > 0 && (
            <TouchableOpacity onPress={() => markOrdersAs('received')}>
              <View style={styles.action}>
                <Text style={styles.actionText}>{i18n.t('mark-as-received')}</Text>
                <Ionicons name="checkmark-done" size={16} color={Colors.SUCCEEDED_COLOR} />
              </View>
            </TouchableOpacity>
          )}

          {user.type === UserTypeConstants.PHARMACY && selectedOrdersCount > 0 && (
            <TouchableOpacity onPress={() => markOrdersAs('sent')}>
              <View style={styles.action}>
                <Text style={styles.actionText}>{i18n.t('mark-as-sent')}</Text>
                <FontAwesome name="send" size={16} color={Colors.SUCCEEDED_COLOR} />
              </View>
            </TouchableOpacity>
          )}

          {user.type === UserTypeConstants.WAREHOUSE && selectedOrdersCount > 0 && (
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
      )}

      {orders?.length === 0 && status !== 'loading' && (
        <ScrollView
          contentContainerStyle={{
            width: '100%',
            height: '100%',
          }}
          refreshControl={
            <RefreshControl
              //refresh control used for the Pull to Refresh
              refreshing={refreshing}
              onRefresh={onRefreshing}
            />
          }
        >
          <View style={styles.noContentContainer}>
            <Image source={require('../../assets/no-content.jpeg')} style={styles.noContentImage} />
            <Text style={styles.noContent}>{i18n.t('no-orders-found')}</Text>
          </View>
        </ScrollView>
      )}

      {orders?.length > 0 && (
        <FlatList
          data={orders}
          keyExtractor={(order) => order._id}
          contentContainerStyle={{
            padding: 20,
          }}
          refreshControl={
            <RefreshControl
              //refresh control used for the Pull to Refresh
              refreshing={refreshing}
              onRefresh={onRefreshing}
            />
          }
          numColumns={1}
          onEndReached={handleMoreResult}
          onEndReachedThreshold={0.1}
          renderItem={({ item }) => {
            return <OrderRow order={item} deleteAction={deleteOrderHandler} />;
          }}
        />
      )}

      {status === 'loading' && (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator size="large" color={Colors.SECONDARY_COLOR} />
          <Text
            style={{
              fontSize: 18,
              fontWeight: '700',
              color: Colors.SECONDARY_COLOR,
              marginTop: 20,
            }}
          >
            {i18n.t('loading-data')}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.WHITE_COLOR,
  },
  noContentContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noContentImage: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
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
    marginBottom: 5,
  },
  actionText: { color: Colors.WHITE_COLOR, marginEnd: 10 },
});

export default OrdersScreen;
