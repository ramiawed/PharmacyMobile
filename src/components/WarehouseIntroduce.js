import React, { memo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../utils/constants';

import { FontAwesome } from '@expo/vector-icons';

const WarehouseIntroduce = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>المستودعات</Text>
      <View style={styles.row}>
        <FontAwesome name="dot-circle-o" size={16} color="#e3e3e3" style={styles.icon} />
        <Text style={styles.body}>مراقبة ومتابعة الطلبات القادمة من الصيدليات</Text>
      </View>
      <View style={styles.row}>
        <FontAwesome name="dot-circle-o" size={16} color="#e3e3e3" style={styles.icon} />
        <Text style={styles.body}>إضافة عروض او حسومات على المنتجات المتوفرة لديك.</Text>
      </View>
      <View style={styles.row}>
        <FontAwesome name="dot-circle-o" size={16} color="#e3e3e3" style={styles.icon} />
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
    backgroundColor: '#915F78',
    overflow: 'hidden',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: Colors.WHITE_COLOR,
  },
  body: {
    textAlign: 'auto',
    lineHeight: 25,
    marginStart: 10,
    flex: 1,
    color: '#e3e3e3',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
  },
  icon: {
    paddingTop: 5,
  },
});

export default memo(WarehouseIntroduce);
