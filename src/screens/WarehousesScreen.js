import i18n from '../i18n/index';

import React, { useCallback, useState } from 'react';
import { View, StyleSheet, Animated, RefreshControl } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

// redux stuff
import { unwrapResult } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';
import { selectUserData } from '../redux/auth/authSlice';
import {
  cancelOperation,
  changeSearchCity,
  changeSearchName,
  getWarehouses,
  resetWarehousesArray,
  selectWarehouses,
} from '../redux/warehouse/warehousesSlice';

// components
import PartnerCard from '../components/PartnerCard';
import SearchContainer from '../components/SearchContainer';
import NoContent from '../components/NoContent';
import SearchInput from '../components/SearchInput';
import LoadingData from '../components/LoadingData';

// constatns
import { Colors, UserTypeConstants } from '../utils/constants';

const SPACING = 20;

let timer;

const WarehousesScreen = ({}) => {
  const scrollY = React.useRef(new Animated.Value(0)).current;

  const dispatch = useDispatch();

  const { token, user } = useSelector(selectUserData);
  const { warehouses, status, count, pageState } = useSelector(selectWarehouses);

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
      .then(() => {
        setRefreshing(false);
      });
  };

  const onSearchSubmit = () => {
    dispatch(resetWarehousesArray());
    handleSearch();
  };

  const onRefreshing = () => {
    setRefreshing(true);
    onSearchSubmit();
  };

  const handleMoreResult = () => {
    if (warehouses.length < count && status !== 'loading') handleSearch();
  };

  const keyUpHandler = (event) => {
    if (event.keyCode === 13) return;
    cancelOperation();

    if (timer) {
      clearTimeout(timer);
    }

    timer = setTimeout(() => {
      onSearchSubmit();
    }, 500);
  };

  useFocusEffect(
    useCallback(() => {
      // Do something when the screen is focused
      if (warehouses?.length === 0) handleSearch();

      return () => {
        cancelOperation();
      };
    }, []),
  );

  return (
    <View style={styles.container}>
      <SearchContainer>
        <SearchInput
          placeholder={i18n.t('search-by-warehouse-name')}
          onTextChange={(val) => {
            dispatch(changeSearchName(val));
          }}
          onSubmitEditing={onSearchSubmit}
          onKeyPress={keyUpHandler}
          value={pageState.searchName}
        />
      </SearchContainer>

      {warehouses?.length === 0 && status !== 'loading' && (
        <NoContent refreshing={refreshing} onRefreshing={onRefreshing} msg="no-warehouses" />
      )}

      {warehouses?.length > 0 && (
        <Animated.FlatList
          data={warehouses}
          onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: true })}
          keyExtractor={(item) => item._id}
          contentContainerStyle={{
            padding: SPACING,
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
          renderItem={({ item }) => {
            return <PartnerCard partner={item} type="warehouse" />;
          }}
        />
      )}

      {status === 'loading' && <LoadingData />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  searchWarehousesName: {
    backgroundColor: Colors.WHITE_COLOR,
    borderRadius: 6,
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  loadingText: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.SECONDARY_COLOR,
    marginTop: 20,
  },
});

export default WarehousesScreen;
