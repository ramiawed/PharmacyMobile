import React from 'react';

import { Image, View, Text, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import i18n from '../i18n';
import { selectUser } from '../redux/auth/authSlice';
import { BASEURL, Colors, SERVER_URL } from '../utils/constants';

const ProfileImage = () => {
  const user = useSelector(selectUser);
  return (
    user && (
      <>
        <View style={{ backgroundColor: Colors.WHITE_COLOR, borderRadius: 6, overflow: 'hidden' }}>
          <Image
            source={{ uri: `${SERVER_URL}profiles/${user.logo_url}` }}
            style={{ width: 150, height: 150, resizeMode: 'contain' }}
          />
        </View>
        <Text style={styles.name}>{user.name}</Text>
        <Text style={styles.type}>{i18n.t(user.type)}</Text>
      </>
    )
  );
};

const styles = StyleSheet.create({
  name: {
    color: Colors.WHITE_COLOR,
    fontSize: 24,
    fontWeight: '700',
  },
  type: {
    color: Colors.FAILED_COLOR,
    fontWeight: '400',
    fontSize: 16,
  },
});

export default ProfileImage;