import React, { useCallback, useEffect, useState } from 'react';

import { ScrollView, View, StyleSheet, RefreshControl } from 'react-native';

// redux stuff
import { unwrapResult } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';
import { selectToken } from '../redux/auth/authSlice';
import { cancelOperation, getFavorites, selectFavorites } from '../redux/favorites/favoritesSlice';

// components
import CollapseSection from '../components/CollapseSection';

// constants
import { Colors, UserTypeConstants } from '../utils/constants';
import { useFocusEffect } from '@react-navigation/native';

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

  useFocusEffect(
    useCallback(() => {
      // Do something when the screen is focused

      return () => {
        cancelOperation();
      };
    }, []),
  );

  return (
    <>
      <View style={styles.container}>
        <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
          <CollapseSection header="nav-items" favorites={favoritesItems} type="item" isOpen={true} />
          <CollapseSection header="companies" favorites={favoritesCompanies} type="company" isOpen={false} />
          <CollapseSection header="warehouses" favorites={favoritesWarehouses} type="warehouse" isOpen={false} />
        </ScrollView>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.WHITE_COLOR,
    paddingTop: 10,
  },
});

export default FavoriteScreen;
