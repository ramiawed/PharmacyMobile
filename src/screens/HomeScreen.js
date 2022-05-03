import React, { useEffect, useState } from 'react';
import i18n from '../i18n/index';
import { View, Text, TextInput, ScrollView, ActivityIndicator, Dimensions, StyleSheet, Button } from 'react-native';

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

  const [date, setDate] = useState(new Date(1598051730000));

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate;
    setDate(currentDate);
  };

  const showMode = (currentMode) => {
    DateTimePickerAndroid.open({
      value: date,
      onChange,
      mode: currentMode,
      is24Hour: true,
    });
  };

  const showDatepicker = () => {
    showMode('date');
  };

  const showTimepicker = () => {
    showMode('time');
  };

  return (
    <>
      <SocketObserver />
      <ScrollView>
        {/* <Button onPress={showDatepicker} title="Show date picker!" /> */}
        {/* <SearchHome /> */}
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
