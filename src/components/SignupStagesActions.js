import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Colors } from '../utils/constants';
import Button from './Button';

const SignupStagesActions = ({ stage, prevHandler, nextHandler }) => {
  return (
    <View style={styles.container}>
      {stage > 1 && <Button pressHandler={prevHandler} text="السابق" color={Colors.SUCCEEDED_COLOR} />}
      <View style={{ flex: 1 }}></View>
      {stage <= 4 && <Button text="التالي" pressHandler={nextHandler} color={Colors.SUCCEEDED_COLOR} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
});

export default SignupStagesActions;
