import React from 'react';

import { Image, View } from 'react-native';
import { useSelector } from 'react-redux';
import { selectUser } from '../redux/auth/authSlice';
import { baseUrl, Colors } from '../utils/constants';

const ProfileImage = () => {
  const user = useSelector(selectUser);
  return (
    user && (
      <View style={{ backgroundColor: Colors.WHITE_COLOR, borderRadius: 75 }}>
        <Image source={{ uri: `${baseUrl}/${user.logo_url}` }} style={{ width: 150, height: 150 }} />
      </View>
    )
  );
};

export default ProfileImage;
