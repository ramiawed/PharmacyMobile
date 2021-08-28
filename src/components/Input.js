import React from 'react';

import { View, StyleSheet, TextInput } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { Colors } from '../utils/constants';

const Input = ({ value, onTextChange, placeholder, password, icon, error, border }) => {
  return (
    <View style={{ ...styles.container, borderWidth: border }}>
      {icon && icon}
      <TextInput
        autoCapitalize="none"
        autoCorrect={false}
        style={styles.inputText}
        value={value}
        onChangeText={onTextChange}
        placeholder={placeholder}
        secureTextEntry={password}
      />
      {error && value.length === 0 && <MaterialIcons name="error" size={24} color={Colors.FAILED_COLOR} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    width: '100%',
    borderRadius: 15,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    borderColor: Colors.SECONDARY_COLOR,
  },
  inputText: {
    flex: 1,
    paddingStart: 10,
    writingDirection: 'rtl',
    textAlign: 'right',
  },
});

export default Input;
