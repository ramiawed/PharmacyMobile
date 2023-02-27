import React, { memo, useEffect } from 'react';
import { FlatList, View, StyleSheet } from 'react-native';

// components
import HomeScreenAdvertisementCard from './PartnerAdvertisementCard';
import TitleAndDescription from './TitleAndDescription';
import LoadingData from './LoadingData';

// redux stuff
import { useDispatch, useSelector } from 'react-redux';
import { getCompaniesSectionOne, selectCompaniesSectionOne } from '../redux/advertisements/companiesSectionOneSlice';
import { selectUserData } from '../redux/auth/authSlice';
import { selectCompaniesSectionOneFromSettings } from '../redux/settings/settingsSlice';
import PartnerAdvertisementCard from './PartnerAdvertisementCard';

const CompaniesSectionOne = () => {
  const dispatch = useDispatch();

  const { token } = useSelector(selectUserData);
  const { show, title, description } = useSelector(selectCompaniesSectionOneFromSettings);
  const { companiesSectionOne, companiesSectionOneStatus } = useSelector(selectCompaniesSectionOne);

  useEffect(() => {
    if (show) {
      dispatch(getCompaniesSectionOne({ token }));
    }
  }, []);

  return show ? (
    companiesSectionOneStatus === 'loading' ? (
      <LoadingData />
    ) : companiesSectionOne.length > 0 ? (
      <View style={styles.container}>
        <TitleAndDescription title={title} desc={description} />
        <FlatList
          data={companiesSectionOne}
          keyExtractor={(item) => item._id}
          horizontal={true}
          renderItem={({ item }) => <PartnerAdvertisementCard data={item} />}
        />
      </View>
    ) : null
  ) : null;
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#6D597A',
    borderRadius: 6,
    marginVertical: 5,
    marginHorizontal: 10,
    paddingHorizontal: 5,
  },
});

export default memo(CompaniesSectionOne);
