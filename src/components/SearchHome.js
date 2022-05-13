import React, { useState } from 'react';
import i18n from '../i18n';
import axios from 'axios';
import { StyleSheet, View, ScrollView, Text, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native';

// constants
import { BASEURL, Colors, UserTypeConstants } from '../utils/constants';

// icons
import { AntDesign } from '@expo/vector-icons';

// redux stuff
import { useSelector } from 'react-redux';
import { selectUserData } from '../redux/auth/authSlice';

// components
import ItemFavoriteRow from './ItemFavoriteRow';
import PartnerRow from './PartnerRow';
import Scanner from './Scanner';
import ItemRow from './ItemRow';

let CancelToken = null;
let source = null;

const SearchHome = () => {
  const { token, user } = useSelector(selectUserData);

  const [showScanner, setShowScanner] = useState(false);
  const [searchName, setSearchName] = useState('');
  const [data, setData] = useState([]);
  const [companiesData, setCompaniesData] = useState([]);
  const [warehousesData, setWarehousesData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showResult, setShowResult] = useState(false);

  const searchHandler = async () => {
    if (searchName.trim().length === 0) {
      setData([]);
      setCompaniesData([]);
      setWarehousesData([]);
      setShowResult(false);
      return;
    }

    CancelToken = axios.CancelToken;
    source = CancelToken.source();

    setShowResult(true);
    setLoading(true);

    let buildUrl = `${BASEURL}`;
    let companiesBuildUrl = `${BASEURL}`;
    let warehousesBuildUrl = `${BASEURL}`;

    buildUrl = buildUrl + `/items?page=1&limit=25&isActive=true&itemName=${searchName}`;

    companiesBuildUrl =
      companiesBuildUrl + `/users?type=company&page=1&limit=25&isActive=true&isApproved=true&name=${searchName}`;

    let queryString = `/users?type=warehouse&page=1&limit=25&isActive=true&isApproved=true&name=${searchName}`;
    if (user.type === UserTypeConstants.PHARMACY) {
      queryString = queryString + `&city=${user.city}`;
    }
    warehousesBuildUrl = warehousesBuildUrl + queryString;

    try {
      const response = await axios.get(buildUrl, {
        cancelToken: source.token,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const companiesResponse = await axios.get(companiesBuildUrl, {
        cancelToken: source.token,
        headers: { Authorization: `Bearer ${token}` },
      });

      if (user.type === UserTypeConstants.PHARMACY || user.type === UserTypeConstants.ADMIN) {
        const warehousesResponse = await axios.get(warehousesBuildUrl, {
          cancelToken: source.token,
          headers: { Authorization: `Bearer ${token}` },
        });

        const {
          data: { data: warehousesResponseData, status: warehousesResponseStatus },
        } = warehousesResponse;

        if (warehousesResponseStatus === 'success') {
          setWarehousesData(warehousesResponseData.users);
        }
      }

      CancelToken = null;
      source = null;

      const {
        data: { data, status },
      } = response;

      const {
        data: { data: companiesResponseData, status: companiesResponseStatus },
      } = companiesResponse;

      if (status === 'success') {
        setData(data.items);
      }

      if (companiesResponseStatus === 'success') {
        setCompaniesData(companiesResponseData.users);
      }

      setLoading(false);
    } catch (err) {
      setData([]);
      setCompaniesData([]);
      setWarehousesData([]);
    }
  };

  const clearResultHandler = () => {
    if (source) {
      source.cancel('operation canceled by user');
    }
    setSearchName('');
    setShowResult(false);
  };

  const onTextChangeHandler = (val) => {
    if (source !== null) {
      source.cancel('cancel');
    }
    setSearchName(val);
    searchHandler();
  };

  const scannerDoneHandler = (val) => {
    setSearchName(val);
    setShowScanner(false);
    searchHandler();
  };

  return (
    <>
      <View style={styles.container}>
        <View style={Object.assign({}, styles.searchContainer, showResult ? styles.searchHasValue : {})}>
          <AntDesign name="search1" size={20} color={Colors.MAIN_COLOR} />
          <TextInput
            placeholder={i18n.t('search-home-placeholder')}
            value={searchName}
            onChangeText={(val) => {
              onTextChangeHandler(val);
            }}
            onSubmitEditing={() => searchHandler(searchName)}
            // onKeyPress={searchHandler}
            style={styles.searchTextInput}
          />
          {searchName.trim().length > 0 && (
            <TouchableOpacity>
              <AntDesign name="closecircleo" size={24} color={Colors.FAILED_COLOR} onPress={clearResultHandler} />
            </TouchableOpacity>
          )}
          <AntDesign
            name="barcode"
            size={32}
            color={Colors.MAIN_COLOR}
            onPress={() => setShowScanner(true)}
            style={{ marginStart: 10 }}
          />
        </View>
        {showResult ? (
          <View style={styles.searchResult}>
            {loading ? (
              <ActivityIndicator size="large" color={Colors.SECONDARY_COLOR} />
            ) : data.length > 0 || companiesData.length > 0 || warehousesData.length > 0 ? (
              <ScrollView>
                <>
                  {data.length > 0 && <Text style={styles.header}>{i18n.t('items')}</Text>}
                  {data.map((item, index) => (
                    <ItemRow key={index} item={item} />
                  ))}
                  {companiesData.length > 0 && <Text style={styles.header}>{i18n.t('companies')}</Text>}
                  {companiesData.map((company) => (
                    <PartnerRow key={company._id} partner={company} />
                  ))}
                  {warehousesData.length > 0 && <Text style={styles.header}>{i18n.t('warehouses')}</Text>}
                  {warehousesData.map((warehouse) => (
                    <PartnerRow key={warehouse._id} partner={warehouse} />
                  ))}
                </>
              </ScrollView>
            ) : (
              <Text style={styles.noContent}>{i18n.t('no-data-found')}</Text>
            )}
          </View>
        ) : (
          <></>
        )}
      </View>

      {showScanner && <Scanner onScannerDone={scannerDoneHandler} close={() => setShowScanner(false)} />}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingVertical: 10,
    width: '100%',
    backgroundColor: Colors.SECONDARY_COLOR,
  },
  alignStart: {
    justifyContent: 'flex-start',
  },
  alignCenter: {
    justifyContent: 'center',
  },

  searchContainer: {
    backgroundColor: Colors.WHITE_COLOR,
    alignSelf: 'stretch',
    marginHorizontal: 10,
    padding: 10,
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchHasValue: {
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    borderBottomWidth: 1,
    borderBottomColor: Colors.SECONDARY_COLOR,
  },
  searchBtn: {
    backgroundColor: Colors.FAILED_COLOR,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginHorizontal: 8,
    borderRadius: 6,
  },
  searchText: {
    color: Colors.WHITE_COLOR,
  },
  searchResult: {
    backgroundColor: Colors.WHITE_COLOR,
    maxHeight: 300,
    alignSelf: 'stretch',
    marginHorizontal: 10,
    borderBottomLeftRadius: 6,
    borderBottomRightRadius: 6,
  },
  noContent: {
    textAlign: 'center',
    color: Colors.FAILED_COLOR,
    paddingVertical: 10,
  },
  header: {
    color: Colors.WHITE_COLOR,
    backgroundColor: Colors.SUCCEEDED_COLOR,
    width: '50%',
    alignSelf: 'center',
    marginTop: 10,
    padding: 10,
    borderRadius: 6,
    textAlign: 'center',
  },
  searchTextInput: {
    flex: 1,
    color: Colors.MAIN_COLOR,
    fontSize: 12,
    paddingHorizontal: 10,
  },
});

export default SearchHome;
