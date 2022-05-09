import React, { memo, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableWithoutFeedback, Animated, ActivityIndicator } from 'react-native';
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

const HomeScreenAdvertisementCard = ({ data, type, rect }) => {
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

    navigation.navigate('Medicines', {
      screen: 'AllMedicines',
    });
  };

  const dispatchItemSelected = () => {
    if (user.type === UserTypeConstants.PHARMACY || user.type === UserTypeConstants.GUEST) {
      dispatch(
        addStatistics({
          obj: {
            sourceUser: user._id,
            targetItem: data._id,
            action: 'choose-item',
          },
          token,
        }),
      );
    }

    navigation.navigate('Medicines', {
      screen: 'Medicine',
      params: {
        medicineId: data._id,
      },
    });
  };

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        if (type === 'item') {
          dispatchItemSelected();
        } else {
          dispatchPartnerSelected();
        }
      }}
    >
      <Animated.View
        style={{
          ...styles.animatedView,
          flex: 1,
          marginHorizontal: 4,
          height: rect === 'rect' ? 250 : 170,
        }}
      >
        <View
          style={{
            ...styles.logoView,
            height: rect === 'rect' ? 170 : 100,
            width: rect === 'rect' ? 125 : 100,
            borderRadius: rect === 'rect' ? 12 : 50,
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
    backgroundColor: '#f3f3f3',
    // height: 170,
    width: 170,
    marginVertical: 10,
    alignItems: 'center',
    justifyContent: 'space-around',
    borderRadius: 15,
  },
  title: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.MAIN_COLOR,
    textAlign: 'center',
  },
  logoView: {
    // width: 100,
    // height: 100,
    // borderRadius: 50,
    borderColor: 'red',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    backgroundColor: '#d3d3d3',
    borderWidth: 2,
    borderColor: '#d3d3d3',
  },
  logo: {
    width: '100%',
    height: '100%',
    // borderRadius: 45,
    resizeMode: 'contain',
  },
});

export default memo(HomeScreenAdvertisementCard);
