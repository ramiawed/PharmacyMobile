import React, { memo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../utils/constants';

const ItemPrices = ({ showPrice, price, customerPrice, showCustomerPrice }) => {
  return (
    <View style={styles.container}>
      {showPrice && <Text style={{ ...styles.price, ...styles.text }}>{price}</Text>}
      {showCustomerPrice && <Text style={{ ...styles.customerPrice, ...styles.text }}>{customerPrice}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderRadius: 6,
    overflow: 'hidden',
  },
  text: {
    color: Colors.WHITE_COLOR,
    paddingHorizontal: 5,
    fontWeight: 'bold',
  },
  price: { backgroundColor: Colors.SUCCEEDED_COLOR },
  customerPrice: { backgroundColor: Colors.FAILED_COLOR },
});

export default memo(ItemPrices);
