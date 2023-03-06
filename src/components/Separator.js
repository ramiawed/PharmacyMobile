import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Colors } from '../utils/constants';

const Separator = () => {
  return (
    <View style={styles.container}>
      <View style={styles.separator}></View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  separator: {
    width: '95%',
    height: 1,
    backgroundColor: Colors.LIGHT_GREY_COLOR,
  },
});

export default Separator;
