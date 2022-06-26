import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { FlatList, View, StyleSheet } from 'react-native';

// redux stuff
import { useDispatch, useSelector } from 'react-redux';
import { selectAdvertisements } from '../redux/advertisements/advertisementsSlice';
import { resetMedicines, setSearchCompanyId, setSearchWarehouseId } from '../redux/medicines/medicinesSlices';

// images
// import LogoWithDotsImage from '../../assets/1.png';
// import OrderOnlineImage from '../../assets/2.png';
// import WarehouseWithOffersImage from '../../assets/3.png';
// import FreeServicesImage from '../../assets/4.png';

// components
import AdvertisementCard from './AdvertisementCard';

// constants
import { Colors } from '../utils/constants';

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

  const backgrounds = [...adminAdvertisements];

  const onAdvertisementPressHandler = (adv) => {
    if (adv.type === 'static') return;

    if (adv.company !== null) {
      dispatch(resetMedicines());
      dispatch(setSearchCompanyId(adv.company._id));
      navigation.navigate('Medicines', {
        screen: 'AllMedicines',
        params: {
          myCompanies: [],
        },
      });
    }

    if (adv.warehouse !== null) {
      dispatch(resetMedicines());
      dispatch(setSearchWarehouseId(adv.warehouse._id));
      navigation.navigate('Medicines', {
        screen: 'AllMedicines',
        params: {
          myCompanies: adv.warehouse.ourCompanies,
        },
      });
    }

    if (adv.medicine !== null) {
      dispatch(resetMedicines());
      navigation.navigate('Medicines', {
        screen: 'Medicine',
        params: {
          medicineId: adv.medicine._id,
        },
      });
    }
  };

  return backgrounds?.length === 0 ? (
    <></>
  ) : (
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

// const styles = StyleSheet.create({
//   header: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     color: Colors.MAIN_COLOR,
//     textAlign: 'center',
//     paddingTop: 10,
//   },
// });

export default Advertisements;
