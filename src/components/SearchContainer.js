import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Colors } from '../utils/constants';
import { Feather } from '@expo/vector-icons';

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
        <Feather
          style={styles.moreOptionsIcons}
          name="more-vertical"
          size={32}
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
  moreOptionsIcons: {
    marginTop: 3,
    width: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default SearchContainer;
