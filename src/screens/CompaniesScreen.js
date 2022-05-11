import i18n from '../i18n/index';

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Animated,
  RefreshControl,
  ActivityIndicator,
  TextInput,
  Image,
} from 'react-native';

// redux stuff
import { unwrapResult } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';
import { selectUserData } from '../redux/auth/authSlice';
import {
  cancelOperation,
  changeSearchName,
  getCompanies,
  selectCompanies,
  resetCompaniesArray,
} from '../redux/company/companySlice';

// components
import PartnerCard from '../components/PartnerCard';
import SearchContainer from '../components/SearchContainer';

// constants
import { Colors } from '../utils/constants';

const SPACING = 20;

let timer;

const CompaniesScreen = ({ navigation }) => {
  const scrollY = React.useRef(new Animated.Value(0)).current;

  const dispatch = useDispatch();

  const { token } = useSelector(selectUserData);
  const { companies, status, count } = useSelector(selectCompanies);

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

  const handleMoreResult = () => {
    if (companies.length < count && status !== 'loading') handleSearch();
  };

  const keyUpHandler = (event) => {
    if (event.keyCode === 13) return;
    cancelOperation();

    if (timer) {
      clearTimeout(timer);
    }

    timer = setTimeout(() => {
      onSearchSubmit();
    }, 500);
  };

  useEffect(() => {
    handleSearch();

    const unsubscribe = navigation.addListener('blur', () => {
      if (refreshing && status === 'loading') {
        cancelOperation();
      }
    });

    return unsubscribe;
  }, []);

  return (
    <View style={styles.container}>
      <SearchContainer>
        <TextInput
          style={styles.searchCompaniesName}
          placeholder={i18n.t('search-by-company-name')}
          onChangeText={(val) => {
            dispatch(changeSearchName(val));
          }}
          onSubmitEditing={onSearchSubmit}
          onKeyPress={keyUpHandler}
        />
      </SearchContainer>

      {companies?.length === 0 && status !== 'loading' && (
        <View
          style={{
            height: '100%',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefreshing} />}>
            <View style={styles.noContentContainer}>
              <Image source={require('../../assets/no-content.jpeg')} style={styles.noContentImage} />
              <Text style={styles.noContent}>{i18n.t('no-companies')}</Text>
            </View>
          </ScrollView>
        </View>
      )}

      {companies?.length > 0 && (
        <Animated.FlatList
          data={companies}
          onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: true })}
          keyExtractor={(item) => item._id}
          contentContainerStyle={{
            padding: SPACING,
          }}
          refreshControl={
            <RefreshControl
              //refresh control used for the Pull to Refresh
              refreshing={refreshing}
              onRefresh={onRefreshing}
            />
          }
          numColumns={2}
          onEndReached={handleMoreResult}
          onEndReachedThreshold={0.1}
          renderItem={({ item }) => {
            return <PartnerCard partner={item} type="company" />;
          }}
        />
      )}

      {status === 'loading' && (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator size="large" color={Colors.SECONDARY_COLOR} />
          <Text style={styles.loadingText}>{i18n.t('loading-data')}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  searchCompaniesName: {
    backgroundColor: Colors.WHITE_COLOR,
    borderRadius: 6,
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  noContentContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noContent: {
    paddingTop: 25,
    fontSize: 18,
    fontWeight: '500',
    color: Colors.SECONDARY_COLOR,
  },
  noContentImage: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
  },
  loadingText: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.SECONDARY_COLOR,
    marginTop: 20,
  },
});

export default CompaniesScreen;
