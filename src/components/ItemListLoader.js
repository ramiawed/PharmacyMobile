import * as React from 'react';
import { View, StyleSheet, useWindowDimensions } from 'react-native';
import { Colors } from '../utils/constants';
import { SkeletonLoader } from './SkeletonLoader';

const backgroundColor = Colors.SECONDARY_COLOR;
const highlightColor = 'white';

export const ItemListLoader = () => {
  return (
    <SkeletonLoader backgroundColor={backgroundColor} highlightColor={highlightColor}>
      <View style={styles.container}>
        {new Array(10).fill(null).map((_, index) => (
          <Item key={index} />
        ))}
      </View>
    </SkeletonLoader>
  );
};

const Item = () => {
  const { width } = useWindowDimensions();
  return (
    <View style={styles.row}>
      <View style={styles.image} />
      <View>
        <View style={[styles.line, { width: width * 0.6 }]} />
        <View style={[styles.line, { width: width * 0.4 }]} />
        <View style={[styles.line, { width: width * 0.2 }]} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  image: {
    height: 100,
    width: 100,
    backgroundColor: backgroundColor,
    marginRight: 10,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 40,
  },
  line: {
    height: 20,
    marginBottom: 10,
    backgroundColor: backgroundColor,
  },
});
