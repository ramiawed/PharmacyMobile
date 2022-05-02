import React, { useEffect, useState } from 'react';
import i18n from '../i18n';
import axios from 'axios';

import { StyleSheet, View, Dimensions, Text, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native';

// constants
import { BASEURL, Colors } from '../utils/constants';

// icons
import { AntDesign } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';

// redux stuff
import { useSelector } from 'react-redux';
import { selectToken } from '../redux/auth/authSlice';
import { ScrollView } from 'react-native-gesture-handler';
import PartnerRow from './PartnerRow';
import ItemRow from './ItemRow';

let CancelToken;
let source;

const SearchHome = () => {
  const token = useSelector(selectToken);
  const windowHeight = Dimensions.get('window').height;
  const [searchName, setSearchName] = useState('');
  const [option, setOption] = useState('medicines');

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showResult, setShowResult] = useState(false);

  const searchHandler = async () => {
    if (searchName.trim().length === 0) {
      return;
    }

    CancelToken = axios.CancelToken;
    source = CancelToken.source;

    setShowResult(true);
    setLoading(true);

    let buildUrl = `${BASEURL}`;

    if (option === 'medicines') {
      buildUrl = buildUrl + `/api/v1/items?page=1&limit=25&isActive=true&itemName=${searchName}`;
    }

    if (option === 'companies') {
      buildUrl = buildUrl + `/api/v1/users?type=company&page=1&limit=25&isActive=true&name=${searchName}`;
    }

    if (option === 'warehouses') {
      buildUrl = buildUrl + `/api/v1/users?type=warehouse&page=1&limit=25&isActive=true&name=${searchName}`;
    }

    try {
      const response = await axios.get(buildUrl, {
        timeout: 10000,
        cancelToken: source.token,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      CancelToken = null;
      source = null;

      const {
        data: { data, status },
      } = response;

      if (status === 'success') {
        if (option === 'medicines') {
          setData(data.items);
        } else {
          setData(data.users);
        }
      }

      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  };

  const changeOptionHandler = (opt) => {
    if (!loading) {
      setData([]);
      setOption(opt);
    }
  };

  const clearResultHandler = () => {
    if (source) {
      source().cancel('operation canceled by user');
    }

    setSearchName('');

    setShowResult(false);
  };

  useEffect(() => {
    if (searchName.length > 0) {
      if (source) {
        source().cancel('operation canceled by user');
      }

      searchHandler();
    }

    return () => {
      if (source) {
        source().cancel('operation canceled by user');
      }
    };
  }, [option]);

  return (
    <View
      style={{
        ...styles.container,
        justifyContent: showResult ? 'flex-start' : 'center',
        height: (windowHeight - 140) / 2,
      }}
    >
      {/*  */}

      <View style={styles.options}>
        <View>
          <TouchableOpacity
            onPress={() => changeOptionHandler('medicines')}
            style={Object.assign({}, styles.option, option === 'medicines' ? styles.optionSelected : {})}
          >
            <Text style={styles.optionText}>{i18n.t('medicines-screen')}</Text>
          </TouchableOpacity>
        </View>

        <View>
          <TouchableOpacity
            onPress={() => changeOptionHandler('companies')}
            style={Object.assign({}, styles.option, option === 'companies' ? styles.optionSelected : {})}
          >
            <Text style={styles.optionText}>{i18n.t('companies-screen')}</Text>
          </TouchableOpacity>
        </View>

        <View>
          <TouchableOpacity
            onPress={() => changeOptionHandler('warehouses')}
            style={Object.assign({}, styles.option, option === 'warehouses' ? styles.optionSelected : {})}
          >
            <Text style={styles.optionText}>{i18n.t('warehouses-screen')}</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={Object.assign({}, styles.searchContainer, showResult ? styles.searchHasValue : {})}>
        <TextInput
          placeholder={
            option === 'medicines'
              ? i18n.t('search-by-medicine-name')
              : option === 'companies'
              ? i18n.t('search-by-company-name')
              : i18n.t('search-by-warehouse-name')
          }
          value={searchName}
          onChangeText={setSearchName}
          onSubmitEditing={searchHandler}
          style={{
            flex: 1,
          }}
        />
        <TouchableOpacity style={styles.searchBtn} onPress={searchHandler}>
          <Text style={styles.searchText}>{i18n.t('search')}</Text>
        </TouchableOpacity>
        {showResult && (
          <TouchableOpacity>
            <AntDesign name="closecircleo" size={24} color={Colors.FAILED_COLOR} onPress={clearResultHandler} />
          </TouchableOpacity>
        )}
      </View>
      {showResult ? (
        <View style={styles.searchResult}>
          {loading ? (
            <ActivityIndicator size="large" color={Colors.SECONDARY_COLOR} />
          ) : data.length > 0 ? (
            <ScrollView>
              {option === 'medicines'
                ? data.map((d, index) => <ItemRow key={index} item={d} />)
                : data.map((d, index) => (
                    <PartnerRow key={index} partner={d} type={option === 'companies' ? 'company' : 'warehouse'} />
                  ))}
            </ScrollView>
          ) : (
            <Text style={styles.noContent}>{i18n.t('no-data-found')}</Text>
          )}
        </View>
      ) : (
        <></>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 10,
  },
  alignStart: {
    justifyContent: 'flex-start',
  },
  alignCenter: {
    justifyContent: 'center',
  },

  options: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  option: {
    backgroundColor: '#22A5E7',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 6,
    marginHorizontal: 5,
  },
  optionSelected: {
    backgroundColor: Colors.FAILED_COLOR,
  },
  optionText: {
    color: '#fff',
    fontSize: 16,
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
    maxHeight: 150,
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
});

export default SearchHome;
