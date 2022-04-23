import i18n from '../i18n/index';

import React, { useEffect, useState } from 'react';
import { useIsFocused } from '@react-navigation/native';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Animated,
  RefreshControl,
  ActivityIndicator,
  TextInput,
} from 'react-native';

import { FlatList } from 'react-native-gesture-handler';

// redux stuff
import { unwrapResult } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';
import { selectUserData } from '../redux/auth/authSlice';
import { selectFavoritesItems } from '../redux/favorites/favoritesSlice';
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

// constatns
import { Colors, UserTypeConstants } from '../utils/constants';
import SwipeableRow from '../components/SwipeableRow';

const SPACING = 20;

let timer;

const MedicinesScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const isFocused = useIsFocused();

  // selectors
  const { token, user } = useSelector(selectUserData);
  const { medicines, status, pageState } = useSelector(selectMedicines);
  const favoritesItems = useSelector(selectFavoritesItems);

  // own state
  const [showFavorites, setShowFavorites] = useState(false);
  const scrollY = React.useRef(new Animated.Value(0)).current;
  const [refreshing, setRefreshing] = useState(false);

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
    handleSearch();
  };

  const keyUpHandler = (event) => {
    if (event.keyCode === 13) return;
    cancelOperation();

    if (timer) {
      clearTimeout(timer);
    }

    timer = setTimeout(() => {
      onSearchSubmit();
    }, 200);
  };

  useEffect(() => {
    let unsubscribe;
    if (isFocused) {
      dispatch(resetMedicinesArray());
      handleSearch();

      unsubscribe = navigation.addListener('blur', () => {
        if (refreshing && status === 'loading') {
          cancelOperation();
        }
      });
    }

    return unsubscribe;
  }, [isFocused]);

  return user ? (
    <View style={styles.container}>
      <SearchContainer>
        <TextInput
          style={styles.searchTextInput}
          placeholder={i18n.t('search-by-name-composition-barcode')}
          onChangeText={(val) => {
            dispatch(setSearchName(val));
          }}
          onSubmitEditing={onSearchSubmit}
          onKeyPress={keyUpHandler}
          value={pageState.searchName}
        />

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

        {(user?.type === UserTypeConstants.ADMIN || user?.type === UserTypeConstants.PHARMACY) && (
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
          contentContainerStyle={
            {
              // padding: 10,
            }
          }
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
          renderItem={({ item, index }) => <ItemCard item={item} index={index} navigation={navigation} />}
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
            {i18n.t('loading')}
          </Text>
        </View>
      )}
    </View>
  ) : null;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
