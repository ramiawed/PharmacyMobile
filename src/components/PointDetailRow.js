import React from 'react';
import i18n from '../i18n';

import { View, Text, StyleSheet } from 'react-native';

import { Colors } from '../utils/constants';

const PointDetailsRow = ({ point }) => {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{i18n.t('quantity-label')}</Text>
      <Text style={styles.value}>{point.qty}</Text>
      <Text style={styles.label}>{i18n.t('after-quantity-label')}</Text>
      <Text style={styles.value}>{point.bonus}</Text>
      <Text style={styles.label}>{i18n.t('point')}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    padding: 4,
    backgroundColor: Colors.POINTS_OFFER_COLOR,
    margin: 4,
    borderRadius: 6,
    justifyContent: 'center',
  },
  value: {
    fontSize: 16,
    borderRadius: 4,
    backgroundColor: Colors.WHITE_COLOR,
    color: Colors.FAILED_COLOR,
    marginHorizontal: 4,
    paddingHorizontal: 4,
    textAlign: 'center',
  },
  label: {
    color: Colors.DARK_COLOR,
    fontSize: 14,
    marginHorizontal: 4,
    textAlign: 'center',
  },
});

export default PointDetailsRow;
