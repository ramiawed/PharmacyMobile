import i18n from '../i18n/index';
import React, { memo } from 'react';

import { View, Text, StyleSheet, Image, TouchableWithoutFeedback, Platform, Animated } from 'react-native';

import { baseUrl, Colors } from '../utils/constants';

const SPACING = 20;
const AVATAR_SIZE = 70;
const ITEM_SIZE = AVATAR_SIZE + SPACING * 3;

const ItemCard = ({ item, index, navigation }) => {
  const scrollY = React.useRef(new Animated.Value(0)).current;

  const inputRange = [-1, 0, ITEM_SIZE * index, ITEM_SIZE * (index + 20)];

  const opacityInputRange = [-1, 0, ITEM_SIZE * index, ITEM_SIZE * (index + 20)];

  const scale = scrollY.interpolate({
    inputRange,
    outputRange: [1, 1, 1, 0],
  });

  const opacity = scrollY.interpolate({
    inputRange: opacityInputRange,
    outputRange: [1, 1, 1, 0],
  });

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
      <Animated.View
        style={{
          ...styles.animatedView,
          opacity,
          transform: [{ scale }],
        }}
      >
        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
          {item.logo_url && item.logo_url.length !== 0 ? (
            <Image
              source={{ uri: `${baseUrl}/${item.logo_url}` }}
              style={{ width: AVATAR_SIZE, height: AVATAR_SIZE, borderRadius: AVATAR_SIZE }}
            />
          ) : (
            <Image
              source={{ uri: `${baseUrl}/Adacard 201627116290082.png` }}
              style={{ width: AVATAR_SIZE, height: AVATAR_SIZE, borderRadius: AVATAR_SIZE }}
            />
          )}
        </View>

        <View style={styles.itemInfoContainer}>
          <Text style={styles.title}>{item.name}</Text>
          <Text style={styles.company}>{item.company.name}</Text>
          <Text style={styles.formula}>{item.formula}</Text>
          <View style={styles.priceContainer}>
            <Text style={styles.priceLabel}>{i18n.t('item-price')}</Text>
            <Text style={styles.priceValue}>{item.price}</Text>
            <Text style={styles.priceLabel}>{i18n.t('item-customer-price')}</Text>
            <Text style={styles.priceValue}>{item.customer_price}</Text>
          </View>
          <View style={styles.priceContainer}>
            <Text style={styles.priceLabel}>{i18n.t('item-caliber')}</Text>
            <Text style={styles.priceValue}>{item.caliber}</Text>
            <Text style={styles.priceLabel}>{i18n.t('item-packing')}</Text>
            <Text style={styles.priceValue}>{item.packing}</Text>
          </View>
        </View>
      </Animated.View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  animatedView: {
    flexDirection: 'row',
    padding: SPACING,
    marginBottom: SPACING,
    backgroundColor: 'rgba(255,255,255, 1)',
    borderRadius: 12,
    shadowColor: Colors.SECONDARY_COLOR,
    shadowOffset: {
      width: 0,
      height: 7,
    },
    shadowOpacity: 0.43,
    shadowRadius: 9.51,

    elevation: 25,
  },
  itemInfoContainer: {
    alignItems: 'flex-start',
    paddingHorizontal: 15,
  },
  formula: {
    color: Colors.FAILED_COLOR,
    fontWeight: '500',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  priceLabel: {
    fontSize: 12,
    opacity: 0.6,
    color: Colors.SECONDARY_COLOR,
    writingDirection: 'rtl',
  },
  priceValue: {
    fontSize: 12,
    opacity: 1,
    color: Colors.SUCCEEDED_COLOR,
    paddingHorizontal: 6,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.MAIN_COLOR,
  },
  company: {
    fontSize: 18,
    opacity: 0.7,
  },
});

export default memo(ItemCard);
