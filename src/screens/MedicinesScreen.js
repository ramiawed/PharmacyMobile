import i18n from '../i18n/index';

import React, { useCallback, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { View, Text, StyleSheet, RefreshControl, FlatList } from 'react-native';
import CheckBox from 'expo-checkbox';
// libraries
import { BottomSheet } from 'react-native-btr';

// redux stuff
import { unwrapResult } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';
import { selectUserData } from '../redux/auth/authSlice';
import {
  getMedicines,
  selectMedicines,
  cancelOperation,
  setCity,
  resetMedicinesArray,
  setSearchName,
  setSearchCompanyName,
  setSearchWarehouseName,
  setSearchInWarehouse,
  setSearchOutWarehouse,
} from '../redux/medicines/medicinesSlices';

// components
import ItemCard from '../components/ItemCard';
import SearchContainer from '../components/SearchContainer';
import AddToCart from '../components/AddToCart';
import Scanner from '../components/Scanner';
import NoContent from '../components/NoContent';
import SearchInput from '../components/SearchInput';
import LoadingData from '../components/LoadingData';

// constants
import { Colors, UserTypeConstants } from '../utils/constants';

// icons
import { AntDesign } from '@expo/vector-icons';

let timer;

const MedicinesScreen = ({ navigation }) => {
  const dispatch = useDispatch();

  // selectors
  const { token, user } = useSelector(selectUserData);
  const { medicines, status, pageState, count } = useSelector(selectMedicines);

  // own state
  const [showAddToCartModal, setShowAddToCartModal] = useState(false);
  const [itemToAddToCart, setItemToAddToCart] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [showScanner, setShowScanner] = useState(false);

  // search handler
  const handleSearch = () => {
    if (user.type === UserTypeConstants.PHARMACY) {
      dispatch(setCity(user.city));
    } else {
      dispatch(setCity(''));
    }

    dispatch(getMedicines({ token }))
      .then(unwrapResult)
      .then(() => {
        setRefreshing(false);
      });
  };

  const onRefreshing = () => {
    setRefreshing(true);
    onSearchSubmit();
  };

  const onSearchSubmit = () => {
    dispatch(resetMedicinesArray());
    handleSearch();
  };

  const handleMoreResult = () => {
    if (medicines.length < count && status !== 'loading') {
      handleSearch();
    }
  };

  const keyUpHandler = (event) => {
    cancelOperation();

    if (timer) {
      clearTimeout(timer);
    }

    timer = setTimeout(() => {
      onSearchSubmit();
    }, 200);
  };

  const scannerDoneHandler = (val) => {
    dispatch(setSearchName(val));
    setShowScanner(false);
    onSearchSubmit();
  };

  const setTheItemToAddToCartHandler = (item) => {
    setItemToAddToCart(item);
    setShowAddToCartModal(true);
  };

  const inWarehouseCheckBoxHandler = () => {
    dispatch(setSearchInWarehouse(!pageState.searchInWarehouse));
    dispatch(setSearchOutWarehouse(false));
    onSearchSubmit();
  };

  const outWarehouseCheckBoxHandler = () => {
    dispatch(setSearchOutWarehouse(!pageState.searchOutWarehouse));
    dispatch(setSearchInWarehouse(false));
    onSearchSubmit();
  };

  useFocusEffect(
    useCallback(() => {
      // Do something when the screen is focused
      dispatch(resetMedicinesArray());
      handleSearch();

      return () => {
        cancelOperation();
      };
    }, []),
  );

  return user ? (
    <View style={styles.container}>
      <SearchContainer>
        <>
          <SearchInput
            placeholder={i18n.t('search-by-name-composition-barcode')}
            onTextChange={(val) => {
              dispatch(setSearchName(val));
            }}
            onSubmitEditing={onSearchSubmit}
            onKeyPress={keyUpHandler}
            value={pageState.searchName}
          />

          <View style={styles.barcodeIcon}>
            <AntDesign name="barcode" size={32} color={Colors.MAIN_COLOR} onPress={() => setShowScanner(true)} />
          </View>
        </>

        {user.type !== UserTypeConstants.GUEST && pageState.searchCompanyId === null && (
          <SearchInput
            value={pageState.searchCompanyName}
            onTextChange={(text) => {
              dispatch(setSearchCompanyName(text));
            }}
            placeholder={i18n.t('search-by-company-name')}
            onSubmitEditing={onSearchSubmit}
            onKeyPress={keyUpHandler}
          />
        )}

        {user.type !== UserTypeConstants.GUEST && pageState.searchWarehouseId === null && (
          <SearchInput
            value={pageState.searchWarehouseName}
            onTextChange={(text) => {
              dispatch(setSearchWarehouseName(text));
            }}
            placeholder={i18n.t('search-by-warehouse-name')}
            onSubmitEditing={onSearchSubmit}
            onKeyPress={keyUpHandler}
          />
        )}

        {pageState.searchWarehouseId === null && (
          <View style={styles.checkBoxView}>
            <CheckBox value={pageState.searchInWarehouse} onValueChange={inWarehouseCheckBoxHandler} />
            <Text style={{ color: Colors.MAIN_COLOR, marginStart: 8 }}>{i18n.t('warehouse-in-warehouse')}</Text>
          </View>
        )}

        {pageState.searchWarehouseId === null && (
          <View style={styles.checkBoxView}>
            <CheckBox value={pageState.searchOutWarehouse} onValueChange={outWarehouseCheckBoxHandler} />
            <Text style={{ color: Colors.MAIN_COLOR, marginStart: 8 }}>{i18n.t('warehouse-out-warehouse')}</Text>
          </View>
        )}
      </SearchContainer>

      {medicines?.length === 0 && status !== 'loading' && (
        <NoContent refreshing={refreshing} onRefreshing={onRefreshing} msg="no-medicines" />
      )}

      {medicines?.length > 0 && (
        <FlatList
          data={medicines}
          keyExtractor={(item) => item._id}
          refreshControl={
            <RefreshControl
              //refresh control used for the Pull to Refresh
              refreshing={refreshing}
              onRefresh={onRefreshing}
            />
          }
          contentContainerStyle={{ backgroundColor: Colors.WHITE_COLOR, marginStart: 10 }}
          numColumns={1}
          onEndReached={handleMoreResult}
          onEndReachedThreshold={0.1}
          renderItem={({ item, index }) => (
            <ItemCard
              item={item}
              index={index}
              navigation={navigation}
              addToCart={() => {
                setTheItemToAddToCartHandler(item);
              }}
            />
          )}
        />
      )}

      {status === 'loading' && <LoadingData />}

      {showScanner && <Scanner onScannerDone={scannerDoneHandler} close={() => setShowScanner(false)} />}

      <BottomSheet
        visible={showAddToCartModal}
        onBackButtonPress={() => setShowAddToCartModal(false)}
        onBackdropPress={() => setShowAddToCartModal(false)}
      >
        <AddToCart item={itemToAddToCart} close={() => setShowAddToCartModal(false)} />
      </BottomSheet>
    </View>
  ) : null;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.WHITE_COLOR,
  },
  checkBoxView: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    flexDirection: 'row',
    backgroundColor: Colors.WHITE_COLOR,
    borderRadius: 6,
    padding: 8,
  },
  barcodeIcon: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 40,
    position: 'absolute',
    right: 30,
    top: 3,
  },
});

export default MedicinesScreen;
