import React from 'react';
import { View, StyleSheet, ScrollView, Text } from 'react-native';
import i18n from '../i18n';

// redux stuff
import { useSelector } from 'react-redux';
import { selectUser } from '../redux/auth/authSlice';
import { selectCartWarehouse } from '../redux/cart/cartSlice';

// components
import CustomLinearGradient from '../components/CustomLinearGradient';
import CartWarehouse from '../components/CartWarehouse';
import NoContent from '../components/NoContent';
import ScreenWrapper from './ScreenWrapper';

// constants
import { Colors } from '../utils/constants';

const CartScreen = () => {
  // selectors
  // get the logged user from redux store
  const user = useSelector(selectUser);
  // get the cart warehouses from redux store
  const cartWarehouse = useSelector(selectCartWarehouse);

  return user ? (
    <ScreenWrapper>
      <View style={styles.container}>
        {cartWarehouse.length > 0 && (
          <ScrollView
            contentContainerStyle={{
              width: '100%',
            }}
          >
            <View>
              <CustomLinearGradient colors={['#F2FFDA', '#D1FFF0']}>
                <View>
                  {cartWarehouse?.length > 0 && (
                    <Text style={styles.replacePointsText}>
                      {i18n.t('you have')} {user.points} {i18n.t('point')} {i18n.t('equals to')} {user.points * 100}{' '}
                      {i18n.t('you can replace your points after sending the order by contact us')}
                    </Text>
                  )}
                </View>
              </CustomLinearGradient>

              {cartWarehouse.map((w, index) => (
                <CartWarehouse warehouse={w} key={index} index={index} />
              ))}
            </View>
          </ScrollView>
        )}

        {cartWarehouse.length === 0 && <NoContent msg="empty-cart" />}
      </View>
    </ScreenWrapper>
  ) : null;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.WHITE_COLOR,
    width: '100%',
    paddingBottom: 50,
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
  replacePointsText: {
    textAlign: 'center',
    color: Colors.DARK_COLOR,
    margin: 10,
    fontWeight: 'bold',
    borderRadius: 6,
    padding: 5,
  },
});

export default CartScreen;
