// import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState, useEffect, useLayoutEffect, useCallback } from 'react';
import i18n from '../i18n/index';
import axios from 'axios';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image } from 'react-native';

// components
import UserInfoRow from '../components/UserInfoRow';
import ChangePassword from '../components/ChangePassword';
import DeleteMe from '../components/DeleteMe';
import ExpandedView from '../components/ExpandedView';
import ChangeInputModal from '../components/ChangeInputModal';
import Loader from '../components/Loader';

// redux stuff
import { unwrapResult } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';
import { authSliceSignOut, selectUserData, updateUserInfo } from '../redux/auth/authSlice';
import { usersSliceSignOut } from '../redux/users/usersSlice';
import { favoritesSliceSignOut } from '../redux/favorites/favoritesSlice';
import { companySliceSignOut } from '../redux/company/companySlice';
import { warehouseSliceSignOut } from '../redux/warehouse/warehousesSlice';
import { itemsSliceSignOut } from '../redux/items/itemsSlices';
import { cartSliceSignOut } from '../redux/cart/cartSlice';
import { orderSliceSignOut } from '../redux/orders/ordersSlice';
import { medicinesSliceSignOut, resetMedicines } from '../redux/medicines/medicinesSlices';
import { statisticsSliceSignOut } from '../redux/statistics/statisticsSlice';
import { warehouseItemsSliceSignOut } from '../redux/warehouseItems/warehouseItemsSlices';
import { advertisementsSignOut } from '../redux/advertisements/advertisementsSlice';
import { companiesSectionOneSignOut } from '../redux/advertisements/companiesSectionOneSlice';
import { companiesSectionTwoSignOut } from '../redux/advertisements/companiesSectionTwoSlice';
import { itemsSectionOneSignOut } from '../redux/advertisements/itemsSectionOneSlice';
import { itemsSectionThreeSignOut } from '../redux/advertisements/itemsSectionThreeSlice';
import { itemsSectionTwoSignOut } from '../redux/advertisements/itemsSectionTwoSlice';
import { warehousesSectionOneSignOut } from '../redux/advertisements/warehousesSectionOneSlice';
import { notificationsSignOut } from '../redux/notifications/notificationsSlice';
import { settingsSignOut } from '../redux/settings/settingsSlice';
import { usersNotificationsSignOut } from '../redux/userNotifications/userNotificationsSlice';

// constants
import { BASEURL, Colors, SERVER_URL, UserTypeConstants } from '../utils/constants';
import { useFocusEffect } from '@react-navigation/native';

const ProfileScreen = () => {
  const dispatch = useDispatch();
  const { user, token, updateStatus, changePasswordStatus } = useSelector(selectUserData);

  const signOutHandler = () => {
    dispatch(authSliceSignOut());
    dispatch(cartSliceSignOut());
    dispatch(companySliceSignOut());
    dispatch(favoritesSliceSignOut());
    dispatch(itemsSliceSignOut());
    dispatch(statisticsSliceSignOut());
    dispatch(usersSliceSignOut());
    dispatch(warehouseSliceSignOut());
    dispatch(warehouseItemsSliceSignOut());
    dispatch(orderSliceSignOut());
    dispatch(resetMedicines());
    dispatch(advertisementsSignOut());
    dispatch(companiesSectionOneSignOut());
    dispatch(companiesSectionTwoSignOut());
    dispatch(itemsSectionOneSignOut());
    dispatch(itemsSectionThreeSignOut());
    dispatch(itemsSectionTwoSignOut());
    dispatch(warehousesSectionOneSignOut());
    dispatch(medicinesSliceSignOut());
    dispatch(notificationsSignOut());
    dispatch(settingsSignOut());
    dispatch(usersNotificationsSignOut());
  };

  const inputFileRef = React.useRef(null);

  // own state
  const [userObj, setUserObj] = useState({});
  const [loading, setLoading] = useState(false);
  const [showChangeInputModal, setShowChangeInputModal] = useState(false);
  const [changeModalObj, setChangeModalObj] = useState({
    title: '',
    okAction: () => {},
    cancelAction: () => {
      setShowChangeInputModal(false);
    },
  });

  const handleClick = () => {
    inputFileRef.current.click();
  };

  const fileSelectedHandler = (event) => {
    if (event.target.files[0]) {
      setLoading(true);
      // setSelectedFile(event.target.files[0]);
      let formData = new FormData();
      formData.append('file', event.target.files[0]);

      const config = {
        headers: {
          'content-type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      };

      axios.post(`${BASEURL}/users/upload`, formData, config).then((res) => {
        dispatch(changeLogoURL(res.data.data.name));
        getMyInfo();
        setLoading(false);
      });
    }
  };

  const handleInputChange = (field, val) => {
    setUserObj({
      ...userObj,
      [field]: val,
    });
  };

  const handleCityChange = (val) => {
    setUserObj({
      ...userObj,
      city: val,
    });
  };

  const updateFieldHandler = (field, val) => {
    // dispatch updateUserInfo
    dispatch(updateUserInfo({ obj: { [field]: val }, token: token }))
      .then(unwrapResult)
      .then(() => {
        getMyInfo();
      });
  };

  const actionHandler = (label, field) => {
    setChangeModalObj({
      ...changeModalObj,
      title: i18n.t(label),
      okAction: (val) => updateFieldHandler(field, val),
    });
    setShowChangeInputModal(true);
  };

  const getMyInfo = () => {
    setLoading(true);
    axios
      .get(`${BASEURL}/users/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setUserObj(response.data.data.user);
        setLoading(false);
      });
  };

  // useEffect(() => {

  // }, []);

  useFocusEffect(
    useCallback(() => {
      // Do something when the screen is focused
      getMyInfo();

      return () => {
        setUserObj({});
      };
    }, []),
  );

  return loading ? (
    <Loader />
  ) : (
    <View style={{ flex: 1 }}>
      {/* <Image source={require('../../assets/logo.png')} style={styles.image} /> */}
      <ScrollView
        contentContainerStyle={{
          alignItems: 'center',
          paddingTop: 10,
        }}
        style={styles.container}
      >
        {/* personal information */}
        <ExpandedView title={i18n.t('personal-info')}>
          <UserInfoRow
            label={i18n.t('user-name')}
            value={userObj.name}
            editable={true}
            action={() => actionHandler('user-name', 'name')}
          />
          <UserInfoRow
            label={i18n.t('user-username')}
            value={userObj.username}
            editable={true}
            action={() => actionHandler('user-username', 'username')}
          />
          <UserInfoRow label={i18n.t('user-type')} value={i18n.t(userObj.type)} editable={false} />
        </ExpandedView>

        <ExpandedView title={i18n.t('communication-info')}>
          <UserInfoRow
            label={i18n.t('user-phone')}
            value={userObj.phone}
            editable={true}
            action={() => actionHandler('user-phone', 'phone')}
          />
          <UserInfoRow
            label={i18n.t('user-mobile')}
            value={userObj.mobile}
            editable={true}
            action={() => actionHandler('user-mobile', 'mobile')}
          />
          <UserInfoRow
            label={i18n.t('user-email')}
            value={userObj.email}
            editable={true}
            action={() => actionHandler('user-email', 'email')}
          />
        </ExpandedView>

        <ExpandedView title={i18n.t('address-info')}>
          <UserInfoRow label={i18n.t('user-city')} value={i18n.t(userObj.city)} editable={false} />
          <UserInfoRow
            label={i18n.t('user-address-details')}
            value={userObj.addressDetails}
            editable={true}
            action={() => actionHandler('user-address-details', 'addressDetails')}
          />
        </ExpandedView>

        {(user.type === UserTypeConstants.PHARMACY || user.type === UserTypeConstants.WAREHOUSE) && (
          <ExpandedView title={i18n.t('additional-info')}>
            <UserInfoRow
              label={i18n.t('user-employee-name')}
              value={userObj.employeeName}
              editable={true}
              action={() => actionHandler('user-employee-name', 'employeeName')}
            />
            <UserInfoRow
              label={i18n.t('user-certificate-name')}
              value={userObj.certificateName}
              editable={true}
              action={() => actionHandler('user-certificate-name', 'certificateName')}
            />
          </ExpandedView>
        )}

        {user.type === UserTypeConstants.GUEST && (
          <ExpandedView title={i18n.t('additional-info')}>
            <UserInfoRow
              label={i18n.t('user-job')}
              value={i18n.t(userObj.guestDetails?.job)}
              // editable={true}
              action={() => actionHandler('user-job', 'guestDetails.job')}
            />
            <UserInfoRow
              label={i18n.t('user-company-name')}
              value={userObj.guestDetails?.companyName}
              editable={true}
              action={() => actionHandler('user-company-name', 'guestDetails.companyName')}
            />
          </ExpandedView>
        )}

        <ExpandedView title={i18n.t('change-password')}>
          <ChangePassword />
        </ExpandedView>

        <ExpandedView title={i18n.t('delete-account')} danger={true}>
          <DeleteMe resetStore={signOutHandler} />
        </ExpandedView>

        {/* sign out section */}
        <TouchableOpacity style={styles.button} onPress={signOutHandler}>
          <Text style={styles.buttonText}>{i18n.t('nav-sign-out')}</Text>
        </TouchableOpacity>
      </ScrollView>

      {showChangeInputModal && <ChangeInputModal params={changeModalObj} />}
      {(updateStatus === 'loading' || changePasswordStatus === 'loading') && <Loader />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.WHITE_COLOR,
  },
  button: {
    backgroundColor: Colors.FAILED_COLOR,
    minWidth: 100,
    padding: 10,
    borderRadius: 6,
    marginVertical: 10,
  },
  buttonText: {
    textAlign: 'center',
    color: '#fff',
  },
  image: {
    width: '100%',
    height: 300,
    resizeMode: 'contain',
  },
  sectionHeader: {
    color: Colors.WHITE_COLOR,
    backgroundColor: Colors.MAIN_COLOR,
    fontSize: 16,
    fontWeight: 'bold',
    padding: 5,
    borderRadius: 6,
    marginBottom: 5,
  },
});

export default ProfileScreen;
