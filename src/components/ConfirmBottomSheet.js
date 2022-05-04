import i18n from 'i18n-js';
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

// constants
import { Colors } from '../utils/constants';

const ConfirmBottomSheet = ({ header, message, okAction, cancelAction, okLabel, cancelLabel }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>{i18n.t(header)}</Text>
      <Text style={styles.message}>{i18n.t(message)}</Text>
      <View style={styles.actions}>
        <TouchableOpacity onPress={okAction}>
          <Text style={styles.okBtn}>{i18n.t(okLabel)}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={cancelAction}>
          <Text style={styles.cancelBtn}>{i18n.t(cancelLabel)}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.WHITE_COLOR,
    flexDirection: 'column',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingVertical: 5,
  },
  okBtn: {
    backgroundColor: Colors.MAIN_COLOR,
    color: Colors.WHITE_COLOR,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
    marginHorizontal: 5,
    fontSize: 18,
  },
  cancelBtn: {
    color: Colors.MAIN_COLOR,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
    marginHorizontal: 5,
    fontSize: 18,
  },
  header: {
    backgroundColor: Colors.MAIN_COLOR,
    color: Colors.WHITE_COLOR,
    padding: 10,
    fontSize: 18,
    fontWeight: 'bold',
  },
  message: {
    color: Colors.MAIN_COLOR,
    marginVertical: 10,
    marginHorizontal: 10,
    fontSize: 16,
  },
});

export default ConfirmBottomSheet;
