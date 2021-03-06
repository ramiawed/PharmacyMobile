import React from 'react';
import i18n from '../i18n';

import { Image, View, Text, StyleSheet } from 'react-native';

// redux stuff
import { useSelector } from 'react-redux';
import { selectUser } from '../redux/auth/authSlice';

// constants
import { Colors, SERVER_URL } from '../utils/constants';

const ProfileImage = ({ withDetails }) => {
  const user = useSelector(selectUser);
  return (
    user && (
      <>
        <View
          style={{ backgroundColor: Colors.WHITE_COLOR, borderRadius: 50, overflow: 'hidden', alignItems: 'center' }}
        >
          {user.logo_url && user.logo_url.length !== 0 ? (
            <Image
              source={{ uri: `${SERVER_URL}profiles/${user.logo_url}` }}
              style={{ width: 100, height: 100, resizeMode: 'contain' }}
            />
          ) : (
            <Image
              source={require('../../assets/logo.png')}
              style={{ width: 100, height: 100, resizeMode: 'contain' }}
            />
          )}
        </View>
        {withDetails && (
          <>
            <Text style={styles.name}>{user.name}</Text>
            <Text style={styles.type}>{i18n.t(user.type)}</Text>
          </>
        )}
      </>
    )
  );
};

const styles = StyleSheet.create({
  name: {
    color: Colors.WHITE_COLOR,
    fontSize: 18,
    fontWeight: 'bold',
  },
  type: {
    color: Colors.FAILED_COLOR,
    fontWeight: 'bold',
    fontSize: 12,
  },
});

export default ProfileImage;
