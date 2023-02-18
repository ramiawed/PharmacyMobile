import React, { useState } from 'react';
import i18n from '../i18n';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity } from 'react-native';

// icons
import { Ionicons } from '@expo/vector-icons';

// constants
import { Colors } from '../utils/constants';

function SelectPartnerBottomSheet({ close, chooseAction, header, placeholder, data }) {
  // own state
  const [searchName, setSearchName] = useState('');

  let filteredData = data.filter((d) => {
    if (searchName.trim().length > 0) {
      return d.name.includes(searchName.trim());
    }
    return true;
  });

  const select = (data) => {
    close();
    chooseAction(data);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>{i18n.t(header)}</Text>
      <View>
        <TextInput
          style={styles.searchInput}
          value={searchName}
          onChangeText={(text) => setSearchName(text)}
          placeholder={i18n.t(placeholder)}
        />
      </View>

      <ScrollView>
        {filteredData?.length > 0 && filteredData.map((d) => <Row key={d._id} data={d} select={select} />)}

        {filteredData.length === 0 && searchName.length === 0 && (
          <Text style={styles.msg}>{i18n.t('search-for-company')}</Text>
        )}

        {filteredData.length === 0 && searchName.length !== 0 && (
          <Text style={styles.msg}>{i18n.t('search-empty')}</Text>
        )}
      </ScrollView>
      <View style={styles.actions}>
        <TouchableOpacity onPress={close} style={{ ...styles.actionView, backgroundColor: Colors.FAILED_COLOR }}>
          <Text style={{ ...styles.actionText }}>{i18n.t('close-label')}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const Row = ({ data, select }) => {
  const selectPartner = () => {
    select(data);
  };

  return (
    <View style={styles.companyRow}>
      <Text style={styles.companyName}>{data.name}</Text>

      <Ionicons name="add-circle" size={36} color={Colors.SUCCEEDED_COLOR} onPress={selectPartner} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    maxHeight: '90%',
    minHeight: 150,
    backgroundColor: Colors.WHITE_COLOR,
  },
  header: {
    backgroundColor: Colors.MAIN_COLOR,
    color: Colors.WHITE_COLOR,
    paddingVertical: 20,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  companyRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: Colors.LIGHT_GREY_COLOR,
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 20,
    marginVertical: 5,
  },
  companyName: {
    fontSize: 16,
    color: Colors.DARK_COLOR,
    fontWeight: 'bold',
  },
  searchInput: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.DARK_COLOR,
    marginHorizontal: 20,
    paddingVertical: 5,
    fontSize: 20,
    writingDirection: 'rtl',
    textAlign: 'center',
  },
  msg: {
    textAlign: 'center',
    fontSize: 20,
    color: Colors.MAIN_COLOR,
    marginVertical: 10,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'stretch',
    marginHorizontal: 20,
    marginVertical: 10,
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
});

export default SelectPartnerBottomSheet;
