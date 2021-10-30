import React, { useEffect } from 'react';
import i18n from '../i18n/index';
import { View, Text, TextInput, ScrollView, ActivityIndicator, Dimensions, StyleSheet } from 'react-native';

// redux stuff
import { useSelector, useDispatch } from 'react-redux';
import { selectSettings } from '../redux/settings/settingsSlice';
import { selectCompaniesSectionOne, getCompaniesSectionOne } from '../redux/advertisements/companiesSectionOneSlice';
import { selectCompaniesSectionTwo, getCompaniesSectionTwo } from '../redux/advertisements/companiesSectionTwoSlice';
import { selectItemsSectionOne, getItemsSectionOne } from '../redux/advertisements/itemsSectionOneSlice';
import { selectItemsSectionTwo, getItemsSectionTwo } from '../redux/advertisements/itemsSectionTwoSlice';
import { selectItemsSectionThree, getItemsSectionThree } from '../redux/advertisements/itemsSectionThreeSlice';
import { selectUserData } from '../redux/auth/authSlice';

// component
import SearchHome from '../components/SearchHome';
import SectionHomeScreen from '../components/SectionHomeScreen';
import { Colors } from '../utils/constants';

const HomeScreen = () => {
  const windowHeight = Dimensions.get('window').height;
  const dispatch = useDispatch();
  const { token } = useSelector(selectUserData);
  const { companiesSectionOne, companiesSectionOneStatus } = useSelector(selectCompaniesSectionOne);
  const { companiesSectionTwo, companiesSectionTwoStatus } = useSelector(selectCompaniesSectionTwo);
  const { itemsSectionOne, itemsSectionOneStatus } = useSelector(selectItemsSectionOne);
  const { itemsSectionTwo, itemsSectionTwoStatus } = useSelector(selectItemsSectionTwo);
  const { itemsSectionThree, itemsSectionThreeStatus } = useSelector(selectItemsSectionThree);
  const { settings } = useSelector(selectSettings);

  useEffect(() => {
    dispatch(getCompaniesSectionOne({ token }));
    dispatch(getCompaniesSectionTwo({ token }));
    dispatch(getItemsSectionOne({ token }));
    dispatch(getItemsSectionTwo({ token }));
    dispatch(getItemsSectionThree({ token }));
  }, []);

  return (
    <ScrollView>
      <SearchHome />
      <View>
        {settings.companiesSectionOne?.show && companiesSectionOneStatus === 'loading' && (
          <View
            style={{
              ...styles.loading,
              backgroundColor: '#1a535c',
              order: settings.companiesSectionOne?.order,
              height: (windowHeight - 140) / 2,
            }}
          >
            <ActivityIndicator size="large" color={Colors.WHITE_COLOR} />
          </View>
        )}

        {settings.companiesSectionOne?.show && companiesSectionOne.length > 0 && (
          <SectionHomeScreen
            data={companiesSectionOne}
            containerBackground="#1a535c"
            headerBackground="#083137"
            header={settings.companiesSectionOne?.title}
            description={settings.companiesSectionOne?.description}
            order={settings.companiesSectionOne?.order}
            type="company"
          />
        )}

        {settings.companiesSectionTwo?.show && companiesSectionTwoStatus === 'loading' && (
          <View
            style={{
              ...styles.loading,
              backgroundColor: '#6D597A',
              order: settings.companiesSectionTwo?.order,
              height: (windowHeight - 140) / 2,
            }}
          >
            <ActivityIndicator size="large" color={Colors.WHITE_COLOR} />
          </View>
        )}

        {settings.companiesSectionTwo?.show && companiesSectionTwo.length > 0 && (
          <SectionHomeScreen
            data={companiesSectionTwo}
            containerBackground="#6D597A"
            headerBackground="#5A4E63"
            header={settings.companiesSectionTwo?.title}
            description={settings.companiesSectionTwo?.description}
            order={settings.companiesSectionTwo?.order}
            type="company"
          />
        )}

        {settings.itemsSectionOne?.show && itemsSectionOneStatus === 'loading' && (
          <View
            style={{
              ...styles.loading,
              backgroundColor: '#3D5A80',
              order: settings.itemsSectionOne?.order,
              height: (windowHeight - 140) / 2,
            }}
          >
            <ActivityIndicator size="large" color={Colors.WHITE_COLOR} />
          </View>
        )}

        {settings.itemsSectionOne?.show && itemsSectionOne.length > 0 && (
          <SectionHomeScreen
            data={itemsSectionOne}
            containerBackground="#3D5A80"
            headerBackground="#374569"
            header={settings.itemsSectionOne?.title}
            description={settings.itemsSectionOne?.description}
            order={settings.itemsSectionOne?.order}
            type="item"
          />
        )}

        {settings.itemsSectionTwo?.show && itemsSectionTwoStatus === 'loading' && (
          <View
            style={{
              ...styles.loading,
              backgroundColor: '#E56B6F',
              order: settings.itemsSectionTwo?.order,
              height: (windowHeight - 140) / 2,
            }}
          >
            <ActivityIndicator size="large" color={Colors.WHITE_COLOR} />
          </View>
        )}

        {settings.itemsSectionTwo?.show && itemsSectionTwo.length > 0 && (
          <SectionHomeScreen
            data={itemsSectionTwo}
            containerBackground="#E56B6F"
            headerBackground="#B54A58"
            header={settings.itemsSectionTwo?.title}
            description={settings.itemsSectionTwo?.description}
            order={settings.itemsSectionTwo?.order}
            type="item"
          />
        )}

        {settings.itemsSectionThree?.show && itemsSectionThreeStatus === 'loading' && (
          <View
            style={{
              ...styles.loading,
              backgroundColor: '#ffe66d',
              order: settings.itemsSectionThree?.order,
              height: (windowHeight - 140) / 2,
            }}
          >
            <ActivityIndicator size="large" color={Colors.WHITE_COLOR} />
          </View>
        )}

        {settings.itemsSectionThree?.show && itemsSectionThree.length > 0 && (
          <SectionHomeScreen
            data={itemsSectionThree}
            containerBackground="#ffe66d"
            headerBackground="#baa437"
            header={settings.itemsSectionThree?.title}
            description={settings.itemsSectionThree?.description}
            order={settings.itemsSectionThree?.order}
            type="item"
          />
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  loading: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default HomeScreen;
