import i18n from '../i18n/index';
import React, { memo } from 'react';

import { View, Text, StyleSheet, Image, TouchableWithoutFeedback, Platform, Animated } from 'react-native';

import { baseUrl, Colors } from '../utils/constants';
import { useNavigation } from '@react-navigation/core';

const SPACING = 20;
const AVATAR_SIZE = 70;
const ITEM_SIZE = AVATAR_SIZE + SPACING * 3;

const ItemRow = ({ item }) => {
  const navigation = useNavigation();

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        navigation.navigate('Medicines', {
          screen: 'Medicine',
          params: {
            medicineId: item._id,
          },
        });
      }}
    >
      <View style={styles.container}>
        <View>
          <Text style={styles.title}>{item.name}</Text>
        </View>

        {/* <TouchableWithoutFeedback onPress={() => {}}>
          <View style={styles.favoriteIcon}>
            {changeFavoriteLoading ? (
              <ActivityIndicator size="small" color={Colors.YELLOW_COLOR} />
            ) : favorites && favorites.map((favorite) => favorite._id).includes(partner?._id) ? (
              <AntDesign
                name="star"
                size={24}
                color={Colors.YELLOW_COLOR}
                onPress={() => removeCompanyFromFavorite(partner._id)}
              />
            ) : (
              <AntDesign
                name="staro"
                size={24}
                color={Colors.YELLOW_COLOR}
                onPress={() => addCompanyToFavorite(partner._id)}
              />
            )}
          </View>
        </TouchableWithoutFeedback> */}
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    borderBottomWidth: 1,
    borderColor: 'rgba(0, 0, 0, .1)',
  },

  title: {
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
    color: Colors.SECONDARY_COLOR,
    textAlign: 'center',
  },
  favoriteIcon: {},
});

export default memo(ItemRow);
