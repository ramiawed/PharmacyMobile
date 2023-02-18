import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Colors } from '../utils/constants';
import { FontAwesome } from '@expo/vector-icons';

const SearchContainer = ({ children }) => {
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
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            width: 40,
            height: 32,
          }}
        >
          <FontAwesome
            style={styles.moreOptionsIcons}
            name="filter"
            size={32}
            color={Colors.WHITE_COLOR}
            onPress={() => {
              setMoreSearchOptions(!moreSearchOptions);
            }}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.LIGHT_COLOR,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  moreOptionsIcons: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default SearchContainer;
