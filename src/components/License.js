import i18n from '../i18n/index';
import React from 'react';
import { View, Text, StyleSheet, Modal, Pressable, ScrollView } from 'react-native';
import { Colors } from '../utils/constants';

const License = ({ action, close }) => {
  return (
    <Modal animationType="slide" transparent={true} onRequestClose={() => {}}>
      <View style={styles.modalView}>
        <ScrollView>
          <Text style={[styles.header]}>سياسة الخصوصية</Text>
          <Text style={[styles.textJustify]}>
            سمارت فارما ملتزمة بحماية خصوصية بيانات كل مستخدمي موقعنا على الانترنت أو تطبيق الهاتف المحمول الخاص بنا.
            يرجى قراءة سياسة الخصوصية التالية و التي توضح كيف نستعمل ونحمي معلوماتك. سنكون المتحكمين بالبيانات التي
            تقدمها لنا.{' '}
          </Text>
          <View
            style={{
              height: 10,
            }}
          ></View>
          <View>
            <View style={styles.marginTop}>
              <Text style={styles.textJustify}>
                <Text style={styles.strong}>بيانات المتصل:</Text> إذا كان لديك أي استفسارات أو طلبات بخصوص سياسة
                الخصوصية هذه أو كيف نتعامل مع بياناتك بشكل عام، يرجى الاتصال بنا باستخدام التفاصيل التالية: عبر الهاتف
                على الرقم: 0956660333 أو عن طريق الايميلsmartpharma.sy@gmail.com
              </Text>
            </View>

            <View style={styles.marginTop}>
              <Text style={styles.textJustify}>
                <Text style={styles.strong}>كيف نقوم بجمع معلوماتك:</Text> : نقوم بجمع معلوماتك الشخصية عندما تتفاعل
                معنا أو تستخدم خدماتنا، مثلا عندما تستخدم مواقعنا لإرسال طلب. وننظر أيضا في كيفية استخدام الزوار
                لمواقعنا، لمساعدتنا على تحسين خدماتنا و تحسين تجربة العملاء.
              </Text>
            </View>

            <View>
              <Text style={styles.strong}>نقوم بجمع المعلومات:</Text>
              <View style={styles.paddingStart}>
                <Text style={styles.textJustify}>* عند إنشاء حساب معنا أو تغيير إعدادات حسابك</Text>
                <Text style={styles.textJustify}>
                  * عند إرسال طلب الينا و أثناء عملية الطلب (بما في ذلك انشاء و تسليم الطلب).
                </Text>
                <Text style={styles.textJustify}>
                  * عند الاتصال بنا مباشرة عبر البريد الإلكتروني أو الهاتف أو الرسالة أو عبر وظيفة تواصل معنا.
                </Text>
              </View>
            </View>

            <View style={styles.marginTop}>
              <Text style={[styles.textJustify]}>
                <Text style={styles.strong}>المعلومات التي نجمعها عنك</Text> كجزء من التزامنا بخصوصية عملائنا و زائري
                مواقعنا بشكل عام، نريد أن نكون واضحين بشأن أنواع المعلومات التي سنجمعها منك. عند إرسال طلب من خلال منصة
                سمارت فارما لأول مرة يطلب منك تقديم معلومات عن نفسك بما في ذلك اسمك و تفاصيل الاتصال و عنوانك التفصيلي و
                معلومات عنك من أي رسائل ترسلها الينا أو عند الاتصال بنا أو تزويدنا بتعليقات، بما في ذلك عبر البريد
                الالكتروني أو الهاتف. إذا اتصلت بنا عبر الهاتف، فسوف نسجل المكالمة لأغراض التدريب و تحسين الخدمة، ونقوم
                بتدوين ملاحظات فيما يتعلق بالمكالمة. نقوم بجمع معلومات فنية من جهازك المحمول او جهاز الحاسب الخاص بك،
                مثل نظام التشغيل الخاص به، و الجهاز و نوعه و نوع الاتصال و عنوان IP الذي تدخل منه الى مواقعنا.{' '}
              </Text>
            </View>

            <View style={styles.marginTop}>
              <Text style={styles.textJustify}>
                <Text style={styles.strong}>استخدام المعلومات الخاصة بك</Text> سنقوم بمعالجة البيانات التي نجمعها عنك
                فقط إذا كان هناك سبب للقيام بذلك، وإذا كان هذا السبب مسموحاً به بموجب المرسوم التشريعي رقم 17 لعام 2012
                ضمن قانون تنظيم التواصل على الشبكة ومكافحة الجريمة المعلوماتية. سيكون لدينا أساس قانوني لمعالجة
                المعلومات الخاصة بك؛ إذا كنا بحاجة إلى معالجة المعلومات الخاصة بك من أجل تزويدك بالخدمة التي طلبتها أو
                للدخول في عقد فلدينا موافقتك و لدينا سبب مبرر لمعالجة بياناتك، أو نحن ملزمون قانونا بالقيام بذلك.
              </Text>
            </View>

            <Text style={[styles.strong, styles.marginTop, styles.textJustify]}>
              حيثما نحتاج لتزويدك بالخدمة التي طلبتها أو للدخول في عقد فإننا نستخدم معلوماتك:
            </Text>

            <View style={styles.paddingStart}>
              <Text style={styles.textJustify}>* لتمكيننا من تزويدك بالوصول الى الأجزاء ذات الصلة بالمنصة.</Text>
              <Text style={styles.textJustify}>* لتوفير الخدمات التي طلبتها.</Text>
              <Text style={styles.textJustify}>* لتمكيننا من تحصيل المدفوعات منك.</Text>
              <Text style={styles.textJustify}>
                * للاتصال بك عند الضرورة فيما يتعلق بخدماتنا، مثل حل المشكلات التي قد تواجهنا في طلبك.{' '}
              </Text>
            </View>

            <Text style={[styles.strong, styles.marginTop, styles.textJustify]}>
              نقوم أيضا بمعالجة بياناتك حيث يكون لدينا سبب مبرر للقيام بذلك، على سبيل المثال تخصيص خدماتنا، بما في ذلك
              معالجة البيانات لجعل الأمر أسهل وأسرع بالنسبة لك لتقديم الخدمات. أدرجنا هذه الأسباب أدناه:{' '}
            </Text>

            <View style={styles.paddingStart}>
              <Text style={styles.textJustify}>* تحسين فعالية و جودة الخدمة التي يتوقعها عملاؤنا منا في المستقبل.</Text>
              <Text style={styles.textJustify}>
                * لتخصيص المحتوى الذي نعرضه لك، نحن أو أي مستودع او شركة مشتركة أو شركاء الإعلان، على سبيل المثال حتى
                نتمكن من عرض المستودعات او الشركات الموجودة في منطقتك أو التأكد من أنك ترى الإعلان الأكثر صلة بك استنادا
                الى الخصائص المحددة بواسطتنا
              </Text>
              <Text style={styles.textJustify}>
                * لتمكين فريق دعم العملاء لدينا من مساعدتك في أي استفسارات أو شكاوى بأكثر الطرق فعالية ممكنة ولتقديم
                تجربة إيجابية للعملاء.
              </Text>
              <Text style={styles.textJustify}>
                * للاتصال بك و الاطلاع على آرائك و ملاحظاتك على خدماتنا و إبلاغك إذا كانت هناك اي تغييرات أو تطورات مهمة
                على المواقع أو خدماتنا، بما في ذلك إعلامك بأن خدماتنا تعمل في منطقة جديدة، في حال كنت قد طلبت منا فعل
                ذلك.
              </Text>
              <Text style={styles.textJustify}>* لإرسال معلومات إليك عن منتجاتنا و خدماتنا و عروضنا الترويجية.</Text>
              <Text style={styles.textJustify}>
                * لتحليل نشاطك على المواقع حتى نتمكن من إدارة و دعم و تحسين و تطوير أعمالنا لأغراض إحصائية و تحليلية و
                لمساعدتنا على منع الاحتيال.
              </Text>
              <Text style={styles.textJustify}>
                * لفرض شروطنا التعاقدية معك و أي اتفاقية أخرى، و لممارسة أو الدفاع عن المطالبات القانونية و حماية حقوق
                سمارت فارما أو المستودعات الشريكة معنا أو مقدمي خدمات التوصيل أو غيرهم، بما في ذلك منع الاحتيال.
              </Text>
              <Text style={styles.textJustify}>
                * إذا قدمت تعليقات بشأن المواقع و الخدمات، فقد نستخدم هذة التعليقات في أي مواد تسويقية أو إعلانية. سوف
                نحدد هويتك لهذا الغرض فقط باسمك الأول و المدينة التي تعيش فيها.
              </Text>
              <Text style={styles.textJustify}>
                * في حال اخترت تلقي إعلانات من خلال تطبيق الهاتف المحمول الخاص بنا فسنرسل إليك إعلانات متعلقة بالخدمات
                التي طلبتها منا و معلومات حول خدماتنا و عروضنا.
              </Text>
            </View>

            <Text style={[styles.textJustify, styles.marginTop]}>
              سنقوم أيضا بتحليل البيانات المتعلقة باستخدامك لخدماتنا من بيانات موقعك لإنشاء ملفات تعريفية متعلقة بك و
              لك.{' '}
            </Text>

            <Text style={[styles.textJustify, styles.marginTop]}>
              هذا يعني أننا قد نضع بعض الافتراضات حول ما قد تهتم به و نستخدمه، لنرسل لك المزيد من الاتصالات التسويقية
              المصممة خصيصا لك، و لنقدم المستودعات التي نعتقد أنك تفضلها، أو لإعلامك بالعروض الخاصة أو المنتجات التي
              نعتقد أنك قد تكون مهتما بها. يشار إلى هذا النشاط باسم التنميط. لديك حقوق معينة فيما يتعلق بهذا النوع من
              المعالجة. الرجاء مراجعة قسم "حقوقك" أدناه لمزيد من المعلومات.{' '}
            </Text>

            <Text style={[styles.strong, styles.marginTop, styles.textJustify]}>
              عندما نكون ملزمين قانونيا بالقيام بذلك، يجوز لنا استخدام معلوماتك من أجل:
            </Text>

            <View style={styles.paddingStart}>
              <Text>* إنشاء سجل لطلبك. </Text>
              <Text>* الامتثال لأي التزام قانوني أو شروط تنظيمية نتعرض له.</Text>
            </View>

            <View style={styles.marginTop}>
              <Text style={[styles.textJustify]}>
                <Text style={styles.strong}>التسويق المباشر:</Text> في حال منحنا موافقتك أو عندما يكون لدينا سبب مبرر
                للقيام بذلك، سنستخدم معلوماتك لإعلامك بمنتجاتنا و خدماتنا الأخرى التي قد تهمك عن طريق البريد الإلكتروني
                أو الهاتف. يمكنك التحكم في تفضيلات التسويق عبر البريد الإلكتروني الخاصة بك من خلال: IP الذي تدخل منه الى
                مواقعنا.
              </Text>

              <View style={styles.paddingStart}>
                <Text>* تطبيق الهاتف المحمول </Text>
                <Text>* أو موقعنا على شبكة الإنترنت </Text>
              </View>
            </View>

            <View style={[styles.marginTop]}>
              <Text style={styles.textJustify}>
                <Text style={styles.strong}>الاحتفاظ بمعلوماتك :</Text> لن نحتفظ بمعلوماتك لفترة أطول مما نعتقد أنه
                ضروري. سيتم الاحتفاظ بالمعلومات التي نجمعها ما دامت هناك حاجة للوفاء بالأغراض الموضحة في قسم "استخدام
                المعلومات الخاصة بك" أعلاه بما يتماشى مع مصلحتنا المشروعة أو لفترة تشترطها على وجه التحديد اللوائح أو
                القوانين المعمول بها، مثل الحفاظ على المعلومات لأغراض التقارير التنظيمية.
              </Text>
            </View>

            <Text style={[styles.strong, styles.marginTop, styles.textJustify]}>
              عند تحديد فترات الاستبقاء ذات الصلة، سنأخذ في الاعتبار العوامل التالية:
            </Text>

            <View style={[styles.paddingStart]}>
              <Text style={styles.textJustify}>* التزامتنا و حقوقنا التعاقدية فيما يتعلق بالمعلومات المعنية. </Text>
              <Text style={styles.textJustify}>
                * التزامات قانونية بموجب القانون المعمول به بالاحتفاظ بالبيانات لفترة زمنية معينة
              </Text>
              <Text style={styles.textJustify}>* المنازعات المحتملة.</Text>
              <Text style={styles.textJustify}>
                * إرشادات صادرة عن الهيئة الوطنية لخدمات الشبكة والهيئات الحكومية ذات الصلة.
              </Text>
            </View>

            <Text style={[styles.textJustify, styles.marginTop]}>
              بخلاف ذلك، نقوم بمسح معلوماتك بشكل آمن حيث لم نعد نحتاج الى معلوماتك للأغراض التي تم جمعها
            </Text>

            <View style={styles.marginTop}>
              <Text style={[styles.textJustify]}>
                <Text style={styles.strong}>الكشف عن معلوماتك:</Text> سيتم نقل المعلومات التي نجمعها عنك و تخزينها على
                خوادمنا الموجودة داخل الجمهورية العربية السورية. نحن حريصون و شفافون للغاية بشأن من تتم مشاركة معلوماتك
                معه.
              </Text>
            </View>

            <Text style={[styles.strong, styles.marginTop, styles.textJustify]}>
              نحن نشارك معلوماتك مع مزودي خدمة الطرف الثالث. تشمل أنواع مزودي خدمة الجهات الخارجية الذين نشاركهم
              معلوماتك معهم:
            </Text>

            <View style={[styles.paddingStart]}>
              <Text style={styles.textJustify}>
                * المستودعات الشريكة: نقوم بتزويد المستودعات الشريكة بمعلوماتك عند قيامك بالطلب منهم حتى يتمكنوا من
                تلبية طلبك، أو لحل المشاكل أو تحسين خدماتهم.
              </Text>
              <Text style={styles.textJustify}>* مخدمي التوصيل: حتى يتمكنوا من توصيل الطلب لك.</Text>
              <Text style={styles.textJustify}>
                * موظفي قسم خدمة العملاء: من سيساعدنا على حل أي مشكلات قد تواجهك في خدماتنا.
              </Text>
              <Text style={styles.textJustify}>
                * شركاء التسويق و الإعلان: حتى يتمكنوا من التأكد من أنك ترى الإعلان الأكثر صلة بك و يرسلو إليك البريد
                الالكتروني و التسويق البريدي نيابة عنا. ستتخذ سمارت فارما جميع الخطوات اللازمة بشكل معقول لضمان التعامل
                مع بياناتك بشكل آمن ووفقا لسياسة الخصوصية هذه عند نقلها الى جهات خارجية. إذا دخل نشاطنا التجاري في مشروع
                مشترك مع كيان تجاري آخر أو تم شراؤه أو بيعه مع كيان تجاري آخر، فقد يتم الكشف عن معلوماتك أو نقلها الى
                الشركة المستهدفة أو شركاء أعمالنا الجدد أو مالكيها أو مستشاريهم
              </Text>
            </View>

            <Text style={[styles.strong, styles.marginTop]}>قد نشارك أيضا معلوماتك:</Text>

            <View style={[styles.paddingStart]}>
              <Text style={styles.textJustify}>
                * إذا كنا ملزمين بالكشف عن معلوماتك أو مشاركتها من أجل الامتثال ( و/ أو عندما نعتقد أننا ملزمون
                بالامتثال) لأي التزام قانوني أو أمر قضائي أو شرط تنظيمي. يتضمن ذلك تبادل المعلومات مع الشركات الأخرى و
                المؤسسات الأخرى لأغراض الحماية من الاحتيال و الوقاية منه.
              </Text>
              <Text style={styles.textJustify}>* من أجل إنفاذ شروطنا التعاقدية معك و أي اتفاقية أخرى.</Text>
              <Text style={styles.textJustify}>
                * لحماية حقوق سمارت فارما أو المستودعات الشريكة أو مقدمي خدمات التوصيل أو غيرهم، بما في ذلك منع
                الاحتيال.
              </Text>
              <Text style={styles.textJustify}>
                * ومع الأطراف الثالثة التي نعتبرها ضرورية بشكل معقول من أجل منع الجريمة، على سبيل المثال الضابطة
                العدلية.
              </Text>
            </View>

            <View style={styles.marginTop}>
              <Text style={[styles.textJustify]}>
                <Text style={styles.strong}>حقوقك:</Text> بموجب قانون تنظيم التواصل على الشبكة ومكافحة الجريمة
                المعلوماتية، قد يكون لديك عدد من الحقوق المتعلقة بالبيانات التي نحتفظ بها عنك. إذا كنت ترغب في ممارسة أي
                من هذه الحقوق، يرجى الاتصال بمسؤول حماية البيانات لدينا باستخدام تفاصيل الاتصال المذكورة أعلاه. للحصول
                على معلومات إضافية حول حقوقك يرجى مراجعة المرسوم التشريعي رقم 17 لعام 2012 والمتضمن قانون تنظيم التواصل
                على الشبكة ومكافحة الجريمة المعلوماتية .
              </Text>
            </View>

            <View style={styles.marginTop}>
              <Text style={[styles.textJustify]}>
                <Text style={styles.strong}>التغييرات في سياسة الخصوصية لدينا:</Text> سيتم نشر أي تغييرات تطرأ على سياسة
                الخصوصية الخاصة بنا على مواقعنا، عند الاقتضاء، سوف نخبرك بالتغييرات على سبيل المثال عن طريق البريد
                الالكتروني، أو باقي وسائل التواصل الإجتماعي وعبر خدمة العملاء.
              </Text>
            </View>

            <View style={styles.marginTop}>
              <Text style={[styles.textJustify]}>
                <Text style={styles.strong}>الشكاوى:</Text> إذا لم تكن راضيا عن ردنا على أي شكوى أو تعتقد أن معالجتنا
                لمعلوماتك لاتتوافق مع قانون تنظيم التواصل على الشبكة ومكافحة الجريمة المعلوماتية، يمكنك تقديم شكوى الى
                مكتب امن المعلومات باستخدام التفاصيل التالية: رقم الهاتف: 0956660333 عنوان البريد الالكتروني:
                <Text>smartpharma.sy@gmail.com</Text>
              </Text>
            </View>
          </View>
        </ScrollView>
        <Pressable style={[styles.button]} onPress={action}>
          <Text style={styles.textStyle}>{i18n.t('agree-license')}</Text>
        </Pressable>

        <Pressable style={[styles.button, styles.buttonClose]} onPress={close}>
          <Text style={styles.closeTextStyle}>{i18n.t('no-agree-license')}</Text>
        </Pressable>
      </View>
    </Modal>
  );
};

export default License;

const styles = StyleSheet.create({
  modalView: {
    margin: 20,
    marginBottom: 60,
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    height: '90%',
  },
  button: {
    borderRadius: 6,
    padding: 10,
    elevation: 2,
    backgroundColor: Colors.SUCCEEDED_COLOR,
    marginVertical: 5,
  },
  buttonClose: {
    backgroundColor: Colors.WHITE_COLOR,
    borderWidth: 1,
    borderColor: Colors.FAILED_COLOR,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  closeTextStyle: {
    color: Colors.FAILED_COLOR,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  header: {
    color: Colors.MAIN_COLOR,
    fontSize: 20,
    marginBottom: 10,
  },
  strong: {
    color: Colors.SUCCEEDED_COLOR,
    fontWeight: 'bold',
  },
  textJustify: {
    textAlign: 'justify',
  },
  paddingStart: {
    marginStart: 20,
  },
  marginTop: {
    marginTop: 10,
  },
});
