import React from 'react';
import { View, Text, TextInput, ScrollView, ActivityIndicator, Dimensions, StyleSheet, Image } from 'react-native';

// redux stuff
import { useSelector } from 'react-redux';
import { selectSettings } from '../redux/settings/settingsSlice';

// component
import SearchHome from '../components/SearchHome';
import SocketObserver from '../components/SocketObserver';
import Advertisements from '../components/Advertisements';
import IntroduceUs from '../components/IntroduceUs';

// constants
import { Colors } from '../utils/constants';
import PharmacyIntroduce from '../components/PharmacyIntroduce';
import WarehouseIntroduce from '../components/WarehouseIntroduce';
import GuestIntroduce from '../components/GuestIntroduce';
import CompaniesSectionOne from '../components/CompaniesSectionOne';
import CompaniesSectionTwo from '../components/CompaniesSectionTwo';
import WarehousesSectionOne from '../components/WarehousesSectionOne';
import ItemsSectionOne from '../components/ItemsSectionOne';
import ItemsSectionTwo from '../components/ItemsSectionTwo';
import ItemsSectionThree from '../components/ItemsSectionThree';

const HomeScreen = () => {
  const { settings } = useSelector(selectSettings);

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
        <IntroduceUs />
        <Advertisements />
        <View>
          <ItemsSectionOne />
          <ItemsSectionTwo />
          <CompaniesSectionOne />
          <WarehousesSectionOne />
          <ItemsSectionThree />
          <CompaniesSectionTwo />
        </View>
        <PharmacyIntroduce />
        <WarehouseIntroduce />
        <GuestIntroduce />
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
