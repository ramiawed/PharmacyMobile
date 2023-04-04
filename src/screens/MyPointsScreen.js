import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl } from 'react-native';

// components
import PullDownToRefresh from '../components/PullDownToRefresh';
import ScreenWrapper from './ScreenWrapper';

// redux stuff
import { useDispatch, useSelector } from 'react-redux';
import { getMyPoints, selectUserData } from '../redux/auth/authSlice';

// constants
import { Colors } from '../utils/constants';
import { unwrapResult } from '@reduxjs/toolkit';
import MyPointsDescriptionAr from '../components/MyPointsDescriptionAr';
import i18n from '../i18n';

const MyPointsScreen = () => {
  const dispatch = useDispatch();
  const { user, token } = useSelector(selectUserData);

  const [refreshing, setRefreshing] = useState(false);

  const onRefreshing = () => {
    setRefreshing(true);
    dispatch(getMyPoints({ token }))
      .then(unwrapResult)
      .then(() => {
        setRefreshing(false);
      })
      .catch(() => setRefreshing(false));
  };

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <PullDownToRefresh />
        <ScrollView
          contentContainerStyle={{
            alignItems: 'center',
          }}
          style={styles.container}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefreshing} />}
        >
          <Text style={styles.points}>
            {i18n.t('number of points in your account')} {user.points}
          </Text>
          <MyPointsDescriptionAr />
        </ScrollView>
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.WHITE_COLOR,
    width: '100%',
  },
  points: {
    backgroundColor: Colors.SUCCEEDED_COLOR,
    color: Colors.WHITE_COLOR,
    fontSize: 20,
    textAlign: 'center',
    paddingVertical: 30,
    borderRadius: 8,
    width: '80%',
    alignSelf: 'center',
    marginTop: 10,
    flexWrap: 'wrap',
  },
});

export default MyPointsScreen;
