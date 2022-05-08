import React, { memo, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableWithoutFeedback, Animated, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';

// icons
import { AntDesign } from '@expo/vector-icons';

// redux stuff
import { resetMedicines, setSearchWarehouseId, setSearchCompanyId } from '../redux/medicines/medicinesSlices';
import { useDispatch, useSelector } from 'react-redux';
import { addStatistics } from '../redux/statistics/statisticsSlice';
import { selectUserData } from '../redux/auth/authSlice';
import { setSelectedWarehouse } from '../redux/warehouse/warehousesSlice';
import { selectSettings } from '../redux/settings/settingsSlice';

// constants
import { Colors, UserTypeConstants, SERVER_URL } from '../utils/constants';

const PartnerCardAdvertisement = ({ partner }) => {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const { token, user } = useSelector(selectUserData);
  const {
    settings: { showWarehouseItem },
  } = useSelector(selectSettings);

  const allowShowingWarehouseMedicines =
    user?.type === UserTypeConstants.ADMIN ||
    partner.type === UserTypeConstants.COMPANY ||
    (partner.type === UserTypeConstants.WAREHOUSE && showWarehouseItem && partner.allowShowingMedicines);

  const dispatchPartnerSelected = () => {
    if (
      partner.type === UserTypeConstants.WAREHOUSE &&
      (user.type === UserTypeConstants.WAREHOUSE ||
        user.type === UserTypeConstants.COMPANY ||
        user.type === UserTypeConstants.GUEST)
    ) {
      return;
    }

    if (allowShowingWarehouseMedicines) {
      // if the partner type is pharmacy or normal, change the selectedCount
      // and selectedDates for this company
      if (user.type === UserTypeConstants.PHARMACY) {
        dispatch(
          addStatistics({
            obj: {
              sourceUser: user._id,
              targetUser: partner._id,
              action: 'choose-company',
            },
            token,
          }),
        );
      }
    }

    dispatch(resetMedicines());

    if (partner.type === UserTypeConstants.COMPANY) {
      dispatch(setSearchCompanyId(partner._id));
    }

    if (partner.type === UserTypeConstants.WAREHOUSE) {
      dispatch(setSearchWarehouseId(partner._id));
    }

    if (partner.type === UserTypeConstants.WAREHOUSE && user.type === UserTypeConstants.PHARMACY) {
      dispatch(setSelectedWarehouse(partner._id));
    } else {
      dispatch(setSelectedWarehouse(null));
    }

    navigation.navigate('Medicines', {
      screen: 'AllMedicines',
    });
  };

  return (
    <TouchableWithoutFeedback onPress={dispatchPartnerSelected}>
      <Animated.View
        style={{
          ...styles.animatedView,
          flex: 1,
          marginHorizontal: 4,
        }}
      >
        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
          {partner.logo_url && partner.logo_url.length !== 0 ? (
            <Image source={{ uri: `${SERVER_URL}/profiles/${partner.logo_url}` }} style={styles.logo} />
          ) : (
            <Image source={require('../../assets/logo.png')} style={styles.logo} />
          )}
        </View>

        <View>
          <Text style={styles.title}>{partner.name}</Text>
        </View>
      </Animated.View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  animatedView: {
    padding: 10,
    marginHorizontal: 10,
    backgroundColor: '#f3f3f3',
    height: 300,
    width: 300,
    marginVertical: 10,
    alignItems: 'center',
    justifyContent: 'space-around',
    borderRadius: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.MAIN_COLOR,
    textAlign: 'center',
  },

  logo: {
    width: 200,
    height: 200,
    borderRadius: 12,
    resizeMode: 'contain',
  },
});

export default memo(PartnerCardAdvertisement);
