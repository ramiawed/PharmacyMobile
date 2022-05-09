import React, { useEffect } from 'react';
import { FlatList, View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';

// components
import HomeScreenAdvertisementCard from './HomeScreenAdvertisementCard';

// redux stuff
import { useDispatch, useSelector } from 'react-redux';
import { selectUserData } from '../redux/auth/authSlice';
import { selectWarehousesSectionOneFromSettings } from '../redux/settings/settingsSlice';
import { getWarehousesSectionOne, selectWarehousesSectionOne } from '../redux/advertisements/warehousesSectionOneSlice';

import { Colors } from '../utils/constants';

const WarehousesSectionOne = () => {
  const dispatch = useDispatch();

  const { token } = useSelector(selectUserData);
  const { show, title, description } = useSelector(selectWarehousesSectionOneFromSettings);
  const { warehousesSectionOne, warehousesSectionOneStatus } = useSelector(selectWarehousesSectionOne);

  useEffect(() => {
    if (show) {
      dispatch(getWarehousesSectionOne({ token }));
    }
  }, []);

  return show ? (
    warehousesSectionOneStatus === 'loading' ? (
      <>
        <ActivityIndicator size="large" color={Colors.MAIN_COLOR} />
      </>
    ) : warehousesSectionOne.length > 0 ? (
      <View style={{ ...styles.container }}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
        <FlatList
          data={warehousesSectionOne}
          keyExtractor={(item) => item._id}
          horizontal={true}
          renderItem={({ item }) => <HomeScreenAdvertisementCard data={item} type="warehouse" />}
        />
      </View>
    ) : null
  ) : null;
};

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.MAIN_COLOR,
    textAlign: 'center',
    paddingTop: 10,
  },
  description: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.SECONDARY_COLOR,
    textAlign: 'center',
  },
});

export default WarehousesSectionOne;
