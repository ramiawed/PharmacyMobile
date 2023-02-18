import React, { memo, useEffect } from 'react';
import { FlatList, View, StyleSheet } from 'react-native';

// components
import PartnerAdvertisementCard from './PartnerAdvertisementCard';

// redux stuff
import { useDispatch, useSelector } from 'react-redux';
import { selectUserData } from '../redux/auth/authSlice';
import { selectWarehousesSectionOneFromSettings } from '../redux/settings/settingsSlice';
import { getWarehousesSectionOne, selectWarehousesSectionOne } from '../redux/advertisements/warehousesSectionOneSlice';

import LoadingData from './LoadingData';
import TitleAndDescription from './TitleAndDescription';

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
      <LoadingData />
    ) : warehousesSectionOne.length > 0 ? (
      <View style={styles.container}>
        <TitleAndDescription title={title} desc={description} />
        <FlatList
          data={warehousesSectionOne}
          keyExtractor={(item) => item._id}
          horizontal={true}
          renderItem={({ item }) => <PartnerAdvertisementCard data={item} />}
        />
      </View>
    ) : null
  ) : null;
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#B56576',
    borderRadius: 6,
    marginVertical: 5,
    marginHorizontal: 10,
    paddingHorizontal: 5,
  },
});

export default memo(WarehousesSectionOne);
