import React, { useState } from 'react';
import { View, StyleSheet, Animated, RefreshControl } from 'react-native';
import i18n from '../i18n/index';

// redux stuff
import { unwrapResult } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';
import { selectUserData } from '../redux/auth/authSlice';
import {
  changeSearchName,
  getCompanies,
  selectCompanies,
  resetCompaniesArray,
  selectCompaniesPageState,
} from '../redux/company/companySlice';

// components
import PartnerCard from '../components/PartnerCard';
import SearchContainer from '../components/SearchContainer';
import NoContent from '../components/NoContent';
import SearchInput from '../components/SearchInput';
import LoadingData from '../components/LoadingData';
import PullDownToRefresh from '../components/PullDownToRefresh';

// constants
import { CitiesName } from '../utils/constants';
import ScreenWrapper from './ScreenWrapper';

const CompaniesScreen = () => {
  const dispatch = useDispatch();

  const { token } = useSelector(selectUserData);
  const { companies, status } = useSelector(selectCompanies);
  const { searchName, searchCity } = useSelector(selectCompaniesPageState);

  let filteredCompanies = companies.filter((company) => {
    if (searchName.trim().length > 0) {
      return company.name.includes(searchName.trim());
    }
    return true;
  });

  filteredCompanies = filteredCompanies.filter((company) => {
    if (searchCity !== CitiesName.ALL) {
      return company.city === searchCity;
    }
    return true;
  });

  const [refreshing, setRefreshing] = useState(false);

  // search handler
  const handleSearch = () => {
    dispatch(getCompanies({ token }))
      .then(unwrapResult)
      .then(() => {
        setRefreshing(false);
      });
  };

  const onSearchSubmit = () => {
    dispatch(resetCompaniesArray());
    handleSearch();
  };

  const onRefreshing = () => {
    setRefreshing(true);
    onSearchSubmit();
  };

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <SearchContainer>
          <SearchInput
            placeholder={i18n.t('search by company name')}
            onTextChange={(val) => {
              dispatch(changeSearchName(val));
            }}
            onSubmitEditing={onSearchSubmit}
            value={searchName}
          />
        </SearchContainer>

        {status !== 'loading' && <PullDownToRefresh />}

        {filteredCompanies?.length === 0 && status !== 'loading' && (
          <NoContent refreshing={refreshing} onRefreshing={onRefreshing} msg="no-companies" />
        )}

        {filteredCompanies?.length > 0 && (
          <Animated.FlatList
            data={filteredCompanies}
            keyExtractor={(item) => item._id}
            contentContainerStyle={{
              padding: 5,
            }}
            refreshControl={
              <RefreshControl
                //refresh control used for the Pull to Refresh
                refreshing={refreshing}
                onRefresh={onRefreshing}
              />
            }
            numColumns={2}
            // onEndReached={handleMoreResult}
            onEndReachedThreshold={0.1}
            renderItem={({ item }) => {
              return <PartnerCard partner={item} type="company" />;
            }}
          />
        )}

        {status === 'loading' && <LoadingData />}
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    width: '100%',
  },
});

export default CompaniesScreen;
