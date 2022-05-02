import React, { useEffect } from 'react';
import i18n from '../i18n/index';
import { View, Text, TextInput, ScrollView, ActivityIndicator, Dimensions, StyleSheet } from 'react-native';

// redux stuff
import { useSelector, useDispatch } from 'react-redux';
import { selectSettings } from '../redux/settings/settingsSlice';
import { selectUserData } from '../redux/auth/authSlice';

// component
import SearchHome from '../components/SearchHome';
import SectionHomeScreen from '../components/SectionHomeScreen';
import { Colors } from '../utils/constants';
import SocketObserver from '../components/SocketObserver';

const HomeScreen = () => {
  const windowHeight = Dimensions.get('window').height;
  const dispatch = useDispatch();
  const { token } = useSelector(selectUserData);

  const { settings } = useSelector(selectSettings);

  useEffect(() => {}, []);

  return (
    <>
      <SocketObserver />
      <ScrollView>
        <SearchHome />
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  loading: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default HomeScreen;
