import { useFocusEffect } from '@react-navigation/native';
import i18n from 'i18n-js';
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, RefreshControl, ActivityIndicator, ScrollView } from 'react-native';

// redux stuff
import { useDispatch, useSelector } from 'react-redux';
import NotificationRow from '../components/NotificationRow';
import { selectToken, selectUserData } from '../redux/auth/authSlice';
import {
  getAllNotifications,
  getUnreadNotification,
  resetNotifications,
  resetNotificationsData,
  selectUserNotifications,
  setPage,
  setRefresh,
} from '../redux/userNotifications/userNotificationsSlice';
import { Colors } from '../utils/constants';

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
    if (userNotifications.length < count) {
      handleSearch();
    }
  };

  const onRefreshing = () => {
    setRefreshing(true);
    dispatch(resetNotifications());
    handleSearch();
  };

  useEffect(() => {
    handleSearch();
  }, []);

  return user ? (
    <View style={styles.container}>
      {userNotifications?.length === 0 && status !== 'loading' && (
        <ScrollView
          contentContainerStyle={{
            width: '100%',
            height: '100%',
          }}
          refreshControl={
            <RefreshControl
              //refresh control used for the Pull to Refresh
              refreshing={refreshing}
              onRefresh={onRefreshing}
            />
          }
        >
          <View style={styles.noContentContainer}>
            <Image source={require('../../assets/no-content.jpeg')} style={styles.noContentImage} />
            <Text style={styles.noContent}>{i18n.t('no-notifications')}</Text>
          </View>
        </ScrollView>
      )}

      {userNotifications?.length > 0 && (
        <FlatList
          data={userNotifications}
          keyExtractor={(notification) => notification._id}
          contentContainerStyle={{
            padding: 20,
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

      {status === 'loading' && (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator size="large" color={Colors.SECONDARY_COLOR} />
          <Text
            style={{
              fontSize: 18,
              fontWeight: '700',
              color: Colors.SECONDARY_COLOR,
              marginTop: 20,
            }}
          >
            {i18n.t('loading-data')}
          </Text>
        </View>
      )}
    </View>
  ) : null;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.WHITE_COLOR,
  },
  noContentContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noContentImage: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
  },
});

export default NotificationsScreen;
