import React, { useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Colors } from '../utils/constants';
import { Feather } from '@expo/vector-icons';

const SearchContainer = ({ children, searchAction }) => {
  let childrenArray = React.Children.toArray(children);
  const [moreSearchOptions, setMoreSearchOptions] = useState(false);

  return (
    <View style={styles.container}>
      <View style={{ flex: 1 }}>
        <>
          {childrenArray[0]}

          {moreSearchOptions && childrenArray.length > 1
            ? childrenArray.map((child, index) => {
                if (index > 0)
                  return (
                    <View key={index}>
                      <View style={{ width: '100%', height: 10 }}></View>
                      {child}
                    </View>
                  );
                return null;
              })
            : null}
        </>
      </View>
      {childrenArray.length > 1 && (
        <Feather
          style={{
            marginTop: 5,
          }}
          name="more-vertical"
          size={24}
          color={Colors.WHITE_COLOR}
          onPress={() => {
            setMoreSearchOptions(!moreSearchOptions);
          }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.SECONDARY_COLOR,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
});

export default SearchContainer;
