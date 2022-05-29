import i18n from '../i18n/index';
import React from 'react';
import { View, Text, StyleSheet, Modal, Button, TouchableOpacity } from 'react-native';
import { Colors } from '../utils/constants';

const ForgetPasswordModal = ({ cancelAction }) => {
  return (
    <View style={styles.centeredView}>
      <View style={styles.background}></View>
      <Modal animationType="slide" transparent={true}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.header}>{i18n.t('contact-us')}</Text>
            <Text style={styles.text}>
              {i18n.t('forget-password-msg')} {i18n.t('contact-us-through-whatsapp')}: {i18n.t('contact-phone-number')}
            </Text>
            <TouchableOpacity
              onPress={cancelAction}
              style={{
                backgroundColor: Colors.MAIN_COLOR,
                padding: 5,
              }}
            >
              <Text
                style={{
                  color: Colors.WHITE_COLOR,
                  textAlign: 'center',
                }}
              >
                {i18n.t('close-label')}
              </Text>
            </TouchableOpacity>
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
    padding: 5,
    fontSize: 16,
  },
  text: {
    fontSize: 16,
    color: Colors.MAIN_COLOR,
    marginVertical: 20,
  },
});

export default ForgetPasswordModal;
