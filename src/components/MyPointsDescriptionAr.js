import React from 'react';

import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../utils/constants';

const MyPointsDescriptionAr = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.strong}>برنامج نقاط ولاء</Text>
      <Text style={styles.textJustify}>
        برنامج نقاط ولاء هو طريقتنا لنعبر عن تقديرنا واهتمامنا بك كشريك معنا من خلال الهدايا والمزايا الخاصة المقدمة لك{' '}
      </Text>
      <View
        style={{
          height: 10,
        }}
      ></View>
      <Text style={styles.strong}>مضمون برنامج نقاط ولاء</Text>
      <View>
        <View style={styles.paddingStart}>
          <Text style={styles.textJustify}>* يمكنك الاشتراك في برنامج نقاط ولاء مجانا من خلال التطبيق الذكي</Text>
          <Text style={styles.textJustify}>
            * للاشتراك في برنامج نقاط ولاء يجب ان يكون لديك رقم موبايل فعال ومحقق ويحتوي على واتساب وصادر من الجمهورية
            العربية السورية.
          </Text>
          <Text style={styles.textJustify}>
            * لكي نتمكن من ايصال النصائح والعروض المناسبة لاحتياجاتك قد نطلب منك تحديث بياناتك وتفضيلاتك مرة واحدة كل
            ستة أشهر.
          </Text>
          <Text style={styles.textJustify}>
            * ان عدم اكتساب او استبدال نقاط لفترة تزيد عن ستة أشهر متواصلة يؤدي الى انتهاء صلاحية نقاطك.
          </Text>
        </View>
      </View>
      <Text style={styles.strong}>كيفية جمع النقاط:</Text>
      <View>
        <View style={styles.paddingStart}>
          <Text style={styles.textJustify}>
            * ستحصل على نقطة واحدة فقط مقابل كل قيمة معينة تم شرائها من احد المستودعات الداخلة ضمن برنامج نقاط ولاء من
            خلال التطبيق والتي سوف تكون واضحة بملاحظة أسفل كل اسم مستودع من خلال قسم المستودعات.
          </Text>
          <Text style={styles.textJustify}>
            * يمكن أيضا الحصول على نقاط إضافية من خلال العروض المخصصة على بعض المنتجات لزيادة رصيدك من النقاط.
          </Text>
          <Text style={styles.textJustify}>* تضاف النقاط الى حسابك خلال 24 ساعة كحد اقصى من عملية الشراء.</Text>
          <Text style={styles.textJustify}>
            * يحق لك المطالبة بأي نقاط غير مضافة الى حسابك بناءاً على مشترياتك خلال اسبوع بحد اقصى من تاريخ عملية الشراء
            باستخدام فاتورة العملية الشرائية.
          </Text>
          <Text style={styles.textJustify}>
            * لا يمكن جمع النقاط على قيمة النقاط المستبدلة في العمليات الشرائية التي يتم دفع قيمتها أو جزء من قيمتها
            باستخدام النقاط المستبدلة.
          </Text>
        </View>
      </View>
      <Text style={styles.strong}>استبدال النقاط</Text>
      <View>
        <View style={styles.paddingStart}>
          <Text style={styles.textJustify}>
            * يجب ان يتم التواصل مع الرقم الموحد لخدمة العملاء على الرقم: 0956660333 لإعلامهم باستبدال النقاط التي
            بحسابك واقتطاعها من جزء او كل من قيمة الطلبية الأخيرة فور طلبها مباشرة.
          </Text>
          <Text style={styles.textJustify}>
            * يمكنك استبدال النقاط بالمنتجات عند جمع 499 نقطة على الاقل ويكون الحد الأدنى لقيمة الاستبدال 50,000 ليرة
            سورية.
          </Text>
          <Text style={styles.textJustify}>
            * يحق لشركة سمارت فارما التحقق من ملكية الحساب عند طلب استبدال النقاط عن طريق قسم خدمة العملاء.
          </Text>
        </View>
      </View>
      <Text style={styles.strong}>انتهاء صلاحية النقاط</Text>
      <View>
        <View style={styles.paddingStart}>
          <Text style={styles.textJustify}>
            تكون مدة سريان فعالية النقاط المضافة ستة أشهر من تاريخ إضافة اول نقطة الى الحساب وتلغى في حال لم يتم
            استبدالها خلال المدة المذكورة.
          </Text>
        </View>
      </View>
      <Text style={styles.strong}>شروط عامّة</Text>
      <View style={styles.paddingStart}>
        <Text style={styles.textJustify}>
          يؤدي عدم الإمتثال لشروط وأحكام برنامج نقاط ولاء الخاص بتطبيق سمارت فارما او إساءة استخدامها أو تزويد بيانات
          خاطئة الى الغاء او إيقاف الحساب.
        </Text>
        <Text style={styles.textJustify}>
          يحق لشركة سمارت فارما إلغاء أو تعديل برنامج نقاط ولاء بما في ذلك هذه الشروط والأحكام وفي أي وقت دون اخطار
          مسبق.
        </Text>
      </View>
      <View style={{ height: 70 }}></View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  header: {
    color: Colors.MAIN_COLOR,
    fontSize: 20,
    marginBottom: 10,
  },
  strong: {
    marginTop: 10,
    fontSize: 18,
    color: Colors.SUCCEEDED_COLOR,
    fontWeight: 'bold',
  },
  textJustify: {
    fontSize: 16,
    color: Colors.DARK_COLOR,
    textAlign: 'justify',
  },
  paddingStart: {
    marginStart: 20,
  },
  marginTop: {
    marginTop: 10,
  },
});

export default MyPointsDescriptionAr;
