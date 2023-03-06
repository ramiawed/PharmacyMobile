import React from 'react';
import { View, StyleSheet } from 'react-native';

// components
import FilteredText from './FilteredText';

// constants
import { Colors } from '../utils/constants';

const ItemNames = ({ item, searchString }) => {
  return (
    <View style={styles.container}>
      <FilteredText searchText={searchString} value={item.name} style={styles.name} />
      <FilteredText searchText={searchString} value={item.nameAr} style={styles.nameAr} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'flex-start',
  },
  name: {
    color: Colors.DARK_COLOR,
    fontSize: 15,
    fontWeight: 'bold',
  },
  nameAr: {
    color: Colors.MAIN_COLOR,
    fontSize: 14,
  },
});

export default ItemNames;
