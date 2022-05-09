import React, { useEffect } from 'react';
import { FlatList, View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';

// components
import HomeScreenAdvertisementCard from './HomeScreenAdvertisementCard';

// redux stuff
import { useDispatch, useSelector } from 'react-redux';
import { selectUserData } from '../redux/auth/authSlice';
import { selectItemsSectionOneFromSettings } from '../redux/settings/settingsSlice';
import { getItemsSectionOne, selectItemsSectionOne } from '../redux/advertisements/itemsSectionOneSlice';

import { Colors } from '../utils/constants';
import i18n from '../i18n/index';

const ItemsSectionOne = () => {
  const dispatch = useDispatch();

  const { token } = useSelector(selectUserData);
  const { show, title, description, order } = useSelector(selectItemsSectionOneFromSettings);
  const { itemsSectionOne, itemsSectionOneStatus } = useSelector(selectItemsSectionOne);

  useEffect(() => {
    if (show) {
      dispatch(getItemsSectionOne({ token }));
    }
  }, []);

  return show ? (
    itemsSectionOneStatus === 'loading' ? (
      <View style={styles.loaderView}>
        <ActivityIndicator size="large" color={Colors.MAIN_COLOR} style={{ flex: 1 }} />
        <Text
          style={{
            color: Colors.MAIN_COLOR,
          }}
        >
          {i18n.t('loading-data')}
        </Text>
      </View>
    ) : itemsSectionOne.length > 0 ? (
      <View style={{ ...styles.container }}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
        <FlatList
          data={itemsSectionOne}
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
  loaderView: {
    height: 150,
    backgroundColor: '#e3e3e3',
    width: '90%',
    marginHorizontal: '5%',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
  },
});

export default ItemsSectionOne;
