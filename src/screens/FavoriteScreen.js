import React, { useEffect, useState } from 'react';

import { ScrollView, View, StyleSheet, RefreshControl } from 'react-native';

// redux stuff
import { unwrapResult } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';
import { selectToken } from '../redux/auth/authSlice';
import {
  cancelOperation,
  getFavorites,
  selectFavorites,
  selectFavoritesItems,
  selectFavoritesPartners,
} from '../redux/favorites/favoritesSlice';

// components
import CollapseSection from '../components/CollapseSection';

// constants
import { UserTypeConstants } from '../utils/constants';

const FavoriteScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const token = useSelector(selectToken);
  const [refreshing, setRefreshing] = useState(false);

  const {
    favorites_partners: favoritesPartners,
    favorites_items: favoritesItems,
    status,
  } = useSelector(selectFavorites);

  const favoritesCompanies = favoritesPartners
    ? favoritesPartners.filter((favorite) => favorite.type === UserTypeConstants.COMPANY)
    : [];

  const favoritesWarehouses = favoritesPartners
    ? favoritesPartners.filter((favorite) => favorite.type === UserTypeConstants.WAREHOUSE)
    : [];

  const onRefresh = () => {
    setRefreshing(true);
    dispatch(getFavorites({ token }))
      .then(unwrapResult)
      .then(() => {
        setRefreshing(false);
      })
      .catch(() => {
        setRefreshing(false);
      });
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('blur', () => {
      if (refreshing && status === 'loading') {
        cancelOperation();
      }
    });

    return unsubscribe;
  });

  return (
    <View style={styles.container}>
      <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
        <CollapseSection header="companies" favorites={favoritesCompanies} type="company" />
        <CollapseSection header="warehouses" favorites={favoritesWarehouses} type="warehouse" />
        <CollapseSection header="nav-items" favorites={favoritesItems} type="item" />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 20,
  },
});

export default FavoriteScreen;