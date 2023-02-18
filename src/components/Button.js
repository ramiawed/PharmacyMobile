import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

const Button = ({ color, pressHandler, text }) => {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        {
          backgroundColor: color,
        },
      ]}
      onPress={pressHandler}
    >
      <Text style={styles.buttonText}>{text}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    // width: 100,
    padding: 10,
    borderRadius: 6,
    marginVertical: 5,
  },
  buttonText: {
    textAlign: 'center',
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default Button;
