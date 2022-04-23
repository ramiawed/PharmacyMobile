import i18n from 'i18n-js';
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Button } from 'react-native';
import { Colors } from '../utils/constants';
import ChangeInputModal from './ChangeInputModal';

const UserInfoRow = ({ label, value, action, editable }) => {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
      {editable && (
        <TouchableOpacity onPress={action}>
          <Text style={styles.button}>{i18n.t('update-label')}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    width: '100%',
    paddingHorizontal: 5,
    flexDirection: 'row',
    alignItems: 'center',
    height: 45,
    borderBottomWidth: 1,
    borderBottomColor: Colors.SECONDARY_COLOR,
  },
  value: {
    flex: 1,
    color: Colors.MAIN_COLOR,
    fontSize: 14,
    fontWeight: 'bold',
    marginStart: 5,
    writingDirection: 'rtl',
    textAlign: 'left',
  },
  label: {
    width: 80,
    color: Colors.GREY_COLOR,
    fontSize: 12,
  },
  button: {
    backgroundColor: Colors.SUCCEEDED_COLOR,
    color: Colors.WHITE_COLOR,
    padding: 5,
    borderRadius: 6,
  },
});

export default UserInfoRow;
