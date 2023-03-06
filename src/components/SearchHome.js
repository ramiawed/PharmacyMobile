import React, { useCallback, useState } from 'react';
import i18n from '../i18n';
import axios from 'axios';
import { StyleSheet, View, ScrollView, TouchableOpacity, TextInput, ActivityIndicator, Text } from 'react-native';

// navigation stuff
import { useFocusEffect, useNavigation } from '@react-navigation/native';

// components
import Scanner from './Scanner';
import ItemRow from './ItemRow';

// constants
import { BASEURL, Colors } from '../utils/constants';

// icons
import { AntDesign } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';

// redux stuff
import { useSelector } from 'react-redux';
import { selectUserData } from '../redux/auth/authSlice';

let CancelToken = null;
let source = null;

const SearchHome = ({ showScanner, setShowScanner }) => {
  const navigator = useNavigation();
  const { token } = useSelector(selectUserData);

  // const [showScanner, setShowScanner] = useState(false);
  const [searchName, setSearchName] = useState('');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);

  const searchHandler = async (val, reset, currentPage) => {
    if (val.trim().length === 0) {
      setItems([]);
      setShowResult(false);
      return;
    }

    CancelToken = axios.CancelToken;
    source = CancelToken.source();

    setShowResult(true);
    setLoading(true);

    let buildUrl = `${BASEURL}`;

    buildUrl = buildUrl + `/items/filter?page=${currentPage}&limit=30&isActive=true&itemName=${val}`;

    try {
      const response = await axios.get(buildUrl, {
        cancelToken: source.token,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      CancelToken = null;
      source = null;

      const {
        data: { data, status, count },
      } = response;

      if (status === 'success') {
        if (reset) {
          setItems(data.items);
        } else setItems([...items, ...data.items]);
        setCount(count);
      }

      setLoading(false);
    } catch (err) {
      setItems([]);
    }
  };

  const clearResultHandler = () => {
    if (source) {
      source.cancel('operation canceled by user');
    }
    setSearchName('');
    setItems([]);
    setShowResult(false);
  };

  const onTextChangeHandler = (val) => {
    if (source !== null) {
      source.cancel('cancel');
    }
    setPage(1);
    setSearchName(val);
    if (val.trim().length >= 3) {
      searchHandler(val, true, 1);
    } else {
      setItems([]);
      setLoading(false);
      setShowResult(false);
    }
  };

  const scannerDoneHandler = (val) => {
    setSearchName(val);
    setShowScanner(false);
    searchHandler(val);
  };

  const moreDataHandler = () => {
    setPage(page + 1);
    searchHandler(searchName, false, page + 1);
  };

  useFocusEffect(
    useCallback(() => {
      // Do something when the screen is focused
      return () => {
        setSearchName('');
        setItems([]);
        setShowResult(false);
        setLoading(false);
      };
    }, []),
  );

  return (
    <TouchableOpacity onPress={() => navigator.navigate('Search')}>
      <View style={styles.container}>
        <View style={Object.assign({}, styles.searchContainer, showResult ? styles.searchHasValue : {})}>
          <AntDesign name="search1" size={20} color={Colors.MAIN_COLOR} />
          <TextInput
            placeholder={i18n.t('search-home-placeholder')}
            value={searchName}
            onChangeText={(val) => {
              onTextChangeHandler(val);
            }}
            style={styles.searchTextInput}
          />
          {searchName.trim().length > 0 && (
            <TouchableOpacity>
              <MaterialIcons name="clear" size={24} color={Colors.DARK_COLOR} onPress={clearResultHandler} />
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
        {searchName.length >= 3 ? (
          <View style={styles.searchResult}>
            <ScrollView>
              {items.map((item, index) => (
                <ItemRow key={index} item={item} searchString={searchName} />
              ))}
              {items.length < count && !loading && (
                <TouchableOpacity onPress={moreDataHandler} style={styles.moreBtn}>
                  <Text style={styles.moreText}>
                    {items.length} / {count}
                  </Text>
                </TouchableOpacity>
              )}
            </ScrollView>
            {loading && <ActivityIndicator size="large" color={Colors.LIGHT_COLOR} />}
          </View>
        ) : (
          <></>
        )}
      </View>

      {showScanner && <Scanner onScannerDone={scannerDoneHandler} close={() => setShowScanner(false)} />}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingVertical: 10,
    width: '100%',
    backgroundColor: Colors.LIGHT_COLOR,
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
    textAlign: 'right',
  },
  moreBtn: {
    backgroundColor: Colors.SUCCEEDED_COLOR,
    width: 100,
    padding: 10,
    margin: 5,
    alignSelf: 'center',
    borderRadius: 8,
  },
  moreText: {
    textAlign: 'center',
    color: Colors.WHITE_COLOR,
  },
});

export default SearchHome;
