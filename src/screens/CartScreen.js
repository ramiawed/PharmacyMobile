import i18n from 'i18n-js';
import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView } from 'react-native';

// redux stuff
import { useSelector } from 'react-redux';
import CartWarehouse from '../components/CartWarehouse';
import { selectUser } from '../redux/auth/authSlice';
import { selectCartWarehouse } from '../redux/cart/cartSlice';
import { Colors } from '../utils/constants';

const CartScreen = () => {
  // selectors
  // get the logged user from redux store
  const user = useSelector(selectUser);
  // get the cart warehouses from redux store
  const cartWarehouse = useSelector(selectCartWarehouse);

  return user ? (
    <View style={styles.container}>
      <ScrollView>
        {cartWarehouse.length > 0 && (
          <View>
            {cartWarehouse.map((w, index) => (
              <CartWarehouse warehouse={w} key={index} index={index} />
            ))}
          </View>
        )}

        {cartWarehouse.length === 0 && (
          <View style={styles.noContentContainer}>
            <Image source={require('../../assets/no-content.jpeg')} style={styles.noContentImage} />
            <Text style={styles.noContent}>{i18n.t('empty-cart')}</Text>
          </View>
        )}
      </ScrollView>
    </View>
  ) : null;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  noContentContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noContent: {
    paddingTop: 25,
    fontSize: 18,
    fontWeight: '500',
    color: Colors.SECONDARY_COLOR,
  },
  noContentImage: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
  },
});

export default CartScreen;
