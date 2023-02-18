import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, RefreshControl, FlatList, TouchableOpacity } from 'react-native';
import i18n from '../i18n';
import DateTimePicker from '@react-native-community/datetimepicker';

// components
import SearchContainer from '../components/SearchContainer';
import CustomPicker from '../components/CustomPicker';
import OrderRow from '../components/OrderRow';
import Loader from '../components/Loader';
import Toast from 'react-native-toast-message';
import NoContent from '../components/NoContent';
import SearchInput from '../components/SearchInput';
import LoadingData from '../components/LoadingData';
import Button from '../components/Button';

// redux stuff
import { unwrapResult } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';
import { selectUserData } from '../redux/auth/authSlice';
import {
  deleteOrder,
  deleteBasketOrder,
  getBasketsOrders,
  getOrders,
  resetBasketOrders,
  resetOrders,
  selectOrders,
  setOrderType,
  setSearchPharmacyName,
  setSearchWarehouseName,
  setOrderStatus,
  setDateOption,
  setSearchDate,
} from '../redux/orders/ordersSlice';

// icons
import { Fontisto } from '@expo/vector-icons';

// constants
import { Colors, DateOptions, OrdersStatusOptions, UserTypeConstants } from '../utils/constants';
import ScreenWrapper from './ScreenWrapper';
import PullDownToRefresh from '../components/PullDownToRefresh';

const OrdersScreen = ({ route }) => {
  const dispatch = useDispatch();
  // const { type } = route.params;

  // selectors
  const { user, token } = useSelector(selectUserData);
  const { status, error, count, orders, basketOrdersCount, basketOrders, pageState } = useSelector(selectOrders);

  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const showToast = (type, msg) => {
    Toast.show({
      type: type,
      text1: i18n.t('delete-order-label'),
      text2: i18n.t(msg),
    });
  };

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

  const onSearchSubmit = () => {
    dispatch(pageState.type === 'normal' ? resetOrders() : resetBasketOrders());
    handleSearch(pageState.type);
  };

  const deleteOrderHandler = (orderId) => {
    dispatch(
      pageState.type === 'normal'
        ? deleteOrder({
            token,
            orderId,
          })
        : deleteBasketOrder({
            token,
            orderId,
          }),
    )
      .then(unwrapResult)
      .then(() => {
        showToast('success', 'order-deleted-successfully-msg');
      })
      .catch(() => {
        showToast('error', 'order-deleted-failed-msg');
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

  const [selectedOrderStatusOption, setSelectedOrderStatusOption] = useState({
    value: OrdersStatusOptions.ALL,
    label: i18n.t('all'),
  });

  const orderStatusOptions = [
    {
      value: OrdersStatusOptions.ALL,
      label: i18n.t('all'),
    },
    {
      value: OrdersStatusOptions.SENT_BY_PHARMACY,
      label: i18n.t('sent-by-pharmacy-label'),
    },
    {
      value: OrdersStatusOptions.CONFIRM,
      label: i18n.t('confirm-label'),
    },
    {
      value: OrdersStatusOptions.DELIVERY,
      label: i18n.t('delivery-label'),
    },
    {
      value: OrdersStatusOptions.SHIPPING,
      label: i18n.t('shipping-label'),
    },
    {
      value: OrdersStatusOptions.WILL_DONT_SERVER,
      label: i18n.t('dont-serve-label'),
    },
  ];

  const handleOrderStatusOption = (itemValue, itemIndex) => {
    setSelectedOrderStatusOption(itemValue);
    dispatch(setOrderStatus(itemValue));
    onSearchSubmit();
  };

  const [selectedDateOption, setSelectedDateOption] = useState({
    value: '',
    label: i18n.t('choose-date'),
  });

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

  const handleDateOptions = (itemValue, itemIndex) => {
    setSelectedDateOption(itemValue);
    dispatch(setDateOption(itemValue));
    onSearchSubmit();
  };

  const handleSearch = (type) => {
    if (type === 'normal') {
      dispatch(getOrders({ token }));
    }

    if (type === 'special') {
      dispatch(getBasketsOrders({ token }));
    }

    setRefreshing(false);
  };

  const onRefreshing = () => {
    setRefreshing(true);
    if (pageState.type === 'normal') dispatch(resetOrders());
    if (pageState.type === 'special') dispatch(resetBasketOrders());
    handleSearch(pageState.type);
    setRefreshing(false);
  };

  const handleMoreResult = () => {
    if (pageState.type === 'normal' && orders.length < count && status !== 'loading') {
      handleSearch(pageState.type);
    }

    if (pageState.type === 'special' && basketOrders.length < basketOrdersCount && status !== 'loading') {
      handleSearch(pageState.type);
    }
  };

  const changeOrderTypeHandler = (type) => {
    dispatch(setOrderType(type));
    if (type === 'normal' && orders.length === 0) handleSearch(type);
    if (type === 'special' && basketOrders.length === 0) handleSearch(type);
    setRefreshing(false);
  };

  useEffect(() => {
    if (pageState.type === 'normal' && orders.length === 0) {
      handleSearch('normal');
    }

    if (pageState.type === 'special' && basketOrders.length === 0) {
      handleSearch('special');
    }
  }, []);

  return user ? (
    <ScreenWrapper>
      <View style={styles.container}>
        <SearchContainer>
          {user.type !== UserTypeConstants.PHARMACY && (
            <SearchInput
              placeholder={i18n.t('search-by-pharmacy-name')}
              onTextChange={(val) => {
                dispatch(setSearchPharmacyName(val));
              }}
              onSubmitEditing={onSearchSubmit}
              // onKeyPress={keyUpHandler}
              value={pageState.searchPharmacyName}
            />
          )}

          {user.type !== UserTypeConstants.WAREHOUSE && (
            <SearchInput
              placeholder={i18n.t('search-by-warehouse-name')}
              onTextChange={(val) => {
                dispatch(setSearchWarehouseName(val));
              }}
              onSubmitEditing={onSearchSubmit}
              // onKeyPress={keyUpHandler}
              value={pageState.searchWarehouseName}
            />
          )}

          <CustomPicker
            selectedValue={selectedOrderStatusOption}
            data={orderStatusOptions}
            onChange={handleOrderStatusOption}
            label={i18n.t('order-status-label')}
            forSearch={true}
          />

          <CustomPicker
            selectedValue={selectedDateOption}
            data={dateOptions}
            onChange={handleDateOptions}
            label={i18n.t('dates-within')}
            forSearch={true}
          />

          <View style={styles.date}>
            <Text>{i18n.t('date-label')}</Text>

            <Text
              style={{
                color: Colors.MAIN_COLOR,
                flex: 1,
                textAlign: 'left',
                paddingHorizontal: 10,
              }}
            >
              {formatDate(date)}
            </Text>
            <Fontisto name="date" size={24} color={Colors.MAIN_COLOR} onPress={showDatepicker} />
            {show && (
              <DateTimePicker testID="dateTimePicker" value={date} mode={mode} is24Hour={true} onChange={onChange} />
            )}
          </View>
        </SearchContainer>

        {status !== 'loading' && <PullDownToRefresh />}
        <View style={styles.actions}>
          <Button
            text={i18n.t('normal-order')}
            color={pageState.type === 'normal' ? Colors.DARK_COLOR : Colors.LIGHT_COLOR}
            pressHandler={() => {
              changeOrderTypeHandler('normal');
            }}
          />
          <View style={{ width: 10 }}></View>
          <Button
            text={i18n.t('special-order')}
            color={pageState.type === 'special' ? Colors.DARK_COLOR : Colors.LIGHT_COLOR}
            pressHandler={() => changeOrderTypeHandler('special')}
          />
        </View>

        {pageState.type === 'normal' && count === 0 && status !== 'loading' && (
          <>
            <NoContent refreshing={refreshing} onRefreshing={onRefreshing} msg="no-orders-found" />
          </>
        )}

        {pageState.type === 'special' && basketOrdersCount === 0 && status !== 'loading' && (
          <>
            <NoContent refreshing={refreshing} onRefreshing={onRefreshing} msg="no-orders-found" />
          </>
        )}

        {pageState.type === 'normal' && orders?.length > 0 && (
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
              return <OrderRow order={item} deleteAction={deleteOrderHandler} type={pageState.type} />;
            }}
          />
        )}

        {pageState.type === 'special' && basketOrders?.length > 0 && (
          <FlatList
            data={basketOrders}
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
              return <OrderRow order={item} deleteAction={deleteOrderHandler} type={pageState.type} />;
            }}
          />
        )}

        {pageState.type === 'normal' && orders.length === count && status !== 'loading' && count !== 0 && (
          <Text style={styles.noMoreTxt}>{i18n.t('no-more')}</Text>
        )}

        {pageState.type === 'special' &&
          basketOrders.length === basketOrdersCount &&
          status !== 'loading' &&
          basketOrdersCount !== 0 && <Text style={styles.noMoreTxt}>{i18n.t('no-more')}</Text>}

        {status === 'loading' && <LoadingData />}

        {/* {deleteStatus === 'loading' && <Loader />} */}
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
  actions: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  noMoreTxt: {
    textAlign: 'center',
    color: Colors.DARK_COLOR,
    fontWeight: 'bold',
    paddingVertical: 10,
  },
});

export default OrdersScreen;
