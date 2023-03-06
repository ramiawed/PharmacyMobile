import React, { useState } from 'react';
import i18n from '../i18n';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

// navigation stuff

// components
import WarehouseIntroduce from '../components/WarehouseIntroduce';
import PharmacyIntroduce from '../components/PharmacyIntroduce';
import SocketObserver from '../components/SocketObserver';
import Advertisements from '../components/Advertisements';
import GuestIntroduce from '../components/GuestIntroduce';
import Communication from '../components/Communication';
import IntroduceUs from '../components/IntroduceUs';
import SearchHome from '../components/SearchHome';
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
  const [showScanner, setShowScanner] = useState(false);

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <SocketObserver />
        {/* <SearchHome showScanner={showScanner} setShowScanner={setShowScanner} /> */}
        <ScrollView>
          <Advertisements />
          <ItemsSectionOne />
          <ItemsSectionTwo />
          <ItemsSectionThree />
          <IntroduceUs />
          <CompaniesSectionOne />
          <CompaniesSectionTwo />
          <WarehousesSectionOne />
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
});

export default HomeScreen;
