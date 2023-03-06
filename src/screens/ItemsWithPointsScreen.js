import i18n from '../i18n/index';

import React, { useCallback, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { View, StyleSheet, RefreshControl, FlatList } from 'react-native';
// libraries
import { BottomSheet } from 'react-native-btr';

// redux stuff
import { unwrapResult } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';
import { selectUserData } from '../redux/auth/authSlice';
import {
  getItemsWithPoints,
  selectItemsWithPointsMedicines,
  cancelOperation,
  setSearchName,
  resetItemsWithPointsArray,
  addIdToCompaniesIds,
  removeIdFromCompaniesId,
  addIdToWarehousesIds,
  removeIdFromWarehousesId,
} from '../redux/itemsWithPoints/itemsWithPointsSlices';

// components
import SearchPartnerContainer from '../components/SearchPartnerContainer';
import PullDownToRefresh from '../components/PullDownToRefresh';
import SearchContainer from '../components/SearchContainer';
import AddToCartOffer from '../components/AddToCartOffer';
import SearchInput from '../components/SearchInput';
import LoadingData from '../components/LoadingData';
import NoContent from '../components/NoContent';
import ScreenWrapper from './ScreenWrapper';
import Scanner from '../components/Scanner';

// constants
import { Colors, UserTypeConstants } from '../utils/constants';

// icons
import { AntDesign } from '@expo/vector-icons';
import ItemOfferCard from '../components/ItemOfferCard';

let timer;

const ItemsWithPointsScreen = ({ navigation }) => {
  const dispatch = useDispatch();

  // selectors
  const { token, user } = useSelector(selectUserData);
  const { medicines, status, pageState, count } = useSelector(selectItemsWithPointsMedicines);

  // own state
  const [showAddToCartModal, setShowAddToCartModal] = useState(false);
  const [itemToAddToCart, setItemToAddToCart] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [showScanner, setShowScanner] = useState(false);

  // search handler
  const handleSearch = () => {
    dispatch(getItemsWithPoints({ token }))
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
    dispatch(resetItemsWithPointsArray());
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

  useFocusEffect(
    useCallback(() => {
      // Do something when the screen is focused
      dispatch(resetItemsWithPointsArray());
      handleSearch();

      return () => {
        cancelOperation();
      };
    }, []),
  );

  return user ? (
    <ScreenWrapper>
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

          <SearchPartnerContainer
            label={i18n.t('choose-company')}
            partners={pageState?.searchCompaniesIds}
            addId={addIdToCompaniesIds}
            removeId={removeIdFromCompaniesId}
            partnerType={UserTypeConstants.COMPANY}
            action={onSearchSubmit}
          />

          <SearchPartnerContainer
            label={i18n.t('item-warehouse')}
            partners={pageState?.searchWarehousesIds}
            addId={addIdToWarehousesIds}
            removeId={removeIdFromWarehousesId}
            partnerType={UserTypeConstants.WAREHOUSE}
            action={onSearchSubmit}
          />
        </SearchContainer>

        {status !== 'loading' && <PullDownToRefresh />}

        {medicines?.length === 0 && status !== 'loading' && (
          <NoContent refreshing={refreshing} onRefreshing={onRefreshing} msg="no-offers-at-all" />
        )}

        {medicines?.length > 0 && (
          <FlatList
            data={medicines}
            keyExtractor={(item, index) => index}
            refreshControl={
              <RefreshControl
                //refresh control used for the Pull to Refresh
                refreshing={refreshing}
                onRefresh={onRefreshing}
              />
            }
            contentContainerStyle={{
              backgroundColor: Colors.WHITE_COLOR,
              marginStart: 10,
            }}
            numColumns={1}
            onEndReached={handleMoreResult}
            onEndReachedThreshold={0.1}
            renderItem={({ item, index }) => (
              <ItemOfferCard
                item={item}
                index={index}
                navigation={navigation}
                addToCart={() => {
                  setTheItemToAddToCartHandler(item);
                }}
                type="point"
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
          <AddToCartOffer item={itemToAddToCart} close={() => setShowAddToCartModal(false)} />
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
  barcodeIcon: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 40,
    position: 'absolute',
    right: 30,
    top: 3,
  },
});

export default ItemsWithPointsScreen;
