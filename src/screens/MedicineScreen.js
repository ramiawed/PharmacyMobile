import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';

const MedicineScreen = ({ route }) => {
  const { medicineId } = route.params;

  return (
    <View>
      <Text>Medicine Screen: {medicineId}</Text>
    </View>
  );
};

const styles = StyleSheet.create({});

export default MedicineScreen;
