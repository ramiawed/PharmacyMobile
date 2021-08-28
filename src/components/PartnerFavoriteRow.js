import React, { useEffect, useState } from 'react';

import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';

// redux stuff
import { selectToken } from '../redux/auth/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import { removeFavorite } from '../redux/favorites/favoritesSlice';

// navigation stuff
import { useNavigation } from '@react-navigation/native';

// constants
import { Colors } from '../utils/constants';

// icons
import { AntDesign } from '@expo/vector-icons';
import { setSelectedCompany } from '../redux/companyItems/companyItemsSlices';

const PartnerFavoriteRow = ({ type, favorite }) => {
  const navigation = useNavigation();
  const token = useSelector(selectToken);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  // method to handle remove company from user's favorite
  const removeCompanyFromFavorite = (id) => {
    // check the internet connection
    // if (!checkConnection()) {
    //   setConnectionError("no-internet-connection");
    //   return;
    // }

    if (type === 'company' || type === 'warehouse') {
      setLoading(true);
      dispatch(removeFavorite({ obj: { favoriteId: id }, token }));
    }
  };

  const goToCompanyItems = (id) => {
    if (type === 'company') {
      // dispatch(setSelectedCompany(id));
      navigation.navigate('Medicines', {
        screen: 'Items',
        params: {
          companyId: id,
        },
      });
    }
  };

  return (
    <View key={favorite._id} style={styles.row}>
      <Text style={styles.name} onPress={() => goToCompanyItems(favorite._id)}>
        {favorite.name}
      </Text>
      {loading ? (
        <ActivityIndicator size="small" color={Colors.YELLOW_COLOR} />
      ) : (
        <AntDesign
          name="star"
          size={24}
          color={Colors.YELLOW_COLOR}
          onPress={() => removeCompanyFromFavorite(favorite._id)}
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

export default PartnerFavoriteRow;
