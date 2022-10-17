import i18n from '../i18n/index';
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

// constants
import { Colors } from '../utils/constants';

const ConfirmBottomSheet = ({ header, message, okAction, cancelAction, okLabel, cancelLabel }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>{i18n.t(header)}</Text>
      <View style={styles.body}>
        <Text style={styles.message}>{i18n.t(message)}</Text>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity
          onPress={okAction}
          style={{ ...styles.actionView, flex: 3, backgroundColor: Colors.SUCCEEDED_COLOR }}
        >
          <Text style={{ ...styles.actionText }}>{i18n.t(okLabel)}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={cancelAction}
          style={{ ...styles.actionView, flex: 1, backgroundColor: Colors.FAILED_COLOR }}
        >
          <Text style={{ ...styles.actionText }}>{i18n.t(cancelLabel)}</Text>
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
    width: '90%',
    flexDirection: 'row',
    alignItems: 'stretch',
    marginHorizontal: 20,
    marginBottom: 10,
  },
  actionView: {
    flex: 3,
    marginEnd: 10,
    flexDirection: 'row',
    backgroundColor: Colors.SUCCEEDED_COLOR,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 6,
  },
  actionText: {
    fontSize: 14,
    textAlign: 'center',
    color: Colors.WHITE_COLOR,
    paddingVertical: 10,
  },
  header: {
    backgroundColor: Colors.BLUE_COLOR,
    color: Colors.WHITE_COLOR,
    paddingVertical: 20,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  body: {
    minHeight: 60,
    justifyContent: 'center',
  },
  message: {
    color: Colors.MAIN_COLOR,
    marginVertical: 10,
    marginHorizontal: 10,
    fontSize: 16,
  },
});

export default ConfirmBottomSheet;
