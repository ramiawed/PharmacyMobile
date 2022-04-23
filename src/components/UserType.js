import React from 'react';
import i18n from '../i18n/index';

import { View, Text, StyleSheet, Pressable } from 'react-native';

// icons
import { MaterialIcons } from '@expo/vector-icons';

// constants
import { Colors, UserTypeConstants } from '../utils/constants';

const UserType = ({ userType, userTypeChange }) => {
  return (
    <View style={styles.radioButtons}>
      <Pressable
        style={styles.row}
        onPress={() => {
          userTypeChange(UserTypeConstants.COMPANY);
        }}
      >
        {userType !== UserTypeConstants.COMPANY && (
          <MaterialIcons name="radio-button-off" size={12} color={Colors.MAIN_COLOR} />
        )}
        {userType === UserTypeConstants.COMPANY && (
          <MaterialIcons name="radio-button-on" size={12} color={Colors.MAIN_COLOR} />
        )}
        <Text style={styles.radioText}>{i18n.t(UserTypeConstants.COMPANY)}</Text>
      </Pressable>

      <Pressable
        style={styles.row}
        onPress={() => {
          userTypeChange(UserTypeConstants.WAREHOUSE);
        }}
      >
        {userType !== UserTypeConstants.WAREHOUSE && (
          <MaterialIcons name="radio-button-off" size={12} color={Colors.MAIN_COLOR} />
        )}
        {userType === UserTypeConstants.WAREHOUSE && (
          <MaterialIcons name="radio-button-on" size={12} color={Colors.MAIN_COLOR} />
        )}
        <Text style={styles.radioText}>{i18n.t(UserTypeConstants.WAREHOUSE)}</Text>
      </Pressable>

      <Pressable
        style={styles.row}
        onPress={() => {
          userTypeChange(UserTypeConstants.PHARMACY);
        }}
      >
        {userType !== UserTypeConstants.PHARMACY && (
          <MaterialIcons name="radio-button-off" size={12} color={Colors.MAIN_COLOR} />
        )}
        {userType === UserTypeConstants.PHARMACY && (
          <MaterialIcons name="radio-button-on" size={12} color={Colors.MAIN_COLOR} />
        )}
        <Text style={styles.radioText}>{i18n.t(UserTypeConstants.PHARMACY)}</Text>
      </Pressable>

      <Pressable
        style={styles.row}
        onPress={() => {
          userTypeChange(UserTypeConstants.GUEST);
        }}
      >
        {userType !== UserTypeConstants.GUEST && (
          <MaterialIcons name="radio-button-off" size={12} color={Colors.MAIN_COLOR} />
        )}
        {userType === UserTypeConstants.GUEST && (
          <MaterialIcons name="radio-button-on" size={12} color={Colors.MAIN_COLOR} />
        )}
        <Text style={styles.radioText}>{i18n.t(UserTypeConstants.GUEST)}</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  radioButtons: {
    flexDirection: 'row',
    color: Colors.WHITE_COLOR,
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radioText: {
    color: Colors.MAIN_COLOR,
    fontWeight: 'bold',
    marginHorizontal: 6,
    fontSize: 20,
  },
});

export default UserType;
