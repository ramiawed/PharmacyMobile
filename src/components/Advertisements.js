import React, { useEffect, useRef, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { View } from 'react-native';

// icons
import { Feather } from '@expo/vector-icons';

// redux stuff
import { useDispatch, useSelector } from 'react-redux';
import { selectAdvertisements } from '../redux/advertisements/advertisementsSlice';
import { resetMedicines, setSearchCompanyId, setSearchWarehouseId } from '../redux/medicines/medicinesSlices';

// components
import AdvertisementCard from './AdvertisementCard';

// constants
import { Colors } from '../utils/constants';

let timer = null;

const Advertisements = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  // selectors
  const { advertisements } = useSelector(selectAdvertisements);

  // own state
  const [index, setIndex] = useState(0);
  const i = useRef(0);

  const adminAdvertisements = advertisements?.map((adv) => {
    return {
      source: adv.logo_url,
      company: adv.company,
      medicine: adv.medicine,
      warehouse: adv.warehouse,
    };
  });

  const startTimer = () => {
    timer = setInterval(() => {
      i.current = i.current === advertisements.length - 1 ? 0 : i.current + 1;

      setIndex(i.current);
    }, 7000);
  };

  const nextBackground = () => {
    clearInterval(timer);

    i.current = i.current === advertisements.length - 1 ? 0 : i.current + 1;

    setIndex(i.current);

    startTimer();
  }

  const prevBackground = () => {
    clearInterval(timer);

    i.current = i.current === 0 ? adminAdvertisements.length - 1 : i.current - 1;

    setIndex(i.current);

    startTimer();
  }

  useEffect(() => {
    startTimer();

    return () => {
      clearInterval(timer);
    };
  }, []);

  const backgrounds = [...adminAdvertisements];

  const onAdvertisementPressHandler = (adv) => {
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
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row'
      }}
    >
      <Feather name="arrow-right-circle" size={36} color={Colors.GREY_COLOR} onPress={prevBackground} />
      <AdvertisementCard adv={backgrounds[index]} onAdvertisementPress={onAdvertisementPressHandler} />
      <Feather name="arrow-left-circle" size={36} color={Colors.GREY_COLOR} onPress={nextBackground} />
    </View>
  );
};


export default Advertisements;
