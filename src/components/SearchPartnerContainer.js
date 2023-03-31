import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import i18n from '../i18n';
import { BottomSheet } from 'react-native-btr';

// redux stuff
import { useDispatch, useSelector } from 'react-redux';
import { selectCompanies } from '../redux/company/companySlice.js';
import { selectWarehouses } from '../redux/warehouse/warehousesSlice.js';
import { Colors, UserTypeConstants } from '../utils/constants';

import SelectPartnerBottomSheet from './SelectPartnerBottomSheet';

import { Ionicons } from '@expo/vector-icons';

const SearchPartnerContainer = ({ label, partners, addId, removeId, partnerType, action }) => {
  const dispatch = useDispatch();

  const { companies } = useSelector(selectCompanies);
  const { warehouses } = useSelector(selectWarehouses);

  const [showChoosePartnerModal, setShowChoosePartnerModal] = useState(false);
  return (
    <>
      <View style={styles.container}>
        <View style={styles.partnerContainer}>
          {partners?.length > 0 ? (
            partners?.map((partner) => (
              <View key={partner.value} style={styles.partner}>
                <Text style={styles.name}>{partner.label}</Text>

                <Ionicons
                  name="close"
                  size={24}
                  color={Colors.FAILED_COLOR}
                  style={{ paddingHorizontal: 2, marginVertical: 4 }}
                  onPress={() => {
                    dispatch(removeId(partner.value));
                    if (action) action();
                  }}
                />
              </View>
            ))
          ) : (
            <Text style={styles.placeholder}>
              {partnerType === UserTypeConstants.WAREHOUSE ? i18n.t('choose-warehouse') : i18n.t('choose-company')}
            </Text>
          )}
        </View>
        <Ionicons
          name="add-circle"
          size={28}
          color={Colors.SUCCEEDED_COLOR}
          onPress={() => {
            setShowChoosePartnerModal(true);
          }}
        />
      </View>

      <BottomSheet
        visible={showChoosePartnerModal}
        onBackButtonPress={() => setShowChoosePartnerModal(false)}
        onBackdropPress={() => setShowChoosePartnerModal(false)}
      >
        <SelectPartnerBottomSheet
          header={`${partnerType === UserTypeConstants.WAREHOUSE ? 'choose-warehouse' : 'choose-company'}`}
          close={() => setShowChoosePartnerModal(false)}
          chooseAction={(data) => {
            dispatch(addId({ value: data._id, label: data.name }));
            if (action) action();
          }}
          placeholder={`${partnerType === UserTypeConstants.WAREHOUSE ? 'enter warehouse name' : 'enter company name'}`}
          data={partnerType === UserTypeConstants.WAREHOUSE ? warehouses : companies}
        />
      </BottomSheet>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.WHITE_COLOR,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 6,
    padding: 5,
  },
  partnerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    flex: 1,
  },
  placeholder: {
    color: Colors.MAIN_COLOR,
  },
  partner: {
    borderWidth: 1,
    borderColor: Colors.LIGHT_GREY_COLOR,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 5,
    marginEnd: 5,
    borderRadius: 4,
    marginBottom: 5,
  },
});

export default SearchPartnerContainer;
