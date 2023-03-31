import i18n from '../i18n/index';

import React, { useState } from 'react';
import { View, StyleSheet, Animated, RefreshControl } from 'react-native';

// redux stuff
import { unwrapResult } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';
import { selectUserData } from '../redux/auth/authSlice';
import {
  changeSearchCity,
  changeSearchName,
  getWarehouses,
  resetWarehousesArray,
  selectWarehouses,
  selectWarehousesPageState,
} from '../redux/warehouse/warehousesSlice';

// components
import ScreenWrapper from './ScreenWrapper';
import WarehouseCard from '../components/WarehouseCard';
import SearchContainer from '../components/SearchContainer';
import NoContent from '../components/NoContent';
import SearchInput from '../components/SearchInput';
import LoadingData from '../components/LoadingData';

// constatns
import { CitiesName, UserTypeConstants } from '../utils/constants';
import PullDownToRefresh from '../components/PullDownToRefresh';

const WarehousesScreen = ({}) => {
  const dispatch = useDispatch();

  const { token, user } = useSelector(selectUserData);
  const { warehouses, status } = useSelector(selectWarehouses);
  const { searchName, searchCity } = useSelector(selectWarehousesPageState);

  let filteredWarehouses = warehouses.filter((warehouse) => {
    if (searchName.trim().length > 0) {
      return warehouse.name.includes(searchName.trim());
    }
    return true;
  });

  filteredWarehouses = filteredWarehouses.filter((warehouse) => {
    if (searchCity !== CitiesName.ALL) {
      return warehouse.city === searchCity;
    }
    return true;
  });

  const [refreshing, setRefreshing] = useState(false);

  // search handler
  const handleSearch = () => {
    if (
      user.type === UserTypeConstants.PHARMACY ||
      user.type === UserTypeConstants.GUEST ||
      user.type === UserTypeConstants.WAREHOUSE
    ) {
      dispatch(changeSearchCity(user.city));
    }

    dispatch(getWarehouses({ token }))
      .then(unwrapResult)
      .then(() => setRefreshing(false));
  };

  const onSearchSubmit = () => {
    dispatch(resetWarehousesArray());
    handleSearch();
  };

  const onRefreshing = () => {
    setRefreshing(true);
    onSearchSubmit();
  };

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <SearchContainer>
          <SearchInput
            placeholder={i18n.t('search by warehouse name')}
            onTextChange={(val) => {
              dispatch(changeSearchName(val));
            }}
            onSubmitEditing={onSearchSubmit}
            value={searchName}
          />
        </SearchContainer>

        {status !== 'loading' && <PullDownToRefresh />}

        {filteredWarehouses?.length === 0 && status !== 'loading' && (
          <NoContent refreshing={refreshing} onRefreshing={onRefreshing} msg="no-warehouses" />
        )}

        {filteredWarehouses?.length > 0 && (
          <Animated.FlatList
            data={filteredWarehouses}
            // onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: true })}
            keyExtractor={(item) => item._id}
            contentContainerStyle={{
              padding: 5,
            }}
            refreshControl={
              <RefreshControl
                //refresh control used for the Pull to Refresh
                refreshing={refreshing}
                onRefresh={onRefreshing}
              />
            }
            numColumns={1}
            onEndReachedThreshold={0.1}
            renderItem={({ item }) => {
              return <WarehouseCard warehouse={item} />;
            }}
          />
        )}

        {status === 'loading' && <LoadingData />}
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    width: '100%',
  },
});

export default WarehousesScreen;
