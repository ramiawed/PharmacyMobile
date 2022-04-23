import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Colors } from '../utils/constants';

const CustomPicker = ({ selectedValue, onChange, data, label, error }) => {
  return (
    <View style={{ ...styles.container, borderColor: error ? Colors.FAILED_COLOR : Colors.MAIN_COLOR }}>
      <Text>{label}</Text>
      <Picker
        selectedValue={selectedValue}
        onValueChange={(itemValue, itemIndex) => onChange(itemValue)}
        style={{
          width: '90%',
          height: 30,
          backgroundColor: Colors.WHITE_COLOR,
          color: Colors.MAIN_COLOR,
        }}
        itemStyle={{
          color: Colors.MAIN_COLOR,
        }}
      >
        {data.map((d) => (
          <Picker.Item label={d.label} value={d.value} key={d.value} />
        ))}
      </Picker>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    width: '90%',
    borderWidth: 1,
    borderRadius: 15,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    borderColor: Colors.MAIN_COLOR,
  },
  text: {
    color: Colors.MAIN_COLOR,
  },
});

export default CustomPicker;
