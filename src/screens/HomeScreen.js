import React, { useEffect } from 'react';
import { View, Text, TextInput, ScrollView, ActivityIndicator, Dimensions, StyleSheet, Image } from 'react-native';

// redux stuff
import { useSelector, useDispatch } from 'react-redux';
import { selectSettings } from '../redux/settings/settingsSlice';
import { selectUserData } from '../redux/auth/authSlice';

// component
import SearchHome from '../components/SearchHome';
import SocketObserver from '../components/SocketObserver';

// constants
import { Colors, UserTypeConstants } from '../utils/constants';
import Advertisements from '../components/Advertisements';
import { selectAdvertisements } from '../redux/advertisements/advertisementsSlice';

const HomeScreen = () => {
  const windowHeight = Dimensions.get('window').height;
  const dispatch = useDispatch();
  const { token } = useSelector(selectUserData);
  // const { advertisements } = useSelector(selectAdvertisements);

  const { settings } = useSelector(selectSettings);

  useEffect(() => {}, []);

  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        backgroundColor: Colors.WHITE_COLOR,
      }}
    >
      <SocketObserver />
      <SearchHome />

      <ScrollView>
        <Advertisements />

        {/* <Button onPress={showDatepicker} title="Show date picker!" /> */}
        {/* <SearchHome /> */}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  loading: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchTextInput: {
    backgroundColor: Colors.WHITE_COLOR,
    borderRadius: 6,
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
});

export default HomeScreen;
