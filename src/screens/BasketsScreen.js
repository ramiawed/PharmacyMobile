import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import { View, Text, StyleSheet, FlatList, RefreshControl } from 'react-native';

//components
import LoadingData from '../components/LoadingData';
import NoContent from '../components/NoContent';
import Basket from '../components/Basket';

// redux stuff
import { unwrapResult } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';
import { selectUserData } from '../redux/auth/authSlice';
import { cancelOperation, getBaskets, resetBasketsArray, selectBaskets } from '../redux/baskets/basketsSlice';

// constants and untils
import { Colors } from '../utils/constants';

const BasketsScreen = () => {
  const dispatch = useDispatch();
  const { user, token } = useSelector(selectUserData);
  const { status, baskets, count, error } = useSelector(selectBaskets);

  const [refreshing, setRefreshing] = useState(false);

  const handleSearch = () => {
    dispatch(getBaskets({ token }))
    .then(unwrapResult)
    .then(() => setRefreshing(false))
    .catch(() => setRefreshing(false));
  };

  const onRefreshing = () => {
    setRefreshing(true);
    onSearchSubmit();
  };

  const onSearchSubmit = () => {
    dispatch(resetBasketsArray());
    handleSearch();
  };

  const handleMoreResult = () => {
    if (baskets.length < count && status !== 'loading') {
      handleSearch();
    }
  };

  useFocusEffect(
    useCallback(() => {
      // Do something when the screen is focused
      dispatch(resetBasketsArray());
      handleSearch();

      return () => {
        cancelOperation();
      };
    }, []),
  );

  return (
    <View style={styles.container}>
      {baskets?.length === 0 && status !== 'loading' && (
        <NoContent refreshing={refreshing} onRefreshing={onRefreshing} msg="no-baskets" />
      )}


      {baskets?.length > 0 && (
        <FlatList
          data={baskets}
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
            <Basket basket={item} />
          )}
        />
      )}

      {status === 'loading' && <LoadingData />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.WHITE_COLOR
  }
})

export default BasketsScreen;
