import React from 'react';
import { Text, View, StyleSheet } from 'react-native';

const CustomFallback = () => {
  return (
    <View style={styles.container}>
      <Text>Custom Fallback</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default CustomFallback;
