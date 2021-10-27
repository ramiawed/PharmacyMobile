import i18n from '../i18n/index';

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, Animated, RefreshControl, ActivityIndicator } from 'react-native';

// redux stuff
import { useDispatch, useSelector } from 'react-redux';
import { selectToken, selectUser } from '../redux/auth/authSlice';
import { unwrapResult } from '@reduxjs/toolkit';
import { cancelOperation, getWarehouses, resetWarehouse, selectWarehouses } from '../redux/warehouse/warehousesSlice';
import { getFavorites } from '../redux/favorites/favoritesSlice';

// components
import SearchBar from '../components/SearchBar';
import PartnerCard from '../components/PartnerCard';

// constatns
import { Colors } from '../utils/constants';

const SPACING = 20;
const AVATAR_SIZE = 70;
const ITEM_SIZE = AVATAR_SIZE + SPACING * 3;

const WarehousesScreen = ({ navigation }) => {
  const scrollY = React.useRef(new Animated.Value(0)).current;

  const dispatch = useDispatch();

  const token = useSelector(selectToken);
  const { warehouses, status, count } = useSelector(selectWarehouses);

  const [searchName, setSearchName] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);

  // search handler
  const handleSearch = (p) => {
    const queryString = {};

    queryString.page = p;

    // company approve and active must be true
    queryString.approve = true;
    queryString.active = true;

    if (searchName.trim().length > 0) {
      queryString.name = searchName;
    }

    dispatch(getWarehouses({ queryString, token }))
      .then(unwrapResult)
      .then(() => {
        setRefreshing(false);
        setPage(p + 1);
      });
  };

  const onRefreshing = () => {
    setRefreshing(true);
    dispatch(resetWarehouse());
    dispatch(getFavorites({ token }));
    handleSearch(1);
  };

  const handleMoreResult = () => {
    if (warehouses.length < count) handleSearch(page);
  };

  useEffect(() => {
    handleSearch(1);

    const unsubscribe = navigation.addListener('blur', () => {
      if (refreshing && status === 'loading') {
        cancelOperation();
      }
    });

    return unsubscribe;
  }, []);

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
          dispatch(resetWarehouse());
          handleSearch(1);
        }}
        placeholder="search-by-company-name"
      />

      {warehouses?.length === 0 && status !== 'loading' && searchName !== '' && (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefreshing} />}>
            <Text style={styles.noContent}>{i18n.t('no-warehouses')}</Text>
          </ScrollView>
        </View>
      )}

      {warehouses?.length === 0 && status !== 'loading' && searchName === '' && (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefreshing} />}>
            <Text style={styles.noContent}>{i18n.t('no-warehouses')}</Text>
          </ScrollView>
        </View>
      )}

      {warehouses?.length > 0 && (
        <Animated.FlatList
          data={warehouses}
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
          numColumns={2}
          onEndReached={handleMoreResult}
          onEndReachedThreshold={0.1}
          renderItem={({ item, index }) => {
            return <PartnerCard partner={item} navigation={navigation} type="warehouse" />;
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

export default WarehousesScreen;
