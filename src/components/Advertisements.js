import React from 'react';
import { useNavigation } from '@react-navigation/native';
import i18n from '../i18n/index';
import { FlatList, View, Image, StyleSheet, Text, TouchableOpacity } from 'react-native';

// redux stuff
import { unwrapResult } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';
import { selectUserData } from '../redux/auth/authSlice';
import { selectAdvertisements } from '../redux/advertisements/advertisementsSlice';
import { setSearchCompanyId, setSearchWarehouseId } from '../redux/medicines/medicinesSlices';

// images
import LogoWithDotsImage from '../../assets/sign-in-out-image.jpg';
import OrderOnlineImage from '../../assets/order-online.jpg';
import WarehouseWithOffersImage from '../../assets/warehouses-with-offers.jpg';
import FreeServicesImage from '../../assets/free-services.jpg';

// components
import AdvertisementCard from './AdvertisementCard';

// constants
import { Colors, SERVER_URL } from '../utils/constants';

const Advertisements = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { advertisements } = useSelector(selectAdvertisements);

  const adminAdvertisements = advertisements?.map((adv) => {
    return {
      source: adv.logo_url,
      type: 'url',
      company: adv.company,
      medicine: adv.medicine,
      warehouse: adv.warehouse,
    };
  });

  const backgrounds = [
    ...adminAdvertisements,
    { source: LogoWithDotsImage, type: 'static' },
    { source: OrderOnlineImage, type: 'static' },
    { source: WarehouseWithOffersImage, type: 'static' },
    { source: FreeServicesImage, type: 'static' },
  ];

  const onAdvertisementPressHandler = (adv) => {
    if (adv.type === 'static') return;

    if (adv.company !== null) {
      dispatch(setSearchCompanyId(adv.company._id));
      navigation.navigate('Medicines', {
        screen: 'AllMedicines',
      });
    }

    if (adv.warehouse !== null) {
      dispatch(setSearchWarehouseId(adv.warehouse._id));
      navigation.navigate('Medicines', {
        screen: 'AllMedicines',
      });
    }

    if (adv.medicine !== null) {
      navigation.navigate('Medicines', {
        screen: 'Medicine',
        params: {
          medicineId: adv.medicine._id,
        },
      });
    }
  };

  return (
    <View
      style={{
        height: 320,
      }}
    >
      <FlatList
        data={backgrounds}
        keyExtractor={(item, index) => index + ''}
        numColumns={1}
        horizontal={true}
        renderItem={({ item }) => <AdvertisementCard adv={item} onAdvertisementPress={onAdvertisementPressHandler} />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.MAIN_COLOR,
    textAlign: 'center',
    paddingTop: 10,
  },
});

export default Advertisements;
