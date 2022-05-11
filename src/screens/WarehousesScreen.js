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
  changeSearchCity,
  changeSearchName,
  getWarehouses,
  resetWarehousesArray,
  selectWarehouses,
  selectWarehousesPageState,
} from '../redux/warehouse/warehousesSlice';

// components
import PartnerCard from '../components/PartnerCard';
import SearchContainer from '../components/SearchContainer';

// constatns
import { Colors, UserTypeConstants } from '../utils/constants';

const SPACING = 20;

let timer;

const WarehousesScreen = ({ navigation }) => {
  const scrollY = React.useRef(new Animated.Value(0)).current;

  const dispatch = useDispatch();

  const { token, user } = useSelector(selectUserData);
  const { warehouses, status, count } = useSelector(selectWarehouses);

  const [refreshing, setRefreshing] = useState(false);

  // search handler
  const handleSearch = () => {
    if (
      user.type === UserTypeConstants.PHARMACY ||
      user.type === UserTypeConstants.GUEST ||
      user.type === UserTypeConstants.WAREHOUSE
    ) {
      dispatch(changeSearchCity(user.city));
    }

    dispatch(getWarehouses({ token }))
      .then(unwrapResult)
      .then(() => {
        setRefreshing(false);
      });
  };

  const onSearchSubmit = () => {
    dispatch(resetWarehousesArray());
    handleSearch();
  };

  const onRefreshing = () => {
    setRefreshing(true);
    onSearchSubmit();
  };

  const handleMoreResult = () => {
    if (warehouses.length < count && status !== 'loading') handleSearch();
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
          style={styles.searchWarehousesName}
          placeholder={i18n.t('search-by-company-name')}
          onChangeText={(val) => {
            dispatch(changeSearchName(val));
          }}
          onSubmitEditing={onSearchSubmit}
          onKeyPress={keyUpHandler}
        />
      </SearchContainer>

      {warehouses?.length === 0 && status !== 'loading' && (
        <View>
          <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefreshing} />}>
            <View style={styles.noContentContainer}>
              <Image source={require('../../assets/no-content.jpeg')} style={styles.noContentImage} />
              <Text style={styles.noContent}>{i18n.t('no-warehouses')}</Text>
            </View>
          </ScrollView>
        </View>
      )}

      {warehouses?.length > 0 && (
        <Animated.FlatList
          data={warehouses}
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
            return <PartnerCard partner={item} type="warehouse" />;
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
  searchWarehousesName: {
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

export default WarehousesScreen;
