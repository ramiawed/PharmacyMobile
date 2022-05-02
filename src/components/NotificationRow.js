import React from 'react';

import { View, Text, StyleSheet, Image, TouchableWithoutFeedback } from 'react-native';

// icons
import { FontAwesome } from '@expo/vector-icons';

//constant
import { Colors, SERVER_URL, UserTypeConstants } from '../utils/constants';
import { useDispatch, useSelector } from 'react-redux';
import { selectUser, selectUserData } from '../redux/auth/authSlice';
import { useNavigation } from '@react-navigation/native';
import {
  decreaseUnreadNotificationsCount,
  setNotificationRead,
} from '../redux/userNotifications/userNotificationsSlice';

const NotificationRow = ({ notification }) => {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const { user, token } = useSelector(selectUserData);

  const showNotificationDetails = () => {
    if (user.type !== UserTypeConstants.ADMIN && !notification.users.includes(user._id)) {
      dispatch(setNotificationRead({ token, notificationId: notification._id }));
      dispatch(decreaseUnreadNotificationsCount());
    }
    navigation.navigate('Notifications', {
      screen: 'Notification',
      params: {
        notificationId: notification._id,
      },
    });
  };

  return (
    <TouchableWithoutFeedback onPress={showNotificationDetails}>
      <View style={styles.container}>
        {!notification.users.includes(user._id) && user.type !== UserTypeConstants.ADMIN && (
          <FontAwesome name="bookmark" size={24} color={Colors.MAIN_COLOR} style={styles.badge} />
        )}
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {notification.logo_url && notification.logo_url.length !== 0 ? (
            <Image
              source={{ uri: `${SERVER_URL}/notifications/${notification.logo_url}` }}
              style={{
                width: 75,
                height: 75,
                resizeMode: 'contain',
              }}
            />
          ) : (
            <Image
              source={require('../../assets/logo.png')}
              style={{
                width: 75,
                height: 75,
                resizeMode: 'contain',
              }}
            />
          )}
        </View>
        <View style={styles.content}>
          <Text style={styles.header}>{notification.header}</Text>
          <Text style={styles.body} numberOfLines={2} ellipsizeMode="tail">
            {notification.body}
          </Text>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    writingDirection: 'rtl',
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: Colors.SECONDARY_COLOR,
    marginBottom: 5,
    borderRadius: 6,
    overflow: 'hidden',
  },
  content: {
    flex: 1,
    marginHorizontal: 10,
    marginVertical: 10,
    overflow: 'hidden',
  },
  header: {
    writingDirection: 'rtl',
    textAlign: 'left',
    color: Colors.MAIN_COLOR,
    fontSize: 16,
    fontWeight: 'bold',
  },
  body: {
    writingDirection: 'rtl',
    textAlign: 'left',
    color: Colors.GREY_COLOR,
    fontSize: 12,
  },

  badge: {
    position: 'absolute',
    top: -2,
    right: 8,
  },
});

export default NotificationRow;
