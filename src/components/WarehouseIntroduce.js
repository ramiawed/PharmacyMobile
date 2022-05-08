import React, { memo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../utils/constants';

import { FontAwesome } from '@expo/vector-icons';

const WarehouseIntroduce = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>المستودعات</Text>
      <View style={styles.row}>
        <FontAwesome name="dot-circle-o" size={16} color={Colors.SECONDARY_COLOR} />
        <Text style={styles.body}>مراقبة ومتابعة الطلبات القادمة من الصيدليات</Text>
      </View>
      <View style={styles.row}>
        <FontAwesome name="dot-circle-o" size={16} color={Colors.SECONDARY_COLOR} />
        <Text style={styles.body}>إضافة عروض او حسومات على المنتجات المتوفرة لديك.</Text>
      </View>
      <View style={styles.row}>
        <FontAwesome name="dot-circle-o" size={16} color={Colors.SECONDARY_COLOR} />
        <Text style={styles.body}>التحكم الكامل بإضافة منتجات الشركات المتوفرة لديك الى قائمتك او حذفها.</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
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

export default memo(WarehouseIntroduce);
