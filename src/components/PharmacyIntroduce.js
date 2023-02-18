import React, { memo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../utils/constants';

import { FontAwesome } from '@expo/vector-icons';

const PharmacyIntroduce = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>الصيدليات</Text>
      <View style={styles.row}>
        <FontAwesome name="dot-circle-o" size={16} color="#e3e3e3" style={styles.icon} />
        <Text style={styles.body}>امكانية التعرف والوصول الى أكثر من 12 ألف منتج</Text>
      </View>
      <View style={styles.row}>
        <FontAwesome name="dot-circle-o" size={16} color="#e3e3e3" style={styles.icon} />
        <Text style={styles.body}>البحث والتسوق والطلب بسلاسة وسهولة على مدار 24 ساعة وخلال أيام الأسبوع.</Text>
      </View>
      <View style={styles.row}>
        <FontAwesome name="dot-circle-o" size={16} color="#e3e3e3" style={styles.icon} />
        <Text style={styles.body}>خيارات بحث متعددة لتسهيل إمكانية الوصول لاحتياجك</Text>
      </View>

      <View style={styles.row}>
        <FontAwesome name="dot-circle-o" size={16} color="#e3e3e3" style={styles.icon} />
        <Text style={styles.body}>مراقبة حالة الطلبات من المستودعات.</Text>
      </View>

      <View style={styles.row}>
        <FontAwesome name="dot-circle-o" size={16} color="#e3e3e3" style={styles.icon} />
        <Text style={styles.body}>التعرف على المنتجات الجديدة وتحديثات الاسعار إضافة الى اهم الاخبار</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 10,
    padding: 10,
    borderRadius: 12,
    backgroundColor: '#6D597A',
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

export default memo(PharmacyIntroduce);
