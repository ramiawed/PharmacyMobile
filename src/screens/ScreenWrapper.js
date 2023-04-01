import React, { useRef } from 'react';
import { View, StyleSheet, TouchableWithoutFeedback, Animated, Text } from 'react-native';

// redux stuff
import { useDispatch, useSelector } from 'react-redux';
import { selectMenuSettings, toggleOpenMenu } from '../redux/menu/menuSlice';

// components
import FloatingButton from '../components/FloatingButton';

import { Entypo } from '@expo/vector-icons';

// constants
import { Colors } from '../utils/constants';
import i18n from '../i18n';

const ScreenWrapper = ({ children }) => {
  const { open } = useSelector(selectMenuSettings);
  const dispatch = useDispatch();

  const animation = useRef(new Animated.Value(0)).current;

  const toggleMenu = () => {
    const toValue = open ? 0 : 1;

    Animated.spring(animation, {
      toValue,
      friction: 5,
      useNativeDriver: true,
    }).start();

    dispatch(toggleOpenMenu());
  };

  return (
    <View style={styles.wrapper}>
      {open && (
        <TouchableWithoutFeedback onPress={toggleMenu}>
          <View style={styles.greyView}>
            <Text
              style={{
                ...styles.text,
                top: 30,
              }}
            >
              {i18n.t('press outside to exit')}
            </Text>

            <Entypo
              name="arrow-bold-down"
              size={32}
              color="white"
              style={{
                ...styles.text,
                top: 60,
              }}
            />
          </View>
        </TouchableWithoutFeedback>
      )}
      {children}
      <FloatingButton style={{ bottom: 75, left: 10, zIndex: 11 }} animation={animation} toggleMenu={toggleMenu} />
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: Colors.WHITE_COLOR,
    alignItems: 'center',
  },
  greyView: {
    position: 'absolute',
    backgroundColor: '#000',
    width: '100%',
    height: '100%',
    zIndex: 10,
    opacity: 0.7,
  },
  text: {
    // position: 'absolute',
    // left: 30,
    // right: 30,
    color: Colors.WHITE_COLOR,
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default ScreenWrapper;
