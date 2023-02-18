import React from 'react';
import i18n from '../i18n/index';
import { View, StyleSheet, TextInput, Text, TouchableOpacity } from 'react-native';

// icons
import { AntDesign } from '@expo/vector-icons';

import { Colors } from '../utils/constants';

const Input = ({ value, onTextChange, placeholder, password, icon, error, border, label }) => {
  return (
    <View
      style={{ ...styles.container, borderWidth: border, borderColor: error ? Colors.FAILED_COLOR : Colors.MAIN_COLOR }}
    >
      {value ? <Text style={styles.label}>{label}</Text> : null}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
        }}
      >
        {icon && icon}
        <TextInput
          autoCapitalize="none"
          autoCorrect={false}
          style={styles.inputText}
          value={value}
          onChangeText={onTextChange}
          // placeholder={placeholder}
          secureTextEntry={password}
        />
        {placeholder?.length && value.trim().length === 0 && (
          <View
            style={{
              position: 'absolute',
              start: 30,
            }}
          >
            <Text style={{ color: Colors.SECONDARY_COLOR, fontSize: 12 }}>{placeholder}</Text>
          </View>
        )}
        {value.trim().length > 0 && (
          <TouchableOpacity>
            <AntDesign name="closecircleo" size={24} color={Colors.MAIN_COLOR} onPress={() => onTextChange('')} />
          </TouchableOpacity>
        )}
      </View>

      <Text style={{ display: error ? 'flex' : 'none', ...styles.errorText }}>{error ? i18n.t(error) : ''}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    width: '100%',
    borderRadius: 15,
    padding: 10,
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: 10,
  },
  inputText: {
    flex: 1,
    paddingStart: 10,
    writingDirection: 'rtl',
    textAlign: 'right',
    fontSize: 20,
    color: Colors.MAIN_COLOR,
    zIndex: 100,
  },
  errorText: {
    color: Colors.FAILED_COLOR,
    fontSize: 12,
  },
  label: {
    fontSize: 12,
    alignSelf: 'flex-start',
    color: Colors.GREY_COLOR,
  },
});

export default Input;
