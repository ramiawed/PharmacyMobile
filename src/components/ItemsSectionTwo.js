import React, { useEffect } from 'react';
import { FlatList, View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import i18n from '../i18n/index';

// components
import HomeScreenAdvertisementCard from './HomeScreenAdvertisementCard';

// redux stuff
import { useDispatch, useSelector } from 'react-redux';
import { selectUserData } from '../redux/auth/authSlice';
import { selectItemsSectionTwoFromSettings } from '../redux/settings/settingsSlice';
import { getItemsSectionTwo, selectItemsSectionTwo } from '../redux/advertisements/itemsSectionTwoSlice';

import { Colors } from '../utils/constants';

const ItemsSectionTwo = () => {
  const dispatch = useDispatch();

  const { token } = useSelector(selectUserData);
  const { show, title, description, order } = useSelector(selectItemsSectionTwoFromSettings);
  const { itemsSectionTwo, itemsSectionTwoStatus } = useSelector(selectItemsSectionTwo);

  useEffect(() => {
    if (show) {
      dispatch(getItemsSectionTwo({ token }));
    }
  }, []);

  return show ? (
    itemsSectionTwoStatus === 'loading' ? (
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
    ) : itemsSectionTwo.length > 0 ? (
      <View style={{ ...styles.container }}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
        <FlatList
          data={itemsSectionTwo}
          keyExtractor={(item) => item._id}
          horizontal={true}
          renderItem={({ item }) => <HomeScreenAdvertisementCard data={item} type="item" />}
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

export default ItemsSectionTwo;
