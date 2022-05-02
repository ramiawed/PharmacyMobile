import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';
import Loader from '../components/Loader';
import axios from 'axios';

// redux stuff
import { useSelector } from 'react-redux';
import { selectToken } from '../redux/auth/authSlice';

// constants
import { BASEURL, Colors, SERVER_URL } from '../utils/constants';

const NotificationDetailsScreen = ({ route }) => {
  const { notificationId } = route.params;

  const token = useSelector(selectToken);

  const [notification, setNotification] = useState(null);

  const getNotification = async () => {
    const response = await axios.get(`${BASEURL}/notifications/${notificationId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    setNotification(response.data.data.notification);
  };

  useFocusEffect(
    useCallback(() => {
      // Do something when the screen is focused
      getNotification();
      return () => {};
    }, []),
  );

  return notification ? (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        {notification.logo_url && notification.logo_url.length !== 0 ? (
          <Image source={{ uri: `${SERVER_URL}/notifications/${notification.logo_url}` }} style={styles.image} />
        ) : (
          <Image source={require('../../assets/logo.png')} style={styles.image} />
        )}
      </View>
      <Text style={styles.header}>{notification.header}</Text>
      <ScrollView contentContainerStyle={styles.bodyScrollView}>
        <View>
          <Text style={styles.body}>{notification.body}</Text>
        </View>
      </ScrollView>
    </View>
  ) : (
    <Loader />
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    flex: 1,
    backgroundColor: Colors.WHITE_COLOR,
  },
  imageContainer: {
    width: '100%',
    backgroundColor: Colors.WHITE_COLOR,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 3,
    borderBottomColor: Colors.SECONDARY_COLOR,
  },
  image: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
  },
  header: {
    color: Colors.MAIN_COLOR,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'left',
    padding: 10,
  },
  bodyScrollView: {
    padding: 10,
  },
  body: {
    color: Colors.SECONDARY_COLOR,
    fontSize: 14,
    textAlign: 'left',
  },
});

export default NotificationDetailsScreen;
