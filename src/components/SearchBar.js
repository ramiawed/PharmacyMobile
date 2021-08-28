import i18n from '../i18n/index';
import React from 'react';
import { TextInput, StyleSheet, View, Platform } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import { Colors } from '../utils/constants';

const SearchBar = ({ value, textChangedHandler, clearText, onSubmit, placeholder }) => {
  return (
    <View style={styles.container}>
      <FontAwesome name="search" size={24} color={Colors.SECONDARY_COLOR} />
      <TextInput
        style={styles.searchInput}
        placeholder={i18n.t(placeholder)}
        value={value}
        onChangeText={textChangedHandler}
        onSubmitEditing={onSubmit}
      />
      {value?.length > 0 && (
        <AntDesign name="closecircle" size={24} color={Colors.SECONDARY_COLOR} onPress={clearText} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    alignItems: 'center',
    height: 50,
    marginHorizontal: 20,
    marginTop: Platform.OS === 'ios' ? 40 : 20,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: Colors.SECONDARY_COLOR,
    paddingHorizontal: 10,
  },
  searchInput: {
    flex: 1,
    marginHorizontal: 10,
    writingDirection: 'rtl',
  },
});

export default SearchBar;
