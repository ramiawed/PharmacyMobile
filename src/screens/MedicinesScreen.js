import i18n from '../i18n/index';

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, Animated, RefreshControl, ActivityIndicator } from 'react-native';

// redux stuff
import { unwrapResult } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';
import { selectToken, selectUser } from '../redux/auth/authSlice';
import { getFavorites } from '../redux/favorites/favoritesSlice';
import {
  getMedicines,
  resetMedicines,
  selectMedicines,
  cancelOperation,
  setSelectedPage,
} from '../redux/medicines/medicinesSlices';

// components
import ItemCard from '../components/ItemCard';

import SearchBar from '../components/SearchBar';

// constatns
import { Colors } from '../utils/constants';

const SPACING = 20;
const AVATAR_SIZE = 70;
const ITEM_SIZE = AVATAR_SIZE + SPACING * 3;

const MedicinesScreen = ({ navigation, route }) => {
  const scrollY = React.useRef(new Animated.Value(0)).current;
  const { companyId, warehouseId } = route.params;

  const dispatch = useDispatch();

  const token = useSelector(selectToken);
  const user = useSelector(selectUser);
  const { medicines, status, count, selectedPage } = useSelector(selectMedicines);

  const [searchName, setSearchName] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  // const [page, setPage] = useState(medicines.length === 0 ? 1 : Math.ceil(medicines.length / 9) + 1);

  // search handler
  const handleSearch = (p) => {
    const queryString = {};

    queryString.page = p;

    if (searchName.trim().length !== 0) {
      queryString.name = searchName;
    }

    if (companyId) {
      queryString.companyId = companyId;
    }

    if (warehouseId) {
      queryString.warehouseId = warehouseId;
    }

    if (status !== 'loading') {
      dispatch(getMedicines({ queryString, token }))
        .then(unwrapResult)
        .then(() => {
          setRefreshing(false);
          dispatch(setSelectedPage(p + 1));
        })
        .catch((err) => {
          setRefreshing(false);
        });
    }
  };

  const onRefreshing = () => {
    setRefreshing(true);
    dispatch(resetMedicines());
    handleSearch(1);
  };

  const handleMoreResult = () => {
    if (medicines.length < count) handleSearch(selectedPage);
  };

  useEffect(() => {
    console.log(companyId);
    console.log(warehouseId);
    dispatch(resetMedicines());
    handleSearch(1);

    const unsubscribe = navigation.addListener('blur', () => {
      if (refreshing && status === 'loading') {
        cancelOperation();
      }
    });

    return unsubscribe;
  }, [companyId, warehouseId]);

  return (
    <View style={styles.container}>
      {/* <Image source={require('../../assets/applogo.png')} style={StyleSheet.absoluteFillObject} blurRadius={10} /> */}
      <SearchBar
        value={searchName}
        textChangedHandler={setSearchName}
        clearText={() => {
          setSearchName('');
        }}
        onSubmit={() => {
          dispatch(resetMedicines());
          handleSearch(1);
        }}
        placeholder="search-by-medicine-name"
      />

      {medicines?.length === 0 && status !== 'loading' && searchName !== '' && (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefreshing} />}>
            <Text style={styles.noContent}>{i18n.t('no-medicines')}</Text>
          </ScrollView>
        </View>
      )}

      {medicines?.length === 0 && status !== 'loading' && searchName === '' && (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefreshing} />}>
            <Text style={styles.noContent}>{i18n.t('no-medicines')}</Text>
          </ScrollView>
        </View>
      )}

      {medicines?.length > 0 && (
        <Animated.FlatList
          data={medicines}
          onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: true })}
          keyExtractor={(item) => item._id}
          contentContainerStyle={{
            padding: SPACING,
            // paddingTop: StatusBar.currentHeight || 42,
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
          renderItem={({ item, index }) => {
            return <ItemCard item={item} index={index} navigation={navigation} />;
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
            {i18n.t('loading')}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

  noContent: {
    paddingTop: 25,
    fontSize: 18,
    fontWeight: '500',
    color: Colors.SECONDARY_COLOR,
  },
});

export default MedicinesScreen;
