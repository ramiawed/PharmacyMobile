import React from 'react';
import i18n from '../i18n/index';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

// constants
import { Colors } from '../utils/constants';

const UserInfoRow = ({ label, value, action, editable, withoutBottomBorder }) => {
  return (
    <View style={{ ...styles.row, borderBottomWidth: withoutBottomBorder ? 0 : 1 }}>
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
    borderBottomColor: '#e3e3e3',
  },
  value: {
    flex: 1,
    color: Colors.MAIN_COLOR,
    fontSize: 12,
    fontWeight: 'bold',
    marginStart: 5,
    writingDirection: 'rtl',
    textAlign: 'left',
  },
  label: {
    width: 70,
    color: Colors.GREY_COLOR,
    fontSize: 10,
  },
  button: {
    backgroundColor: Colors.SUCCEEDED_COLOR,
    color: Colors.WHITE_COLOR,
    padding: 5,
    borderRadius: 6,
  },
});

export default UserInfoRow;
