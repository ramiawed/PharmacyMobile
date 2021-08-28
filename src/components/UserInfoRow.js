import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';

const UserInfoRow = ({ label }) => {
  return (
    <View style={styles.row}>
      <Text>{label}</Text>
      <TextInput />
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    width: '100%',
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
  },
});

export default UserInfoRow;
