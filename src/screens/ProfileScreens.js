import React, { useState, useCallback } from 'react';
import i18n from '../i18n/index';
import axios from 'axios';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import Toast from 'react-native-toast-message';

// components
import ChangeInputModal from '../components/ChangeInputModal';
import ChangePassword from '../components/ChangePassword';
import ExpandedView from '../components/ExpandedView';
import ProfileImage from '../components/ProfileImage';
import UserInfoRow from '../components/UserInfoRow';
import DeleteMe from '../components/DeleteMe';
import ScreenWrapper from './ScreenWrapper';
import Loader from '../components/Loader';

// redux stuff
import { unwrapResult } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';
import { changeLogoURL, selectUserData, updateUserInfo } from '../redux/auth/authSlice';

// icons
import { EvilIcons } from '@expo/vector-icons';

// constants
import { BASEURL, Colors, UserTypeConstants } from '../utils/constants';
import { signoutHandler } from '../utils/functions';
import PullDownToRefresh from '../components/PullDownToRefresh';

const ProfileScreen = () => {
  const dispatch = useDispatch();
  const { user, token, updateStatus, changePasswordStatus } = useSelector(selectUserData);

  // own state
  const [refreshing, setRefreshing] = useState(false);
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

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      setLoading(true);
      const data = new FormData();

      let localUri = result.uri;
      let filename = localUri.split('/').pop();

      // Infer the type of the image
      let match = /\.(\w+)$/.exec(filename);
      let type = match ? `image/${match[1]}` : `image`;
      data.append('file', { uri: localUri, name: filename, type });

      const config = {
        headers: {
          'content-type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      };

      axios
        .post(`${BASEURL}/users/upload`, data, config)
        .then((res) => {
          dispatch(changeLogoURL(res.data.data.name));
          getMyInfo();
          setLoading(false);
        })
        .catch((err) => {
          setLoading(false);
        });
    }
  };

  const updateFieldHandler = (field, val) => {
    // dispatch updateUserInfo
    dispatch(updateUserInfo({ obj: { [field]: val }, token: token }))
      .then(unwrapResult)
      .then(() => {
        getMyInfo();
        Toast.show({
          type: 'success',
          text1: i18n.t('user-profile-update-success'),
          text2: i18n.t('update-succeeded'),
        });
      })
      .catch((err) => {
        Toast.show({
          type: 'error',
          text1: i18n.t('user-profile-update-error'),
          text2: i18n.t(err.message),
        });
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
        setRefreshing(false);
      });
  };

  const onRefreshing = () => {
    setRefreshing(true);
    getMyInfo();
  };

  useFocusEffect(
    useCallback(() => {
      // Do something when the screen is focused
      getMyInfo();

      return () => {
        setUserObj({});
      };
    }, []),
  );

  return user ? (
    loading ? (
      <Loader />
    ) : (
      <ScreenWrapper>
        <View style={styles.container}>
          <PullDownToRefresh />
          <ScrollView
            contentContainerStyle={{
              alignItems: 'center',
              // paddingTop: 10,
            }}
            style={styles.container}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefreshing} />}
          >
            <ProfileImage />
            <TouchableOpacity
              style={{
                backgroundColor: Colors.WHITE_COLOR,
                alignItems: 'center',
              }}
              onPress={pickImage}
            >
              <View style={styles.changeProfileImageBtn}>
                <EvilIcons name="image" size={24} color={Colors.WHITE_COLOR} style={{ paddingHorizontal: 4 }} />
                <Text style={{ color: Colors.WHITE_COLOR }}>{i18n.t('change-logo')}</Text>
              </View>
            </TouchableOpacity>
            {/* personal information */}
            <ExpandedView title={i18n.t('personal-info')}>
              <UserInfoRow
                label={i18n.t('user name')}
                value={userObj.name}
                editable={true}
                action={() => actionHandler('user name', 'name')}
              />
              <UserInfoRow
                label={i18n.t('user username')}
                value={userObj.username}
                editable={true}
                action={() => actionHandler('user username', 'username')}
              />
              <UserInfoRow
                label={i18n.t('user type')}
                value={i18n.t(userObj.type)}
                editable={false}
                withoutBottomBorder={true}
              />
            </ExpandedView>

            <ExpandedView title={i18n.t('communication-info')}>
              <UserInfoRow
                label={i18n.t('user phone')}
                value={userObj.phone}
                editable={true}
                action={() => actionHandler('user phone', 'phone')}
              />
              <UserInfoRow
                label={i18n.t('user mobile')}
                value={userObj.mobile}
                editable={true}
                action={() => actionHandler('user mobile', 'mobile')}
              />
              <UserInfoRow
                label={i18n.t('user email')}
                value={userObj.email}
                editable={true}
                action={() => actionHandler('user email', 'email')}
                withoutBottomBorder={true}
              />
            </ExpandedView>

            <ExpandedView title={i18n.t('address-info')}>
              <UserInfoRow label={i18n.t('user-city')} value={i18n.t(userObj.city)} editable={false} />
              <UserInfoRow
                label={i18n.t('user address details')}
                value={userObj.addressDetails}
                editable={true}
                action={() => actionHandler('user address details', 'addressDetails')}
                withoutBottomBorder={true}
              />
            </ExpandedView>

            {(user.type === UserTypeConstants.PHARMACY || user.type === UserTypeConstants.WAREHOUSE) && (
              <ExpandedView title={i18n.t('additional-info')}>
                <UserInfoRow
                  label={i18n.t('user employee name')}
                  value={userObj.employeeName}
                  editable={true}
                  action={() => actionHandler('user employee name', 'employeeName')}
                />
                <UserInfoRow
                  label={i18n.t('user certificate name')}
                  value={userObj.certificateName}
                  editable={true}
                  action={() => actionHandler('user certificate name', 'certificateName')}
                  withoutBottomBorder={true}
                />
              </ExpandedView>
            )}

            {user.type === UserTypeConstants.GUEST && (
              <ExpandedView title={i18n.t('additional-info')}>
                <UserInfoRow
                  label={i18n.t('user job')}
                  value={i18n.t(userObj.guestDetails?.job)}
                  action={() => actionHandler('user job', 'guestDetails.job')}
                />
                <UserInfoRow
                  label={i18n.t('user-company-name')}
                  value={userObj.guestDetails?.companyName}
                  editable={true}
                  action={() => actionHandler('user-company-name', 'guestDetails.companyName')}
                  withoutBottomBorder={true}
                />
              </ExpandedView>
            )}

            <ExpandedView title={i18n.t('change-password')}>
              <ChangePassword />
            </ExpandedView>

            <ExpandedView title={i18n.t('delete-account')} danger={true}>
              <DeleteMe />
            </ExpandedView>

            {/* sign out section */}
            <TouchableOpacity style={styles.button} onPress={() => signoutHandler(dispatch, token)}>
              <Text style={styles.buttonText}>{i18n.t('nav sign out')}</Text>
            </TouchableOpacity>
          </ScrollView>

          {showChangeInputModal && <ChangeInputModal params={changeModalObj} />}
          {(updateStatus === 'loading' || changePasswordStatus === 'loading') && <Loader />}
        </View>
      </ScreenWrapper>
    )
  ) : (
    <></>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.WHITE_COLOR,
    width: '100%',
    padding: 5,
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
  changeProfileImageBtn: {
    flexDirection: 'row',
    backgroundColor: Colors.SUCCEEDED_COLOR,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 6,
    padding: 6,
    marginVertical: 5,
  },
});

export default ProfileScreen;
