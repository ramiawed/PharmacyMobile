import React, { memo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';

// redux stuff
import { useDispatch, useSelector } from 'react-redux';
import { selectUserData } from '../redux/auth/authSlice';
import { addStatistics } from '../redux/statistics/statisticsSlice';

import ItemNames from '../components/ItemNames';

// constants
import { Colors, SERVER_URL, UserTypeConstants } from '../utils/constants';

const AdvItemsContainer = ({ item }) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const { user, token } = useSelector(selectUserData);

  const selectItem = (selectedItem) => {
    if (user.type === UserTypeConstants.PHARMACY || user.type === UserTypeConstants.GUEST) {
      dispatch(
        addStatistics({
          obj: {
            sourceUser: user._id,
            targetItem: selectedItem._id,
            action: 'choose-item',
          },
          token,
        }),
      );
    }

    navigation.navigate('ItemDetails', {
      medicineId: selectedItem._id,
    });
  };

  return (
    <TouchableOpacity style={styles.container} onPress={() => selectItem(item)}>
      <View style={styles.logoContainer}>
        {item.logo_url && item.logo_url.length !== 0 ? (
          <Image source={{ uri: `${SERVER_URL}/items/${item.logo_url}` }} style={{ ...styles.logo }} />
        ) : (
          <Image source={require('../../assets/logo.png')} style={{ ...styles.logo }} />
        )}
      </View>
      <View style={styles.infoContainer}>
        <View style={styles.smallLogo}>
          {item.company.logo_url && item.company.logo_url.length !== 0 ? (
            <Image source={require('../../assets/logo.png')} style={{ ...styles.logo }} />
          ) : (
            <Image source={{ uri: `${SERVER_URL}/items/${item.company.logo_url}` }} style={{ ...styles.logo }} />
          )}
        </View>
        <View>
          <ItemNames item={item} />
          <Text style={styles.company}>{item.company.name}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    // width: 250,
    borderRadius: 10,
    backgroundColor: Colors.WHITE_COLOR,
    overflow: 'hidden',
    margin: 5,
  },
  logoContainer: {
    width: 250,
    height: 250,
    maxWidth: 250,
    maxHeight: 250,
    alignSelf: 'center',
    margin: 10,
  },
  logo: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  infoContainer: {
    borderTopWidth: 1,
    borderTopColor: Colors.LIGHT_GREY_COLOR,
    flexDirection: 'row',
    padding: 10,
    alignItems: 'center',
  },
  smallLogo: {
    width: 64,
    height: 64,
    marginRight: 10,
  },
  name: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.DARK_COLOR,
  },
  company: {
    fontSize: 12,
    color: Colors.SUCCEEDED_COLOR,
  },
});

export default memo(AdvItemsContainer);
