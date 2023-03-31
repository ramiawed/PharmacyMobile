import React, { memo } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import i18n from '../i18n';
import { Colors } from '../utils/constants';

// components
import LabelValueRow from './LabelValueRow';

const OrderDetailsInfoBottomSheet = ({ orderDetails, computeTotalPrice, cancelAction, cancelLabel, header }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>{i18n.t(header)}</Text>
      <View style={styles.body}>
        <LabelValueRow label={i18n.t('pharmacy-name')} value={orderDetails.pharmacy.name} />
        <LabelValueRow label={i18n.t('user certificate name')} value={orderDetails.pharmacy.certificateName} />
        <LabelValueRow label={i18n.t('user address details')} value={orderDetails.pharmacy.addressDetails} />
        <LabelValueRow label={i18n.t('user mobile')} value={orderDetails.pharmacy.mobile} />
        <LabelValueRow label={i18n.t('warehouse-name')} value={orderDetails.warehouse.name} />
        <LabelValueRow label={i18n.t('date-label')} value={new Date(orderDetails.createdAt).toLocaleDateString()} />
        {computeTotalPrice && (
          <>
            <LabelValueRow label={i18n.t('total-invoice-price')} value={computeTotalPrice} />
          </>
        )}
      </View>
      <View style={styles.actions}>
        <TouchableOpacity
          onPress={cancelAction}
          style={{ ...styles.actionView, flex: 1, backgroundColor: Colors.FAILED_COLOR }}
        >
          <Text style={{ ...styles.actionText }}>{i18n.t(cancelLabel)}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.WHITE_COLOR,
    flexDirection: 'column',
  },
  actions: {
    width: '90%',
    flexDirection: 'row',
    alignItems: 'stretch',
    marginHorizontal: 20,
    marginBottom: 10,
  },
  actionView: {
    flex: 3,
    marginEnd: 10,
    flexDirection: 'row',
    backgroundColor: Colors.SUCCEEDED_COLOR,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 6,
  },
  actionText: {
    fontSize: 14,
    textAlign: 'center',
    color: Colors.WHITE_COLOR,
    paddingVertical: 10,
  },
  header: {
    backgroundColor: Colors.MAIN_COLOR,
    color: Colors.WHITE_COLOR,
    paddingVertical: 10,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  body: {
    paddingTop: 15,
    minHeight: 60,
    justifyContent: 'center',
  },
});

export default memo(OrderDetailsInfoBottomSheet);
