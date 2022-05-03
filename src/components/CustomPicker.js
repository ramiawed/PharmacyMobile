import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Colors } from '../utils/constants';

const CustomPicker = ({ selectedValue, onChange, data, label, error, forSearch }) => {
  return (
    <View
      style={{
        backgroundColor: Colors.WHITE_COLOR,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: forSearch ? 0 : 10,
        width: forSearch ? '100%' : '90%',
        borderRadius: forSearch ? 6 : 15,
        padding: forSearch ? 5 : 10,
        borderWidth: forSearch ? 0 : 1,
        borderColor: error ? Colors.FAILED_COLOR : Colors.MAIN_COLOR,
      }}
    >
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
  text: {
    color: Colors.MAIN_COLOR,
  },
});

export default CustomPicker;
