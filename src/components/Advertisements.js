import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { View } from 'react-native';
import GestureRecognizer, { swipeDirections } from 'react-native-swipe-gestures';

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
  };

  const prevBackground = () => {
    clearInterval(timer);

    i.current = i.current === 0 ? adminAdvertisements.length - 1 : i.current - 1;

    setIndex(i.current);

    startTimer();
  };

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
      navigation.navigate('Items', {
        params: {
          myCompanies: [],
        },
      });
    }

    if (adv.warehouse !== null) {
      dispatch(resetMedicines());
      dispatch(setSearchWarehouseId(adv.warehouse._id));
      navigation.navigate('Items', {
        params: {
          myCompanies: adv.warehouse.ourCompanies,
        },
      });
    }

    if (adv.medicine !== null) {
      navigation.navigate('ItemDetails', {
        medicineId: adv.medicine._id,
      });
    }
  };

  const onSwipe = (gestureName, gestureState) => {
    const { SWIPE_LEFT, SWIPE_RIGHT } = swipeDirections;
    if (gestureName === SWIPE_LEFT) {
      prevBackground();
    }

    if (gestureName === SWIPE_RIGHT) {
      nextBackground();
    }
  };

  return backgrounds?.length === 0 ? (
    <></>
  ) : (
    <GestureRecognizer onSwipe={onSwipe}>
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
          marginBottom: 10,
        }}
      >
        <AdvertisementCard adv={backgrounds[index]} onAdvertisementPress={onAdvertisementPressHandler} />
        <View
          style={{
            flexDirection: 'row',
            marginTop: 10,
            alignItems: 'center',
          }}
        >
          {backgrounds.map((background, index) => (
            <View style={[styles.point, index === i.current ? styles.active : null]} key={index}></View>
          ))}
        </View>
      </View>
    </GestureRecognizer>
  );
};

const styles = StyleSheet.create({
  point: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.BLUE_COLOR,
    marginHorizontal: 4,
  },
  active: {
    backgroundColor: Colors.MAIN_COLOR,
    width: 14,
    height: 14,
    borderRadius: 7,
  },
});

export default Advertisements;
