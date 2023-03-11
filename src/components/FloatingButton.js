import React, { useRef } from 'react';
import { View, StyleSheet, Animated, TouchableWithoutFeedback, Text, Keyboard } from 'react-native';
import i18n from '../i18n';

// redux stuff
import { useDispatch, useSelector } from 'react-redux';
import { selectMenuSettings, toggleOpenMenu } from '../redux/menu/menuSlice';
import { setSearchCompanyId, setSearchWarehouseId } from '../redux/medicines/medicinesSlices';
import { selectUserData } from '../redux/auth/authSlice';

// icons
import { AntDesign, MaterialIcons, MaterialCommunityIcons, FontAwesome, Entypo, Ionicons } from '@expo/vector-icons';

// constants
import { Colors, UserTypeConstants } from '../utils/constants';

// navigation stuff
import { useNavigation } from '@react-navigation/native';

import { signoutHandler } from '../utils/functions';

const FloatingButton = ({ style, animation, toggleMenu }) => {
  const navigator = useNavigation();

  const dispatch = useDispatch();

  // selectors
  const { token, user } = useSelector(selectUserData);
  const { open } = useSelector(selectMenuSettings);

  const index = useRef(0);

  const getStyle = () => {
    index.current = index.current + 1;
    return {
      transform: [
        {
          scale: animation,
        },
        {
          translateY: animation.interpolate({
            inputRange: [0, 1],
            outputRange: [0, -index.current * 55],
          }),
        },
      ],
    };
  };

  const rotation = {
    transform: [
      {
        rotate: animation.interpolate({
          inputRange: [0, 1],
          outputRange: ['0deg', '45deg'],
        }),
      },
    ],
  };

  const opacityStyle = {
    opacity: animation.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: [0, 0, 1],
    }),
  };

  const goTo = (option, params) => {
    navigator.navigate(option, params);
    dispatch(setSearchWarehouseId(null));
    dispatch(setSearchCompanyId(null));
    toggleMenu();
    index.current = 0;
  };

  return (
    <>
      <View style={[styles.container, style]}>
        {/* medicines */}
        <TouchableWithoutFeedback
          onPress={() =>
            goTo('Items', {
              companyId: null,
              warehouseId: null,
              myCompanies: [],
            })
          }
        >
          <Animated.View style={[styles.button, styles.mainly, getStyle(), opacityStyle]}>
            <AntDesign color={Colors.WHITE_COLOR} size={24} name="medicinebox" />
            <Text style={styles.optionText}>{i18n.t('items')}</Text>
          </Animated.View>
        </TouchableWithoutFeedback>

        {/* companies */}
        <TouchableWithoutFeedback onPress={() => goTo('Companies')}>
          <Animated.View style={[styles.button, styles.mainly, getStyle(), opacityStyle]}>
            <MaterialIcons name="groups" size={24} color={Colors.WHITE_COLOR} />
            <Text style={styles.optionText}>{i18n.t('companies')}</Text>
          </Animated.View>
        </TouchableWithoutFeedback>

        {/* warehouses */}
        {(user.type === UserTypeConstants.ADMIN || user.type === UserTypeConstants.PHARMACY) && (
          <TouchableWithoutFeedback onPress={() => goTo('Warehouses')}>
            <Animated.View style={[styles.button, styles.mainly, getStyle(), opacityStyle]}>
              <MaterialCommunityIcons name="warehouse" size={24} color={Colors.WHITE_COLOR} />
              <Text style={styles.optionText}>{i18n.t('warehouses')}</Text>
            </Animated.View>
          </TouchableWithoutFeedback>
        )}

        {(user.type === UserTypeConstants.ADMIN || user.type === UserTypeConstants.PHARMACY) && (
          <>
            <TouchableWithoutFeedback onPress={() => goTo('Offers')}>
              <Animated.View style={[styles.button, styles.secondary, getStyle(), opacityStyle]}>
                <MaterialIcons name="local-offer" size={24} color={Colors.WHITE_COLOR} />
                <Text style={styles.optionText}>{i18n.t('offers')}</Text>
              </Animated.View>
            </TouchableWithoutFeedback>

            <TouchableWithoutFeedback onPress={() => goTo('ItemsWithPoints')}>
              <Animated.View style={[styles.button, styles.secondary, getStyle(), opacityStyle]}>
                <MaterialIcons name="local-offer" size={24} color={Colors.WHITE_COLOR} />
                <Text style={styles.optionText}>{i18n.t('itemswithpoints')}</Text>
              </Animated.View>
            </TouchableWithoutFeedback>
          </>
        )}

        {user.type !== UserTypeConstants.GUEST && user.type !== UserTypeConstants.COMPANY && (
          <TouchableWithoutFeedback onPress={() => goTo('Baskets')}>
            <Animated.View style={[styles.button, styles.secondary, getStyle(), opacityStyle]}>
              <FontAwesome name="shopping-basket" size={24} color={Colors.WHITE_COLOR} />
              <Text style={styles.optionText}>{i18n.t('baskets')}</Text>
            </Animated.View>
          </TouchableWithoutFeedback>
        )}

        {user.type == UserTypeConstants.PHARMACY && (
          <TouchableWithoutFeedback onPress={() => goTo('SavedItems')}>
            <Animated.View style={[styles.button, styles.secondary, getStyle(), opacityStyle]}>
              <Ionicons name="bookmark" size={24} color={Colors.WHITE_COLOR} />
              <Text style={styles.optionText}>{i18n.t('saveditems')}</Text>
            </Animated.View>
          </TouchableWithoutFeedback>
        )}

        {user.type !== UserTypeConstants.GUEST && user.type !== UserTypeConstants.COMPANY && (
          <TouchableWithoutFeedback onPress={() => goTo('Orders')}>
            <Animated.View style={[styles.button, styles.secondary, getStyle(), opacityStyle]}>
              <Entypo name="mail" size={24} color={Colors.WHITE_COLOR} />
              <Text style={styles.optionText}>
                {i18n.t(user.type === UserTypeConstants.ADMIN ? 'orders' : 'my orders')}
              </Text>
            </Animated.View>
          </TouchableWithoutFeedback>
        )}

        {user.type === UserTypeConstants.PHARMACY && (
          <TouchableWithoutFeedback onPress={() => goTo('MyPoints')}>
            <Animated.View style={[styles.button, styles.secondary, getStyle(), opacityStyle]}>
              <FontAwesome name="money" size={24} color={Colors.WHITE_COLOR} />
              <Text style={styles.optionText}>{i18n.t('my points')}</Text>
            </Animated.View>
          </TouchableWithoutFeedback>
        )}

        <TouchableWithoutFeedback onPress={() => goTo('Profile')}>
          <Animated.View style={[styles.button, styles.secondary, getStyle(), opacityStyle]}>
            <FontAwesome name="user" size={24} color={Colors.WHITE_COLOR} />
            <Text style={styles.optionText}>{i18n.t('profile')}</Text>
          </Animated.View>
        </TouchableWithoutFeedback>

        <TouchableWithoutFeedback
          onPress={() => {
            toggleMenu();
            index.current = 0;
            signoutHandler(dispatch, token);
          }}
        >
          <Animated.View style={[styles.button, styles.secondary, getStyle(), opacityStyle]}>
            <Ionicons name="exit" size={24} color={Colors.WHITE_COLOR} />
            <Text style={styles.optionText}>{i18n.t('nav-sign-out')}</Text>
          </Animated.View>
        </TouchableWithoutFeedback>

        <TouchableWithoutFeedback
          onPress={() => {
            toggleMenu();
            index.current = 0;
            Keyboard.dismiss();
          }}
        >
          <Animated.View style={[styles.button, styles.menu, rotation]}>
            {open ? (
              <AntDesign name="plus" size={30} color="#fff" />
            ) : (
              <MaterialIcons name="menu" size={30} color={Colors.WHITE_COLOR} />
            )}
          </Animated.View>
        </TouchableWithoutFeedback>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
  },
  button: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 60 / 2,
    alignItems: 'center',
    justifyContent: 'center',
    shadowRadius: 10,
    shadowColor: '#9C3030',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 30,
    elevation: 5,
  },
  menu: {
    backgroundColor: '#DC493A',
    // backgroundColor: Colors.MAIN_COLOR,
  },
  secondary: {
    flexDirection: 'row',
    width: 200,
    height: 48,
    borderRadius: 12,
    backgroundColor: Colors.DARK_COLOR,
    paddingStart: 10,
    shadowColor: Colors.DARK_COLOR,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 30,
    elevation: 5,
  },
  mainly: {
    flexDirection: 'row',
    width: 200,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#E56B6F',
    paddingStart: 10,
    shadowColor: '#E56B6F',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 30,
    elevation: 5,
  },
  optionText: {
    color: Colors.WHITE_COLOR,
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  image: {
    width: 48,
    height: 48,
    resizeMode: 'cover',
    borderRadius: 24,
    backgroundColor: Colors.WHITE_COLOR,
  },
});

export default FloatingButton;
