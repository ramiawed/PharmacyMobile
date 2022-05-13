import React from 'react';
import { View, ScrollView, StyleSheet, Text } from 'react-native';

// component
import SearchHome from '../components/SearchHome';
import SocketObserver from '../components/SocketObserver';
import Advertisements from '../components/Advertisements';
import IntroduceUs from '../components/IntroduceUs';
import PharmacyIntroduce from '../components/PharmacyIntroduce';
import WarehouseIntroduce from '../components/WarehouseIntroduce';
import GuestIntroduce from '../components/GuestIntroduce';
import CompaniesSectionOne from '../components/CompaniesSectionOne';
import CompaniesSectionTwo from '../components/CompaniesSectionTwo';
import WarehousesSectionOne from '../components/WarehousesSectionOne';
import ItemsSectionOne from '../components/ItemsSectionOne';
import ItemsSectionTwo from '../components/ItemsSectionTwo';
import ItemsSectionThree from '../components/ItemsSectionThree';

// constants
import { Colors } from '../utils/constants';
import i18n from '../i18n';

const HomeScreen = () => {
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
        <IntroduceUs />
        <View>
          <ItemsSectionOne />
          <ItemsSectionTwo />
          <CompaniesSectionOne />
          <WarehousesSectionOne />
          <ItemsSectionThree />
          <CompaniesSectionTwo />
        </View>
        <Text style={styles.specification}>{i18n.t('smart-pharma-specification')}</Text>
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
  specification: {
    textAlign: 'center',
    marginVertical: 10,
    color: Colors.MAIN_COLOR,
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default HomeScreen;
