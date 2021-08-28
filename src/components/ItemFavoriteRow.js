import React, { useEffect, useState } from 'react';

import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';

// libraries
import Toast from 'react-native-toast-message';

// redux stuff
import { selectToken } from '../redux/auth/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import { removeFavoriteItem } from '../redux/favorites/favoritesSlice';

// navigation stuff
import { useNavigation } from '@react-navigation/native';

// constants
import { Colors } from '../utils/constants';

// icons
import { AntDesign } from '@expo/vector-icons';

const ItemFavoriteRow = ({ favorite }) => {
  const navigation = useNavigation();
  const token = useSelector(selectToken);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  // method to handle remove company from user's favorite
  const removeItemFromFavorite = () => {
    // check the internet connection
    // if (!checkConnection()) {
    //   setConnectionError("no-internet-connection");
    //   return;
    // }

    setLoading(true);

    dispatch(removeFavoriteItem({ obj: { favoriteItemId: favorite._id }, token }));
  };

  const goToItemScreen = (id) => {
    console.log('go to item screen');
    Toast.show({
      text1: 'Hello',
      text2: 'This is some something',
      type: 'info',
      position: 'bottom',
      bottomOffset: 70,
    });
  };

  return (
    <View key={favorite._id} style={styles.row}>
      <Text style={styles.name} onPress={() => goToItemScreen(favorite._id)}>
        {favorite.name}
      </Text>
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
    fontWeight: '700',
    fontSize: 16,
    color: Colors.SECONDARY_COLOR,
    flex: 1,
    textAlign: 'left',
  },
});

export default ItemFavoriteRow;
