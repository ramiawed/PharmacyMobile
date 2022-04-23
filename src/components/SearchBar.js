import i18n from '../i18n/index';
import React from 'react';
import { TextInput, StyleSheet, View, Platform } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { Colors } from '../utils/constants';

const SearchBar = ({ value, textChangedHandler, clearText, onSubmit, placeholder }) => {
  return (
    <View style={styles.container}>
      <View>
        <TextInput
          style={styles.searchInput}
          placeholder={i18n.t(placeholder)}
          value={value}
          onChangeText={textChangedHandler}
          onSubmitEditing={onSubmit}
        />
        {value?.length > 0 && <AntDesign name="closecircle" size={24} color={Colors.MAIN_COLOR} onPress={clearText} />}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: Colors.SECONDARY_COLOR,
    alignItems: 'center',
    // height: 50,
    // marginHorizontal: 20,
    // marginTop: Platform.OS === 'ios' ? 10 : 10,
    marginBottom: Platform.OS === 'ios' ? 10 : 10,
    // borderRadius: 6,
    // borderWidth: 1,
    // borderColor: Colors.SECONDARY_COLOR,
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  searchInput: {
    flex: 1,
    writingDirection: 'rtl',
    borderWidth: 1,
    borderColor: Colors.WHITE_COLOR,
    padding: 6,
    backgroundColor: Colors.WHITE_COLOR,
    borderRadius: 6,
  },
});

export default SearchBar;
