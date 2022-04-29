import React, { useState } from 'react';

import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, ScrollView } from 'react-native';

// libraries
import { BottomSheet } from 'react-native-btr';

// components
import AddToCart from './AddToCart';

// redux stuff
import { selectUserData } from '../redux/auth/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import { removeFavoriteItem } from '../redux/favorites/favoritesSlice';

// navigation stuff
import { useNavigation } from '@react-navigation/native';

// constants
import { checkItemExistsInWarehouse, Colors, UserTypeConstants } from '../utils/constants';

// icons
import { AntDesign, Ionicons } from '@expo/vector-icons';

const ItemFavoriteRow = ({ favorite }) => {
  const navigation = useNavigation();
  const { token, user } = useSelector(selectUserData);
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);
  const [showAddToCartModal, setShowAddToCartModal] = useState(false);
  const canAddToCart = user.type === UserTypeConstants.PHARMACY && checkItemExistsInWarehouse(favorite, user);

  // method to handle remove company from user's favorite
  const removeItemFromFavorite = () => {
    setLoading(true);

    dispatch(removeFavoriteItem({ obj: { favoriteItemId: favorite._id }, token }));
  };

  const goToItemScreen = (id) => {
    navigation.navigate('Medicines', {
      screen: 'Medicine',
      params: {
        medicineId: id,
      },
    });
  };

  return (
    <>
      <View key={favorite._id} style={styles.row}>
        <Text style={styles.name} onPress={() => goToItemScreen(favorite._id)}>
          {favorite.name}
        </Text>
        {canAddToCart && (
          <Ionicons
            name="cart"
            size={24}
            color={Colors.SUCCEEDED_COLOR}
            style={{ paddingHorizontal: 2 }}
            onPress={() => setShowAddToCartModal(true)}
          />
        )}
        {loading ? (
          <ActivityIndicator size="small" color={Colors.YELLOW_COLOR} />
        ) : (
          <AntDesign
            name="star"
            size={24}
            color={Colors.YELLOW_COLOR}
            onPress={() => removeItemFromFavorite(favorite._id)}
          />
        )}
      </View>

      <BottomSheet
        visible={showAddToCartModal}
        onBackButtonPress={() => setShowAddToCartModal(false)}
        onBackdropPress={() => setShowAddToCartModal(false)}
      >
        <AddToCart item={favorite} close={() => setShowAddToCartModal(false)} />
      </BottomSheet>
    </>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    writingDirection: 'rtl',
    padding: 10,
    borderBottomWidth: 1,
    borderColor: 'rgba(0, 0, 0, .1)',
  },
  name: {
    fontSize: 12,
    color: Colors.MAIN_COLOR,
    flex: 1,
    textAlign: 'left',
  },
});

export default ItemFavoriteRow;
