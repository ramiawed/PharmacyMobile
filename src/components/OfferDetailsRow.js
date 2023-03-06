import React from 'react';
import i18n from '../i18n';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, OfferTypes } from '../utils/constants';

const OfferDetailsRow = ({ offer, offerMode }) => {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{i18n.t('quantity-label')}</Text>
      <Text style={styles.value}>{offer.qty}</Text>
      <Text style={styles.label}>{i18n.t('after-quantity-label')}</Text>
      <Text style={styles.label}>
        {offerMode === OfferTypes.PIECES ? i18n.t('bonus-quantity-label') : i18n.t('bonus-percentage-label')}
      </Text>
      <Text style={styles.value}>{offer.bonus}</Text>
      <Text style={styles.label}>
        {offerMode === OfferTypes.PIECES
          ? i18n.t('after-bonus-quantity-label')
          : i18n.t('after-bonus-percentage-label')}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    padding: 4,
    backgroundColor: Colors.OFFER_COLOR,
    margin: 4,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  value: {
    fontSize: 16,
    borderRadius: 4,
    backgroundColor: Colors.WHITE_COLOR,
    color: Colors.FAILED_COLOR,
    marginHorizontal: 4,
    paddingHorizontal: 4,
    textAlign: 'center',
  },
  label: {
    color: Colors.DARK_COLOR,
    fontSize: 14,
    marginHorizontal: 4,
    textAlign: 'center',
  },
});

export default OfferDetailsRow;
