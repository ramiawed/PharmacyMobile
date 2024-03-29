import i18n from '../i18n/index';

import React, { useState } from 'react';

import { View, Text, StyleSheet, Modal, TextInput, TouchableOpacity } from 'react-native';

import { Colors } from '../utils/constants';

const ChangeInputModal = ({ params: { title, okAction, cancelAction } }) => {
  const [value, setValue] = useState('');

  const changeHandler = () => {
    if (value.length === 0) {
      cancelAction();
      return;
    }

    cancelAction();
    okAction(value);
  };

  return (
    <View style={styles.centeredView}>
      <View style={styles.background}></View>

      <Modal animationType="slide" transparent={true}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.header}>{title}</Text>
            <TextInput
              value={value}
              onChangeText={setValue}
              style={styles.textInput}
              placeholder={i18n.t('enter-value')}
            />
            <View style={styles.actions}>
              <TouchableOpacity onPress={changeHandler}>
                <Text style={styles.okBtn}>{i18n.t('ok-label')}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={cancelAction}>
                <Text style={styles.cancelBtn}>{i18n.t('cancel')}</Text>
              </TouchableOpacity>
            </View>
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
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
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
    width: '70%',
    marginHorizontal: 'auto',
    backgroundColor: 'white',
    borderRadius: 6,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    overflow: 'hidden',
  },
  header: {
    backgroundColor: Colors.MAIN_COLOR,
    color: Colors.WHITE_COLOR,
    padding: 8,
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 5,
  },
  okBtn: {
    backgroundColor: Colors.SUCCEEDED_COLOR,
    color: Colors.WHITE_COLOR,
    padding: 5,
    borderRadius: 6,
    width: 100,
    textAlign: 'center',
    fontSize: 16,
    marginHorizontal: 5,
  },
  cancelBtn: {
    backgroundColor: Colors.FAILED_COLOR,
    color: Colors.WHITE_COLOR,
    padding: 5,
    borderRadius: 6,
    width: 100,
    textAlign: 'center',
    fontSize: 16,
    marginHorizontal: 5,
  },
  textInput: {
    width: '90%',
    writingDirection: 'rtl',
    textAlign: 'right',
    marginHorizontal: 10,
    marginVertical: 10,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: Colors.LIGHT_GREY_COLOR,
    borderRadius: 6,
  },
});

export default ChangeInputModal;
