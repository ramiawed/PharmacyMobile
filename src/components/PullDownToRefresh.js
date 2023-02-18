import React from 'react';
import { Text, StyleSheet } from 'react-native';
import i18n from '../i18n';
import { Colors } from '../utils/constants';

const PullDownToRefresh = () => {
  return <Text style={styles.text}>{i18n.t('pull down for refresh')}</Text>;
};

const styles = StyleSheet.create({
  text: {
    textAlign: 'center',
    color: Colors.WHITE_COLOR,
    fontSize: 10,
    marginTop: 5,
    alignSelf: 'center',
    backgroundColor: '#000',
    padding: 4,
    borderRadius: 6,
  },
});

export default PullDownToRefresh;
