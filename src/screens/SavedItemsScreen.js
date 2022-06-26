import React, { useCallback, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { View, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { BottomSheet } from 'react-native-btr';

// redux stuff
import { useDispatch, useSelector } from 'react-redux';
import { selectUserData } from '../redux/auth/authSlice';
import { cancelOperation, getSavedItems, resetSavedItems, selectSavedItems } from '../redux/savedItems/savedItemsSlice';

// components
import LoadingData from '../components/LoadingData';
import NoContent from '../components/NoContent';
import ItemCard from '../components/ItemCard';
import AddToCart from '../components/AddToCart';

// constants
import { Colors } from '../utils/constants';

const SavedItemsScreen = ({ navigation }) => {
  const dispatch = useDispatch();

  const { token, user } = useSelector(selectUserData);
  const { status, savedItems, count } = useSelector(selectSavedItems);
  const [refreshing, setRefreshing] = useState(false);
  const [showAddToCartModal, setShowAddToCartModal] = useState(false);
  const [itemToAddToCart, setItemToAddToCart] = useState(null);

  const handleSearch = () => {
    dispatch(getSavedItems({ token }));
    setRefreshing(false);
  };

  const handleMoreResult = () => {
    if (savedItems.length < count && status !== 'loading') {
      handleSearch();
    }
  };

  const onRefreshing = () => {
    setRefreshing(true);
    dispatch(resetSavedItems());
    handleSearch();
  };

  const setTheItemToAddToCartHandler = (item) => {
    setItemToAddToCart(item);
    setShowAddToCartModal(true);
  };

  useFocusEffect(
    useCallback(() => {
      // Do something when the screen is focused
      if (savedItems?.length === 0) handleSearch();
      return () => {
        cancelOperation();
      };
    }, []),
  );

  return user ? (
    <View style={styles.container}>
      {savedItems?.length === 0 && status !== 'loading' && (
        <NoContent refreshing={refreshing} onRefreshing={onRefreshing} msg="no-saved-items" />
      )}

      {savedItems?.length > 0 && (
        <FlatList
          data={savedItems}
          keyExtractor={(item) => item._id}
          contentContainerStyle={{
            padding: 10,
          }}
          refreshControl={
            <RefreshControl
              //refresh control used for the Pull to Refresh
              refreshing={refreshing}
              onRefresh={onRefreshing}
            />
          }
          numColumns={1}
          renderItem={({ item, index }) => {
            return (
              <ItemCard
                item={item}
                index={index}
                navigation={navigation}
                addToCart={() => {
                  setTheItemToAddToCartHandler(item);
                }}
              />
            );
          }}
        />
      )}

      {status === 'loading' && savedItems.length === 0 && <LoadingData />}

      <BottomSheet
        visible={showAddToCartModal}
        onBackButtonPress={() => setShowAddToCartModal(false)}
        onBackdropPress={() => setShowAddToCartModal(false)}
      >
        <AddToCart item={itemToAddToCart} close={() => setShowAddToCartModal(false)} fromSavedItems={true} />
      </BottomSheet>
    </View>
  ) : null;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.WHITE_COLOR,
  },
});

export default SavedItemsScreen;
