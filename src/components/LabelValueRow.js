import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../utils/constants';

const LabelValueRow = ({ label, value }) => {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  row: { flexDirection: 'row', marginHorizontal: 5, marginBottom: 15, alignItems: 'center' },
  label: {
    fontSize: 14,
    minWidth: 75,
    color: Colors.GREY_COLOR,
  },
  value: {
    fontSize: 16,
    flex: 1,
    color: Colors.MAIN_COLOR,
    justifyContent: 'flex-start',
    textAlign: 'center',
  },
});

export default LabelValueRow;
