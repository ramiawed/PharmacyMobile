import React from 'react';
import { StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const CustomLinearGradient = ({ colors, children }) => {
  return (
    <LinearGradient
      colors={colors}
      locations={[0, 1]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.gradient}
    >
      {children}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: {
    margin: 10,
    borderRadius: 6,
    padding: 2,
  },
});

export default CustomLinearGradient;
