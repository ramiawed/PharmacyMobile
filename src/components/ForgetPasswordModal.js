import i18n from '../i18n/index';
import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Linking } from 'react-native';
import { Colors } from '../utils/constants';
import { FontAwesome5 } from '@expo/vector-icons';

const ForgetPasswordModal = ({ cancelAction }) => {
  const openApp = (url) => {
    Linking.openURL(url)
      .then(() => {})
      .catch(() => {
        alert('تأكد من تنزيل البرنامج المحدد.');
      });
  };

  return (
    <View style={styles.centeredView}>
      <View style={styles.background}></View>
      <Modal animationType="slide" transparent={true}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.header}>{i18n.t('contact-us')}</Text>
            <Text style={styles.text}>{i18n.t('forget-password-msg')}</Text>
            <TouchableOpacity onPress={() => openApp('whatsapp://send?text=' + '' + '&phone=+963956660333')}>
              <View style={styles.contactView}>
                <FontAwesome5 name="whatsapp" size={24} color="#25D366" />
                <Text style={{ marginStart: 10, color: '#25D366' }}>للتواصل معنا عن طريق الواتساب</Text>
              </View>
            </TouchableOpacity>
            <View style={{ height: 10 }}></View>
            <TouchableOpacity onPress={() => openApp('https://t.me/+8SM-2Zfg8fcyNDdk')}>
              <View style={styles.contactView}>
                <FontAwesome5 name="telegram" size={24} color="#229ED9" />
                <Text style={{ marginStart: 10, color: '#229ED9' }}>للتواصل معنا عن طريق التلغرام</Text>
              </View>
            </TouchableOpacity>
            <View style={{ height: 10 }}></View>
            <TouchableOpacity onPress={cancelAction} style={styles.cancelBtn}>
              <Text style={styles.cancelText}>{i18n.t('close-label')}</Text>
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
    width: '90%',
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
    alignItems: 'center',
  },
  header: {
    color: Colors.MAIN_COLOR,
    borderBottomWidth: 1,
    borderBottomColor: '#e3e3e3',
    padding: 5,
    paddingVertical: 12,
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    width: '70%',
  },
  text: {
    fontSize: 16,
    color: Colors.MAIN_COLOR,
    marginVertical: 20,
    textAlign: 'center',
  },
  cancelBtn: {
    backgroundColor: Colors.FAILED_COLOR,
    width: '100%',
    alignItems: 'center',
    padding: 12,
  },
  cancelText: {
    color: Colors.WHITE_COLOR,
    fontSize: 16,
  },
  link: {
    color: Colors.SUCCEEDED_COLOR,
    marginTop: 0,
    textDecorationLine: 'underline',
  },
  contactView: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingStart: 10,
  },
});

export default ForgetPasswordModal;
