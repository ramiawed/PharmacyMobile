import React, { useState } from 'react';
import i18n from '../i18n';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

// navigation stuff

// components
import WarehouseIntroduce from '../components/WarehouseIntroduce';
import PharmacyIntroduce from '../components/PharmacyIntroduce';
import SocketObserver from '../components/SocketObserver';
import Advertisements from '../components/Advertisements';
import GuestIntroduce from '../components/GuestIntroduce';
import Communication from '../components/Communication';
import IntroduceUs from '../components/IntroduceUs';
import ScreenWrapper from './ScreenWrapper';
import CompaniesSectionOne from '../components/CompaniesSectionOne';
import CompaniesSectionTwo from '../components/CompaniesSectionTwo';
import WarehousesSectionOne from '../components/WarehousesSectionOne';
import ItemsSectionOne from '../components/ItemsSectionOne';
import ItemsSectionTwo from '../components/ItemsSectionTwo';
import ItemsSectionThree from '../components/ItemsSectionThree';

// constants
import { Colors } from '../utils/constants';

const HomeScreen = ({}) => {
  return (
    <ScreenWrapper>
      <View style={styles.container}>
        {/* <LinearGradient
          colors={['#566092', '#E5EEB5']}
          // locations={[0.2, 0.8]}
          // start={{ x: 0, y: 0 }}
          // end={{ x: 1, y: 1 }}
          style={styles.gradient}
        /> */}

        <SocketObserver />
        <ScrollView>
          <Advertisements />
          <ItemsSectionOne />
          <ItemsSectionTwo />
          <ItemsSectionThree />
          <CompaniesSectionOne />
          <CompaniesSectionTwo />
          <WarehousesSectionOne />
          <IntroduceUs />
          <Text style={styles.specification}>{i18n.t('smart-pharma-specification')}</Text>
          <PharmacyIntroduce />
          <WarehouseIntroduce />
          <GuestIntroduce />
          <Communication />
        </ScrollView>
      </View>
    </ScreenWrapper>
  );
};

// styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.WHITE_COLOR,
    width: '100%',
  },
  specification: {
    textAlign: 'center',
    marginVertical: 10,
    color: Colors.MAIN_COLOR,
    fontSize: 24,
    fontWeight: 'bold',
  },
  gradient: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
});

export default HomeScreen;
