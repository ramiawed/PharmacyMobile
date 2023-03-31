import React from 'react';
import { View, StyleSheet, TextInput, Text, TouchableOpacity } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

// icons
import { AntDesign } from '@expo/vector-icons';

import { Colors } from '../utils/constants';

const SearchInput = ({ value, onTextChange, placeholder, onSubmitEditing, onKeyPress, focus, refrence }) => {
  useFocusEffect(
    React.useCallback(() => {
      if (refrence) refrence.current.focus();
    }, []),
  );

  return (
    <View style={{ ...styles.container }}>
      <TextInput
        autoCapitalize="none"
        autoCorrect={false}
        style={styles.inputText}
        value={value}
        onChangeText={onTextChange}
        onSubmitEditing={onSubmitEditing}
        onKeyPress={onKeyPress}
        // autoFocus={focus}
        // ref={refrence}
      />
      {placeholder?.length && value.trim().length === 0 && (
        <View
          style={{
            position: 'absolute',
            left: 10,
          }}
        >
          <Text style={{ color: Colors.SECONDARY_COLOR, fontSize: 12 }}>{placeholder}</Text>
        </View>
      )}
      {value.trim().length > 0 && (
        <TouchableOpacity>
          <AntDesign
            name="closecircleo"
            size={20}
            color={Colors.MAIN_COLOR}
            onPress={() => {
              onTextChange('');
              onSubmitEditing && onSubmitEditing();
            }}
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 6,
    padding: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputText: {
    writingDirection: 'rtl',
    textAlign: 'right',
    fontSize: 16,
    color: Colors.MAIN_COLOR,
    zIndex: 100,
    flex: 1,
  },
});

export default SearchInput;
