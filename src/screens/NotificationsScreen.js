import React, { useCallback, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { View, StyleSheet, FlatList, RefreshControl } from 'react-native';

// redux stuff
import { useDispatch, useSelector } from 'react-redux';
import { selectUserData } from '../redux/auth/authSlice';
import {
  getAllNotifications,
  cancelOperation,
  resetNotifications,
  selectUserNotifications,
} from '../redux/userNotifications/userNotificationsSlice';

// components
import LoadingData from '../components/LoadingData';
import NoContent from '../components/NoContent';
import NotificationRow from '../components/NotificationRow';

// constants
import { Colors } from '../utils/constants';
import ScreenWrapper from './ScreenWrapper';
import PullDownToRefresh from '../components/PullDownToRefresh';

const NotificationsScreen = () => {
  const dispatch = useDispatch();

  const { token, user } = useSelector(selectUserData);
  const { status, userNotifications, count } = useSelector(selectUserNotifications);
  const [refreshing, setRefreshing] = useState(false);

  const handleSearch = () => {
    dispatch(getAllNotifications({ token }));
    setRefreshing(false);
  };

  const handleMoreResult = () => {
    if (userNotifications.length < count && status !== 'loading') {
      handleSearch();
    }
  };

  const onRefreshing = () => {
    setRefreshing(true);
    dispatch(resetNotifications());
    handleSearch();
  };

  useFocusEffect(
    useCallback(() => {
      // Do something when the screen is focused
      if (userNotifications?.length === 0) handleSearch();
      return () => {
        cancelOperation();
      };
    }, []),
  );

  return user ? (
    <ScreenWrapper>
      <View style={styles.container}>
        {userNotifications?.length === 0 && status !== 'loading' && (
          <NoContent refreshing={refreshing} onRefreshing={onRefreshing} msg="no-notifications" />
        )}

        {status !== 'loading' && <PullDownToRefresh />}

        {userNotifications?.length > 0 && (
          <FlatList
            data={userNotifications}
            keyExtractor={(notification) => notification._id}
            contentContainerStyle={{
              padding: 10,
            }}
            refreshControl={
              <RefreshControl
                //refresh control used for the Pull to Refresh
                refreshing={refreshing}
                onRefresh={onRefreshing}
              />
            }
            numColumns={1}
            onEndReached={handleMoreResult}
            onEndReachedThreshold={0.1}
            renderItem={({ item }) => {
              return <NotificationRow notification={item} />;
            }}
          />
        )}

        {status === 'loading' && <LoadingData />}
      </View>
    </ScreenWrapper>
  ) : null;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.WHITE_COLOR,
    width: '100%',
  },
});

export default NotificationsScreen;
