import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { Colors } from '../utils/constants';

const HeaderWithSlogn = () => {
  return (
    <View style={styles.headerWithSlogn}>
      <Text style={styles.appName}>Smart Pharma</Text>
      {/* <Text style={styles.slogn}>be smart work smart</Text> */}
    </View>
  );
};

const styles = StyleSheet.create({
  headerWithSlogn: {
    display: 'flex',
    alignItems: 'center',
  },
  appName: {
    fontSize: 28,
    color: Colors.OFFER_COLOR,
    textShadowColor: 'black',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
  },
  slogn: {
    fontSize: 18,
    color: Colors.WHITE_COLOR,
    fontStyle: 'italic',
    textShadowColor: 'black',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
  },
});

export default HeaderWithSlogn;
