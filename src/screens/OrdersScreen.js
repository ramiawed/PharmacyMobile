import React, { useEffect, useState } from 'react';
import i18n from 'i18n-js';

import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  RefreshControl,
  Image,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
  Button,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

// components
import SearchContainer from '../components/SearchContainer';
import CustomPicker from '../components/CustomPicker';
import OrderRow from '../components/OrderRow';
import Loader from '../components/Loader';

// redux stuff
import { unwrapResult } from '@reduxjs/toolkit';
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
  setSearchPharmacyName,
  setSearchWarehouseName,
  setAdminOrderStatus,
  setWarehouseOrderStatus,
  setPharmacyOrderStatus,
  setDateOption,
  setSearchDate,
} from '../redux/orders/ordersSlice';

// icons
import { Ionicons, FontAwesome, MaterialIcons, Fontisto } from '@expo/vector-icons';

// constants
import {
  AdminOrderStatus,
  Colors,
  DateOptions,
  PharmacyOrderStatus,
  UserTypeConstants,
  WarehouseOrderStatus,
} from '../utils/constants';
import Toast from 'react-native-toast-message';

const calculateSelectedOrdersCount = (orders) => {
  let count = 0;
  orders.forEach((o) => {
    count += o.selected ? 1 : 0;
  });
  return count;
};

const OrdersScreen = () => {
  const dispatch = useDispatch();

  // selectors
  const { user, token } = useSelector(selectUserData);
  const { status, count, orders, pageState, forceRefresh, deleteStatus } = useSelector(selectOrders);
  const selectedOrdersCount = calculateSelectedOrdersCount(orders);

  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate ? selectedDate : date;
    setShow(false);
    setDate(currentDate);
    dispatch(setSearchDate(JSON.stringify(currentDate)));
    onSearchSubmit();
  };

  const showMode = (currentMode) => {
    setShow(true);
    setMode(currentMode);
  };

  const showDatepicker = () => {
    showMode('date');
  };

  // own states
  const [refreshing, setRefreshing] = useState(false);

  const handleSearch = () => {
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

  const onSearchSubmit = () => {
    dispatch(resetOrders());
    dispatch(setPage(1));
    handleSearch();
  };

  const deleteOrderHandler = (orderId) => {
    dispatch(
      deleteOrder({
        token,
        orderId,
      }),
    )
      .then(unwrapResult)
      .then(() => {
        Toast.show({
          type: 'success',
          text1: i18n.t('delete-order-confirm-header'),
          text2: i18n.t('delete-order-success'),
        });
      })
      .catch((err) => {
        Toast.show({
          type: 'error',
          text1: i18n.t('delete-order-confirm-header'),
          text2: i18n.t('delete-order-failed'),
        });
      });
  };

  const formatDate = (d) => {
    if (d) {
      let dd = String(d.getDate()).padStart(2, '0');
      let mm = String(d.getMonth() + 1).padStart(2, '0'); //January is 0!
      let yyyy = d.getFullYear();

      let selectedDate = dd + '/' + mm + '/' + yyyy;
      return selectedDate;
    }
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

  const adminOrderStatusOptions = [
    {
      value: AdminOrderStatus.ALL,
      label: i18n.t('all'),
    },

    {
      value: AdminOrderStatus.SEEN,
      label: i18n.t('seen'),
    },
    {
      value: AdminOrderStatus.NOT_SEEN,
      label: i18n.t('not-seen'),
    },
  ];

  const handleAdminOrderStatusOption = (val) => {
    dispatch(setAdminOrderStatus(val));
    onSearchSubmit();
  };

  const warehouseOrderStatusOptions = [
    {
      value: WarehouseOrderStatus.ALL,
      label: i18n.t('all'),
    },
    {
      value: WarehouseOrderStatus.UNREAD,
      label: i18n.t('unread'),
    },
    {
      value: WarehouseOrderStatus.RECEIVED,
      label: i18n.t('received'),
    },
    {
      value: WarehouseOrderStatus.SENT,
      label: i18n.t('shipped'),
    },
    {
      value: WarehouseOrderStatus.WILL_DONT_SERVER,
      label: i18n.t('will-dont-serve'),
    },
  ];

  const handleWarehouseOrderStatusOption = (val) => {
    dispatch(setWarehouseOrderStatus(val));
    onSearchSubmit();
  };

  const pharmacyOrderStatusOptions = [
    {
      value: PharmacyOrderStatus.ALL,
      label: i18n.t('all'),
    },

    {
      value: PharmacyOrderStatus.RECEIVED,
      label: i18n.t('received'),
    },
    {
      value: PharmacyOrderStatus.SENT,
      label: i18n.t('sent'),
    },
  ];

  const handlePharmacyOrderStatusOption = (val) => {
    dispatch(setPharmacyOrderStatus(val));
    onSearchSubmit();
  };

  const dateOptions = [
    { value: '', label: i18n.t('choose-date') },
    { value: DateOptions.ONE_DAY, label: i18n.t('one-day') },
    { value: DateOptions.THREE_DAY, label: i18n.t('three-days') },
    { value: DateOptions.ONE_WEEK, label: i18n.t('one-week') },
    { value: DateOptions.TWO_WEEK, label: i18n.t('two-weeks') },
    { value: DateOptions.ONE_MONTH, label: i18n.t('one-month') },
    { value: DateOptions.TWO_MONTH, label: i18n.t('two-months') },
    { value: DateOptions.SIX_MONTH, label: i18n.t('six-months') },
    { value: DateOptions.ONE_YEAR, label: i18n.t('one-year') },
  ];

  const handleDateOptions = (val) => {
    dispatch(setDateOption(val));
    onSearchSubmit();
  };

  useEffect(() => {
    if (forceRefresh) {
      dispatch(resetOrders());
      dispatch(setPage(1));
    }
    handleSearch();
  }, [forceRefresh]);

  return (
    <View style={styles.container}>
      <SearchContainer>
        {user.type !== UserTypeConstants.PHARMACY && (
          <TextInput
            style={styles.searchTextInput}
            placeholder={i18n.t('search-by-pharmacy-name')}
            onChangeText={(val) => {
              dispatch(setSearchPharmacyName(val));
            }}
            onSubmitEditing={onSearchSubmit}
            // onKeyPress={keyUpHandler}
            value={pageState.searchPharmacyName}
          />
        )}

        {user.type !== UserTypeConstants.WAREHOUSE && (
          <TextInput
            style={styles.searchTextInput}
            placeholder={i18n.t('search-by-warehouse-name')}
            onChangeText={(val) => {
              dispatch(setSearchWarehouseName(val));
            }}
            onSubmitEditing={onSearchSubmit}
            // onKeyPress={keyUpHandler}
            value={pageState.searchWarehouseName}
          />
        )}

        {user.type === UserTypeConstants.ADMIN && (
          <CustomPicker
            selectedValue={{
              label: '',
              value: pageState.adminOrderStatus,
            }}
            data={adminOrderStatusOptions}
            onChange={handleAdminOrderStatusOption}
            label={i18n.t('admin-order-status')}
            forSearch={true}
          />
        )}

        <CustomPicker
          selectedValue={{
            label: '',
            value: pageState.warehouseOrderStatus,
          }}
          data={warehouseOrderStatusOptions}
          onChange={handleWarehouseOrderStatusOption}
          label={i18n.t('warehouse-order-status')}
          forSearch={true}
        />

        <CustomPicker
          selectedValue={{
            label: '',
            value: pageState.pharmacyOrderStatus,
          }}
          data={pharmacyOrderStatusOptions}
          onChange={handlePharmacyOrderStatusOption}
          label={i18n.t('pharmacy-order-status')}
          forSearch={true}
        />

        <CustomPicker
          selectedValue={{
            label: '',
            value: pageState.dateOption,
          }}
          data={dateOptions}
          onChange={handleDateOptions}
          label={i18n.t('dates-within')}
          forSearch={true}
        />

        <View style={styles.date}>
          <Text>{i18n.t('date-label')}</Text>
          {/* <Button onPress={showDatepicker} title={i18n.t('date-label')} /> */}

          <Text style={{ color: Colors.MAIN_COLOR, flex: 1, textAlign: 'left', paddingHorizontal: 10 }}>
            {formatDate(date)}
          </Text>
          <Fontisto name="date" size={24} color={Colors.MAIN_COLOR} onPress={showDatepicker} />
          {show && (
            <DateTimePicker testID="dateTimePicker" value={date} mode={mode} is24Hour={true} onChange={onChange} />
          )}
        </View>
      </SearchContainer>

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
            paddingTop: 10,
            paddingHorizontal: 10,
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

      {deleteStatus === 'loading' && <Loader />}
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
    justifyContent: 'flex-start',
    flexWrap: 'wrap',
    marginTop: 10,
    marginHorizontal: 20,
  },
  action: {
    flexDirection: 'row',
    backgroundColor: Colors.SECONDARY_COLOR,
    padding: 5,
    borderRadius: 6,
    marginBottom: 5,
    marginEnd: 10,
  },
  actionText: { color: Colors.WHITE_COLOR, marginEnd: 10 },
  searchTextInput: {
    backgroundColor: Colors.WHITE_COLOR,
    borderRadius: 6,
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  date: {
    backgroundColor: Colors.WHITE_COLOR,
    width: '100%',
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateInput: {
    width: 60,
    backgroundColor: Colors.SECONDARY_COLOR,
    color: Colors.WHITE_COLOR,
    padding: 5,
    borderRadius: 6,
    marginHorizontal: 5,
    textAlign: 'center',
  },
});

export default OrdersScreen;
