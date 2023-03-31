import React, { useCallback, useState } from 'react';
import i18n from '../i18n/index';
import { useFocusEffect } from '@react-navigation/native';
import { View, Text, StyleSheet, RefreshControl, FlatList } from 'react-native';
// libraries
import { Picker } from '@react-native-picker/picker';
import CheckBox from 'expo-checkbox';
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
  setSearchInWarehouse,
  setSearchOutWarehouse,
  setSearchHaveOffer,
  addIdToCompaniesIds,
  removeIdFromCompaniesId,
  addIdToWarehousesIds,
  removeIdFromWarehousesId,
  setSearchWarehouseCompanyId,
  setSearchHavePoint,
} from '../redux/medicines/medicinesSlices';

// components
import SearchPartnerContainer from '../components/SearchPartnerContainer';
import PullDownToRefresh from '../components/PullDownToRefresh';
import SearchContainer from '../components/SearchContainer';
import SearchInput from '../components/SearchInput';
import LoadingData from '../components/LoadingData';
import AddToCart from '../components/AddToCart';
import NoContent from '../components/NoContent';
import ItemCard from '../components/ItemCard';
import ScreenWrapper from './ScreenWrapper';
import Scanner from '../components/Scanner';

// constants
import { Colors, UserTypeConstants } from '../utils/constants';

// icons
import { AntDesign } from '@expo/vector-icons';

let timer;

const ItemsScreen = ({ navigation, route }) => {
  const dispatch = useDispatch();
  const { myCompanies = [] } = route.params;

  const options = myCompanies?.map((c) => {
    return { value: c._id, label: c.name };
  });

  const companiesOptions = [{ value: '', label: i18n.t('all-companies') }, ...options];

  // selectors
  const { token, user } = useSelector(selectUserData);
  const { medicines, status, pageState, count, initialSearch } = useSelector(selectMedicines);

  // own state
  const [showAddToCartModal, setShowAddToCartModal] = useState(false);
  const [itemToAddToCart, setItemToAddToCart] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [showScanner, setShowScanner] = useState(false);

  const [selectedCompany, setSelectedCompany] = useState();

  const changeCompanySelectedHandler = (itemValue, itemIndex) => {
    setSelectedCompany(itemValue);
    if (itemValue === '') {
      dispatch(setSearchWarehouseCompanyId(null));
      onRefreshing();
    } else {
      const company = companiesOptions.find((c) => c.value === itemValue);
      dispatch(setSearchWarehouseCompanyId(company.value));
      onRefreshing();
    }
  };

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

  const keyUpHandler = () => {
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

  const haveOfferCheckBoxHandler = () => {
    dispatch(setSearchHaveOffer(!pageState.searchHaveOffer));
    onSearchSubmit();
  };

  const havePointCheckBoxHandler = () => {
    dispatch(setSearchHavePoint(!pageState.searchHavePoint));
    onSearchSubmit();
  };

  useFocusEffect(
    useCallback(() => {
      // Do something when the screen is focused
      if (initialSearch) {
        handleSearch();
      }

      return () => {
        cancelOperation();
      };
    }, [initialSearch]),
  );

  return user ? (
    <ScreenWrapper>
      <View style={styles.container}>
        <SearchContainer>
          <>
            <SearchInput
              placeholder={i18n.t('search by name-composition-barcode')}
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

          {pageState.searchCompanyId === null && pageState.searchWarehouseId === null && (
            <SearchPartnerContainer
              label={i18n.t('choose-company')}
              partners={pageState?.searchCompaniesIds}
              addId={addIdToCompaniesIds}
              removeId={removeIdFromCompaniesId}
              partnerType={UserTypeConstants.COMPANY}
              action={onSearchSubmit}
            />
          )}

          {pageState.searchWarehouseId !== null && (
            <View style={styles.pickerView}>
              <Picker
                style={styles.picker}
                itemStyle={{
                  color: Colors.MAIN_COLOR,
                }}
                selectedValue={selectedCompany}
                onValueChange={changeCompanySelectedHandler}
              >
                {companiesOptions.map((item) => (
                  <Picker.Item label={item.label} value={item.value} key={item.value} />
                ))}
              </Picker>
            </View>
          )}

          {pageState.searchWarehouseId === null && user.type !== UserTypeConstants.GUEST && (
            <SearchPartnerContainer
              label={i18n.t('item-warehouse')}
              partners={pageState?.searchWarehousesIds}
              addId={addIdToWarehousesIds}
              removeId={removeIdFromWarehousesId}
              partnerType={UserTypeConstants.WAREHOUSE}
              action={onSearchSubmit}
            />
          )}

          {user.type !== UserTypeConstants.GUEST && !pageState.searchWarehouseId && (
            <View style={styles.checkBoxView}>
              <CheckBox value={pageState.searchInWarehouse} onValueChange={inWarehouseCheckBoxHandler} />
              <Text style={{ color: Colors.MAIN_COLOR, marginStart: 8 }}>{i18n.t('warehouse-in-warehouse')}</Text>
            </View>
          )}

          {user.type !== UserTypeConstants.GUEST && !pageState.searchWarehouseId && (
            <View style={styles.checkBoxView}>
              <CheckBox value={pageState.searchOutWarehouse} onValueChange={outWarehouseCheckBoxHandler} />
              <Text style={{ color: Colors.MAIN_COLOR, marginStart: 8 }}>{i18n.t('warehouse-out-warehouse')}</Text>
            </View>
          )}

          {user.type !== UserTypeConstants.GUEST && (
            <View style={styles.checkBoxView}>
              <CheckBox value={pageState.searchHaveOffer} onValueChange={haveOfferCheckBoxHandler} />
              <Text style={{ color: Colors.MAIN_COLOR, marginStart: 8 }}>{i18n.t('medicies-have-offer-label')}</Text>
            </View>
          )}

          {user.type !== UserTypeConstants.GUEST && (
            <View style={styles.checkBoxView}>
              <CheckBox value={pageState.searchHavePoint} onValueChange={havePointCheckBoxHandler} />
              <Text style={{ color: Colors.MAIN_COLOR, marginStart: 8 }}>{i18n.t('medicies-have-point-label')}</Text>
            </View>
          )}
        </SearchContainer>

        {status !== 'loading' && <PullDownToRefresh />}
        {/* <ColorsHint /> */}
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
            contentContainerStyle={{ backgroundColor: Colors.WHITE_COLOR }}
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
                searchString={pageState.searchName}
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
    </ScreenWrapper>
  ) : null;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.WHITE_COLOR,
    width: '100%',
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
  pickerView: {
    backgroundColor: Colors.WHITE_COLOR,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 0,
    width: '100%',
    borderRadius: 6,
    paddingStart: 5,
    overflow: 'hidden',
  },
  picker: {
    height: 30,
    flex: 1,
    backgroundColor: Colors.WHITE_COLOR,
    color: Colors.MAIN_COLOR,
    borderRadius: 6,
  },
});

export default ItemsScreen;
