import i18n from 'i18n-js';
import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Modal } from 'react-native';
import { Colors } from '../utils/constants';

const Loader = ({ msg1, msg2 }) => {
  return (
    <View style={styles.centeredView}>
      <View style={styles.background}></View>
      <Modal animationType="slide" transparent={true}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <ActivityIndicator size="large" color={Colors.MAIN_COLOR} />
            <Text>Loading...</Text>
            {msg1 ? <Text style={styles.msg}>{i18n.t(msg1)}</Text> : null}
            {msg2 ? <Text style={styles.msg}>{i18n.t(msg2)}</Text> : null}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  background: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: '#000',
    opacity: 0.4,
  },
  modalView: {
    marginHorizontal: 'auto',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    marginHorizontal: 40,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  msg: {
    textAlign: 'center',
    color: Colors.MAIN_COLOR,
    marginVertical: 10,
  },
});

export default Loader;
