import React, { useEffect } from 'react';
import { FlatList, View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';

// components
import HomeScreenAdvertisementCard from './HomeScreenAdvertisementCard';

// redux stuff
import { useDispatch, useSelector } from 'react-redux';
import { selectUserData } from '../redux/auth/authSlice';
import { selectItemsSectionThreeFromSettings } from '../redux/settings/settingsSlice';
import { getItemsSectionThree, selectItemsSectionThree } from '../redux/advertisements/itemsSectionThreeSlice';

import { Colors } from '../utils/constants';

const ItemsSectionThree = () => {
  const dispatch = useDispatch();

  const { token } = useSelector(selectUserData);
  const { show, title, description, order } = useSelector(selectItemsSectionThreeFromSettings);
  const { itemsSectionThree, itemsSectionThreeStatus } = useSelector(selectItemsSectionThree);

  useEffect(() => {
    if (show) {
      dispatch(getItemsSectionThree({ token }));
    }
  }, []);

  return show ? (
    itemsSectionThreeStatus === 'loading' ? (
      <>
        <ActivityIndicator size="large" color={Colors.MAIN_COLOR} />
      </>
    ) : itemsSectionThree.length > 0 ? (
      <View style={{ ...styles.container }}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
        <FlatList
          data={itemsSectionThree}
          keyExtractor={(item) => item._id}
          horizontal={true}
          renderItem={({ item }) => <HomeScreenAdvertisementCard data={item} type="item" rect="rect" />}
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

export default ItemsSectionThree;
