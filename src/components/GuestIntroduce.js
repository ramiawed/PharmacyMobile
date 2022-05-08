import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../utils/constants';

import { FontAwesome } from '@expo/vector-icons';

const GuestIntroduce = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>الضيوف</Text>
      <View style={styles.row}>
        <FontAwesome name="dot-circle-o" size={16} color={Colors.SECONDARY_COLOR} />
        <Text style={styles.body}>التعرف على منتجات الشركات وتركيباتها واستطباباتها</Text>
      </View>
      <View style={styles.row}>
        <FontAwesome name="dot-circle-o" size={16} color={Colors.SECONDARY_COLOR} />
        <Text style={styles.body}>معرفة أسعار العموم</Text>
      </View>
      <View style={styles.row}>
        <FontAwesome name="dot-circle-o" size={16} color={Colors.SECONDARY_COLOR} />
        <Text style={styles.body}>التعرف على المنتجات الجديدة المطروحة بالسوق اضافة الى اهم الاخبار</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '95%',
    margin: 10,
    padding: 10,
    borderRadius: 6,
    backgroundColor: '#f3f3f3',
    overflow: 'hidden',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: Colors.MAIN_COLOR,
  },
  body: {
    textAlign: 'auto',
    lineHeight: 25,
    marginStart: 10,
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
});

export default GuestIntroduce;
