import React, { memo, useEffect } from 'react';
import { FlatList, View, StyleSheet } from 'react-native';

// components
import PartnerAdvertisementCard from './PartnerAdvertisementCard';
import TitleAndDescription from './TitleAndDescription';
import LoadingData from './LoadingData';

// redux stuff
import { useDispatch, useSelector } from 'react-redux';
import { getCompaniesSectionTwo, selectCompaniesSectionTwo } from '../redux/advertisements/companiesSectionTwoSlice';
import { selectUserData } from '../redux/auth/authSlice';
import { selectCompaniesSectionTwoFromSettings } from '../redux/settings/settingsSlice';

const CompaniesSectionTwo = () => {
  const dispatch = useDispatch();

  const { token } = useSelector(selectUserData);
  const { show, title, description } = useSelector(selectCompaniesSectionTwoFromSettings);
  const { companiesSectionTwo, companiesSectionTwoStatus } = useSelector(selectCompaniesSectionTwo);

  useEffect(() => {
    if (show) {
      dispatch(getCompaniesSectionTwo({ token }));
    }
  }, []);

  return show ? (
    companiesSectionTwoStatus === 'loading' ? (
      <LoadingData />
    ) : companiesSectionTwo.length > 0 ? (
      <View style={styles.container}>
        <TitleAndDescription title={title} desc={description} />

        <FlatList
          data={companiesSectionTwo}
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
    // backgroundColor: '#915F78',
    borderRadius: 6,
    marginVertical: 5,
    marginHorizontal: 10,
    paddingHorizontal: 5,
  },
});

export default memo(CompaniesSectionTwo);
