import React, { memo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../utils/constants';

const IntroduceUs = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>من نحن</Text>
      <Text style={styles.body}>
        سمارت فارما هو اول موقع ويب وتطبيق الكتروني مختص في التسويق والمبيعات الصيدلانية، نعتمد على الربط بين الصيدليات
        واحتياجاتهم من الشركات والمستودعات ونفتح عالمًا من الإمكانات من المنتجات الدوائية والمستلزمات الطبية والتجميلية
        والمتممات الغذائية ومنتجات العناية بالطفل.... والوصول إلى كل ما تحتاجه وتريده لصيدليتك.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 10,
    padding: 10,
    borderRadius: 6,
    backgroundColor: Colors.MAIN_COLOR,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: Colors.WHITE_COLOR,
  },
  body: {
    textAlign: 'justify',
    lineHeight: 25,
    color: '#e3e3e3',
    fontSize: 16,
  },
});

export default memo(IntroduceUs);
