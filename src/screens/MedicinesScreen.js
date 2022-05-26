import i18n from '../i18n/index';

import React, { useCallback, useEffect, useState } from 'react';
import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
  TextInput,
  FlatList,
} from 'react-native';
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
} from '../redux/medicines/medicinesSlices';

// components
import ItemCard from '../components/ItemCard';
import SearchContainer from '../components/SearchContainer';
import AddToCart from '../components/AddToCart';

// constants
import { Colors, UserTypeConstants } from '../utils/constants';

// icons
import { AntDesign } from '@expo/vector-icons';
import { backgroundColor } from 'react-native/Libraries/Components/View/ReactNativeStyleAttributes';
import Scanner from '../components/Scanner';

let timer;

const MedicinesScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const isFocused = useIsFocused();

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
        <View
          style={{
            flexDirection: 'row',
            backgroundColor: Colors.WHITE_COLOR,
            alignItems: 'center',
            borderRadius: 6,
          }}
        >
          <TextInput
            style={{ ...styles.searchTextInput, flex: 1 }}
            placeholder={i18n.t('search-by-name-composition-barcode')}
            onChangeText={(val) => {
              dispatch(setSearchName(val));
            }}
            onSubmitEditing={onSearchSubmit}
            onKeyPress={keyUpHandler}
            value={pageState.searchName}
          />
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              width: 40,
            }}
          >
            <AntDesign name="barcode" size={32} color={Colors.MAIN_COLOR} onPress={() => setShowScanner(true)} />
          </View>
        </View>

        {user.type !== UserTypeConstants.GUEST && pageState.searchCompanyId === null && (
          <TextInput
            style={styles.searchTextInput}
            placeholder={i18n.t('search-by-company-name')}
            onChangeText={(val) => {
              dispatch(setSearchCompanyName(val));
            }}
            onSubmitEditing={onSearchSubmit}
            onKeyPress={keyUpHandler}
            value={pageState.searchCompanyName}
          />
        )}

        {user.type !== UserTypeConstants.GUEST && pageState.searchWarehouseId === null && (
          <TextInput
            style={styles.searchTextInput}
            placeholder={i18n.t('search-by-warehouse-name')}
            onChangeText={(val) => {
              dispatch(setSearchWarehouseName(val));
            }}
            onSubmitEditing={onSearchSubmit}
            onKeyPress={keyUpHandler}
            value={pageState.searchWarehouseName}
          />
        )}
      </SearchContainer>

      {medicines?.length === 0 && status !== 'loading' && (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefreshing} />}>
            <Text style={styles.noContent}>{i18n.t('no-medicines')}</Text>
          </ScrollView>
        </View>
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
  searchTextInput: {
    backgroundColor: Colors.WHITE_COLOR,
    borderRadius: 6,
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  noContent: {
    paddingTop: 25,
    fontSize: 18,
    fontWeight: '500',
    color: Colors.SECONDARY_COLOR,
  },
});

export default MedicinesScreen;
