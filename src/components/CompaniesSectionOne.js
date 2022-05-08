import React, { useEffect } from 'react';
import { FlatList, View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';

// components
import PartnerCardAdvertisement from './PartnerCardAdvertisement';

// redux stuff
import { useDispatch, useSelector } from 'react-redux';
import { getCompaniesSectionOne, selectCompaniesSectionOne } from '../redux/advertisements/companiesSectionOneSlice';
import { selectUserData } from '../redux/auth/authSlice';
import { selectCompaniesSectionOneFromSettings } from '../redux/settings/settingsSlice';

import { Colors } from '../utils/constants';

const CompaniesSectionOne = () => {
  const dispatch = useDispatch();

  const { token } = useSelector(selectUserData);
  const { show, title, description, order } = useSelector(selectCompaniesSectionOneFromSettings);
  const { companiesSectionOne, companiesSectionOneStatus } = useSelector(selectCompaniesSectionOne);

  useEffect(() => {
    if (show) {
      dispatch(getCompaniesSectionOne({ token }));
    }
  }, []);

  return show ? (
    companiesSectionOneStatus === 'loading' ? (
      <>
        <ActivityIndicator size="large" color={Colors.MAIN_COLOR} />
      </>
    ) : companiesSectionOne.length > 0 ? (
      <View style={{ ...styles.container }}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
        <FlatList
          data={companiesSectionOne}
          keyExtractor={(item) => item._id}
          horizontal={true}
          renderItem={({ item }) => <PartnerCardAdvertisement partner={item} />}
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

export default CompaniesSectionOne;
