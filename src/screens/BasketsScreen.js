import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { selectUserData } from '../redux/auth/authSlice';
import { cancelOperation, getBaskets, resetBasketsArray, selectBaskets } from '../redux/baskets/basketsSlice';

const BasketsScreen = () => {
  const dispatch = useDispatch();
  const { user, token } = useSelector(selectUserData);
  const { status, baskets, count, error } = useSelector(selectBaskets);

  const handleSearch = () => {
    dispatch(getBaskets({ token }));
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
    <View>
      {baskets.map((basket) => (
        <View key={basket._id}>
          <Text>{basket.warehouse.name}</Text>
        </View>
      ))}
    </View>
  );
};

export default BasketsScreen;
