import React, { memo } from 'react';
import { View, Text, StyleSheet, Image, TouchableWithoutFeedback, Animated } from 'react-native';

import { useNavigation } from '@react-navigation/native';

// redux stuff
import { resetMedicines, setSearchWarehouseId, setSearchCompanyId } from '../redux/medicines/medicinesSlices';
import { useDispatch, useSelector } from 'react-redux';
import { addStatistics } from '../redux/statistics/statisticsSlice';
import { selectUserData } from '../redux/auth/authSlice';
import { setSelectedWarehouse } from '../redux/warehouse/warehousesSlice';
import { selectSettings } from '../redux/settings/settingsSlice';

// constants
import { Colors, UserTypeConstants, SERVER_URL } from '../utils/constants';

const PartnerAdvertisementCard = ({ data }) => {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const { token, user } = useSelector(selectUserData);
  const {
    settings: { showWarehouseItem },
  } = useSelector(selectSettings);

  const allowShowingWarehouseMedicines =
    user?.type === UserTypeConstants.ADMIN ||
    data.type === UserTypeConstants.COMPANY ||
    (data.type === UserTypeConstants.WAREHOUSE && showWarehouseItem && data.allowShowingMedicines);

  const dispatchPartnerSelected = () => {
    if (
      data.type === UserTypeConstants.WAREHOUSE &&
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
              targetUser: data._id,
              action: 'choose-company',
            },
            token,
          }),
        );
      }
    }

    dispatch(resetMedicines());

    if (data.type === UserTypeConstants.COMPANY) {
      dispatch(setSearchCompanyId(data._id));
    }

    if (data.type === UserTypeConstants.WAREHOUSE) {
      dispatch(setSearchWarehouseId(data._id));
    }

    if (data.type === UserTypeConstants.WAREHOUSE && user.type === UserTypeConstants.PHARMACY) {
      dispatch(setSelectedWarehouse(data._id));
    } else {
      dispatch(setSelectedWarehouse(null));
    }

    navigation.navigate('Items', {
      myCompanies: data.ourCompanies,
    });
  };

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        dispatchPartnerSelected();
      }}
    >
      <Animated.View
        style={{
          ...styles.animatedView,
          // height: rect === 'rect' ? 250 : 170,
        }}
      >
        <View
          style={{
            ...styles.logoView,
            // height: rect === 'rect' ? 170 : 100,
            // width: rect === 'rect' ? 125 : 100,
            // borderRadius: rect === 'rect' ? 12 : 50,
          }}
        >
          {data.logo_url && data.logo_url.length !== 0 ? (
            <Image source={{ uri: `${SERVER_URL}/profiles/${data.logo_url}` }} style={{ ...styles.logo }} />
          ) : (
            <Image source={require('../../assets/logo.png')} style={{ ...styles.logo }} />
          )}
        </View>

        <View>
          <Text style={styles.title}>{data.name}</Text>
        </View>
      </Animated.View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  animatedView: {
    padding: 10,
    marginHorizontal: 10,
    backgroundColor: '#fff',
    width: 140,
    height: 170,
    marginVertical: 10,
    alignItems: 'center',
    justifyContent: 'space-around',
    borderRadius: 15,
    flex: 1,
    marginHorizontal: 4,
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.MAIN_COLOR,
    textAlign: 'center',
  },
  logoView: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#d3d3d3',
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  logo: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
});

export default memo(PartnerAdvertisementCard);
