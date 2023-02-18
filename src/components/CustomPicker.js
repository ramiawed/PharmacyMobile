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
        width: forSearch ? '100%' : '100%',
        borderRadius: forSearch ? 6 : 15,
        paddingStart: forSearch ? 5 : 5,
        borderWidth: forSearch ? 0 : 1,
        borderColor: error ? Colors.FAILED_COLOR : Colors.MAIN_COLOR,
        overflow: 'hidden',
      }}
    >
      <Text>{label}</Text>
      <Picker
        selectedValue={selectedValue}
        onValueChange={(itemValue, itemIndex) => onChange(itemValue)}
        style={{
          height: 30,
          flex: 1,
          backgroundColor: Colors.WHITE_COLOR,
          color: Colors.MAIN_COLOR,
          borderRadius: 6,
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
