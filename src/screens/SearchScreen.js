import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { View, StyleSheet, TouchableOpacity, Keyboard, FlatList, Text, RefreshControl } from 'react-native';
import Voice from '@react-native-voice/voice';
import i18n from '../i18n';
// libraries
import { BottomSheet } from 'react-native-btr';

// components
import PullDownToRefresh from '../components/PullDownToRefresh';
import SearchContainer from '../components/SearchContainer';
import SearchInput from '../components/SearchInput';
import LoadingData from '../components/LoadingData';
import Scanner from '../components/Scanner';
import ItemRow from '../components/ItemRow';
import ScreenWrapper from './ScreenWrapper';
import AddToCart from '../components/AddToCart';
import ItemCard from '../components/ItemCard';

// redux stuff
import { useSelector } from 'react-redux';
import { selectUserData } from '../redux/auth/authSlice';

// icons
import { AntDesign } from '@expo/vector-icons';

// constants
import { BASEURL, Colors } from '../utils/constants';
import NoContent from '../components/NoContent';

let CancelToken = null;
let source = null;

const SearchScreen = () => {
  const { token } = useSelector(selectUserData);

  // const inputRef = useRef();
  const [showAddToCartModal, setShowAddToCartModal] = useState(false);
  const [itemToAddToCart, setItemToAddToCart] = useState(null);
  const [searchName, setSearchName] = useState('');
  const [showScanner, setShowScanner] = useState(false);
  const [voiceStarted, setVoiceStarted] = useState(false);
  const [results, setResults] = useState([]);
  const [items, setItems] = useState();
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const searchHandler = async (val, reset, currentPage) => {
    if (val.trim().length === 0) {
      setItems([]);
      return;
    }

    CancelToken = axios.CancelToken;
    source = CancelToken.source();

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
        setRefreshing(false);
        setCount(count);
      }

      setLoading(false);
    } catch (err) {
      setItems([]);
    }
  };

  const onRefreshing = () => {
    setRefreshing(true);
    setPage(1);
    searchHandler(searchName, true, 1);
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
    }
  };

  const moreDataHandler = () => {
    if (!loading) {
      setPage(page + 1);
      searchHandler(searchName, false, page + 1);
    }
  };

  const scannerDoneHandler = (val) => {
    setSearchName(val);
    searchHandler(val, true, 1);
    setShowScanner(false);
  };

  const openScanner = () => {
    Keyboard.dismiss();
    setShowScanner(true);
  };

  const setTheItemToAddToCartHandler = (item) => {
    setItemToAddToCart(item);
    setShowAddToCartModal(true);
  };

  // useEffect(() => {
  //   inputRef.current.focus();
  // }, []);

  // const startSpeechToText = async () => {
  //   await Voice.start('ar-SY');
  //   setVoiceStarted(true);
  // };

  // const stopSpeechToText = async () => {
  //   await Voice.stop();
  //   setVoiceStarted(false);
  // };

  // const onSpeechError = (error) => {
  //   console.log(error);
  // };

  // const onSpeechResults = (result) => {
  //   setResults(result.value);
  //   setSearchName(result.value.join(' '));
  // };

  // useEffect(() => {
  //   Voice.onSpeechError = onSpeechError;
  //   Voice.onSpeechResults = onSpeechResults;

  //   return () => {
  //     Voice.destroy.then(Voice.removeAllListeners);
  //   };
  // }, []);

  return (
    <ScreenWrapper>
      <View style={styles.outerContainer}>
        <SearchContainer>
          <SearchInput
            placeholder={i18n.t('search home placeholder')}
            onTextChange={(val) => {
              onTextChangeHandler(val);
            }}
            value={searchName}
            // focus={true}
            // refrence={inputRef}
          />
        </SearchContainer>

        <View style={styles.actions}>
          <TouchableOpacity
            style={{
              ...styles.option,
            }}
            onPress={openScanner}
          >
            <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
              <Text style={{ color: Colors.WHITE_COLOR }}>{i18n.t('press to open camera')}</Text>
              <AntDesign name="barcode" size={28} color={Colors.WHITE_COLOR} onPress={openScanner} />
            </View>
          </TouchableOpacity>

          {/* <TouchableOpacity
            style={{
              ...styles.option,
            }}
            onPress={() => {}}
          >
            {!voiceStarted ? (
              <FontAwesome name="microphone" size={28} color={Colors.WHITE_COLOR} onPress={startSpeechToText} />
            ) : undefined}

            {voiceStarted ? (
              <FontAwesome name="microphone-slash" size={28} color={Colors.WHITE_COLOR} onPress={stopSpeechToText} />
            ) : undefined}
          </TouchableOpacity> */}
        </View>

        {searchName.length < 3 ? (
          <View style={styles.centerContainer}>
            <Text style={styles.text}>{i18n.t('type 3 characters to begin search')}</Text>
            <Text style={styles.text}>{i18n.t('press on barcode icon')}</Text>
            {/* <Text style={styles.text}>{i18n.t('press on microphone icon')}</Text> */}
          </View>
        ) : undefined}

        {searchName.length >= 3 && items?.length === 0 && !loading ? (
          <View style={styles.centerContainer}>
            <NoContent msg="search-empty" />
          </View>
        ) : undefined}

        {!loading && items?.length > 0 && <PullDownToRefresh />}
        {items?.length > 0 && (
          <FlatList
            data={items}
            keyExtractor={(item) => item._id}
            refreshControl={
              <RefreshControl
                //refresh control used for the Pull to Refresh
                refreshing={refreshing}
                onRefresh={onRefreshing}
              />
            }
            contentContainerStyle={{ padding: 5 }}
            numColumns={1}
            renderItem={({ item, index }) => (
              <ItemCard
                key={index}
                item={item}
                searchString={searchName}
                addToCart={() => {
                  setTheItemToAddToCartHandler(item);
                }}
              />
            )}
          />
        )}

        {loading && <LoadingData />}

        {items?.length !== 0 && items?.length < count && !loading ? (
          <TouchableOpacity onPress={moreDataHandler} style={styles.moreBtn}>
            <Text style={styles.moreText}>
              {items?.length} / {count}
            </Text>
          </TouchableOpacity>
        ) : undefined}

        {items?.length !== 0 && items?.length === count ? (
          <Text style={styles.text}>{i18n.t('no-more')}</Text>
        ) : undefined}

        <BottomSheet
          visible={showAddToCartModal}
          onBackButtonPress={() => setShowAddToCartModal(false)}
          onBackdropPress={() => setShowAddToCartModal(false)}
        >
          <AddToCart item={itemToAddToCart} close={() => setShowAddToCartModal(false)} />
        </BottomSheet>

        {showScanner && <Scanner onScannerDone={scannerDoneHandler} close={() => setShowScanner(false)} />}
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: '#fff',
    width: '100%',
  },
  container: {
    flex: 1,
    backgroundColor: Colors.BLUE_COLOR,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    width: '100%',
    backgroundColor: Colors.LIGHT_COLOR,
    padding: 10,
  },
  searchTextInput: {
    flex: 1,
    color: Colors.MAIN_COLOR,
    fontSize: 14,
    paddingHorizontal: 10,
    textAlign: 'right',
    backgroundColor: Colors.WHITE_COLOR,
    padding: 5,
    borderRadius: 6,
  },
  scannerBtn: {
    backgroundColor: Colors.MAIN_COLOR,
    width: 200,
    height: 150,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 20,
    borderRadius: 15,
    alignSelf: 'center',
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
  actions: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  option: {
    flex: 1,
    paddingVertical: 10,
    backgroundColor: Colors.DARK_COLOR,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionText: {
    color: Colors.WHITE_COLOR,
    textAlign: 'center',
  },
  centerContainer: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  text: {
    color: Colors.MAIN_COLOR,
    fontWeight: 'bold',
    fontSize: 18,
    marginVertical: 5,
    textAlign: 'center',
  },
});

export default SearchScreen;
