import i18n from '../i18n/index';

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, Platform, Animated, RefreshControl, ActivityIndicator } from 'react-native';

// redux stuff
import { unwrapResult } from '@reduxjs/toolkit';
import {
  getCompanyItems,
  resetCompanyItems,
  selectCompanyItems,
  setSelectedCompany,
  resetSelectedCompany,
  setSelectedPage,
  resetSelectedPage,
  setSearchName,
} from '../redux/companyItems/companyItemsSlices';
import { useDispatch, useSelector } from 'react-redux';
import { selectToken } from '../redux/auth/authSlice';

// components
import SearchBar from '../components/SearchBar';
import ItemCard from '../components/ItemCard';

// constants
import { Colors } from '../utils/constants';

const SPACING = 20;
const AVATAR_SIZE = 70;
const ITEM_SIZE = AVATAR_SIZE + SPACING * 3;

const ItemsScreen = ({ route, navigation }) => {
  const { companyId } = route.params;
  const scrollY = React.useRef(new Animated.Value(0)).current;

  const dispatch = useDispatch();

  const token = useSelector(selectToken);
  const { companyItems, status, count, error, selectedCompany, selectedPage, searchName } =
    useSelector(selectCompanyItems);

  // const [searchName, setSearchName] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  // const [page, setPage] = useState(selectedPage);

  // search handler
  const handleSearch = (p) => {
    console.log(p);
    const queryString = {};

    queryString.companyId = companyId;
    queryString.page = p;

    if (searchName.trim().length > 0) {
      queryString.name = searchName;
    }

    if (status !== 'loading') {
      dispatch(getCompanyItems({ queryString, token }))
        .then(unwrapResult)
        .then(() => {
          setRefreshing(false);
          dispatch(setSelectedPage(p + 1));
        });
    }
  };

  const onRefreshing = () => {
    setRefreshing(true);
    dispatch(resetCompanyItems());
    handleSearch(1);
  };

  const handleMoreResult = () => {
    if (handleMoreResult) {
      if (companyItems.length < count) handleSearch(selectedPage);
    }
  };

  useEffect(() => {
    if (selectedCompany === null || selectedCompany !== companyId) {
      dispatch(resetCompanyItems());
      handleSearch(1);
    }

    dispatch(setSelectedCompany(companyId));
  }, [companyId]);

  return (
    <View style={styles.container}>
      {/* <Image source={require('../../assets/applogo.png')} style={StyleSheet.absoluteFillObject} blurRadius={10} /> */}
      <SearchBar
        value={searchName}
        textChangedHandler={(text) => dispatch(setSearchName(text))}
        clearText={() => {
          setSearchName('');
        }}
        onSubmit={() => {
          dispatch(resetCompanyItems());
          handleSearch(1);
        }}
        placeholder="search-by-item-name"
      />

      {companyItems?.length === 0 && status !== 'loading' && searchName !== '' && (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={styles.noContent}>{i18n.t('no-items-found')}</Text>
        </View>
      )}

      {companyItems?.length === 0 && status !== 'loading' && searchName === '' && (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={styles.noContent}>{i18n.t('no-items')}</Text>
        </View>
      )}

      {companyItems?.length > 0 && (
        <Animated.FlatList
          data={companyItems}
          onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: true })}
          keyExtractor={(item) => item._id}
          contentContainerStyle={{
            padding: SPACING,
            // paddingTop: StatusBar.currentHeight || 42,
          }}
          refreshControl={
            <RefreshControl
              //refresh control used for the Pull to Refresh
              refreshing={refreshing}
              onRefresh={onRefreshing}
            />
          }
          onEndReached={handleMoreResult}
          onEndReachedThreshold={0.1}
          renderItem={({ item, index }) => {
            return <ItemCard item={item} index={index} />;
          }}
        />
      )}

      {status === 'loading' && (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator size="large" color={Colors.SECONDARY_COLOR} />
          <Text
            style={{
              fontSize: 18,
              fontWeight: '700',
              color: Colors.SECONDARY_COLOR,
              marginTop: 20,
            }}
          >
            {i18n.t('loading')}
          </Text>
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
  animatedView: {
    flexDirection: 'row',
    padding: SPACING,
    marginBottom: SPACING,
    backgroundColor: 'rgba(255,255,255, 1)',
    borderRadius: 12,
    shadowColor: Colors.SECONDARY_COLOR,
    shadowOffset: {
      width: 0,
      height: 7,
    },
    shadowOpacity: 0.43,
    shadowRadius: 9.51,

    elevation: 25,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: Colors.SECONDARY_COLOR,
    backgroundColor: Colors.MAIN_COLOR,
    borderRadius: 6,
    margin: SPACING,
    marginBottom: 10,
    marginTop: Platform.OS === 'ios' ? SPACING * 2 : SPACING,
    padding: Platform.OS === 'ios' ? 10 : 5,
    writingDirection: 'rtl',
  },
  itemInfoContainer: {
    alignItems: 'flex-start',
    paddingHorizontal: 15,
  },
  formula: {
    color: Colors.FAILED_COLOR,
    fontWeight: '500',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  priceLabel: {
    fontSize: 12,
    opacity: 0.6,
    color: Colors.SECONDARY_COLOR,
    writingDirection: 'rtl',
  },
  priceValue: {
    fontSize: 12,
    opacity: 1,
    color: Colors.SUCCEEDED_COLOR,
    paddingHorizontal: 6,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.MAIN_COLOR,
  },
  company: {
    fontSize: 18,
    opacity: 0.7,
  },
  noContent: {
    fontSize: 18,
    fontWeight: '500',
  },
});

export default ItemsScreen;
