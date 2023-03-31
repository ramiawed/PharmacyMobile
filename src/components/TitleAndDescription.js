import React, { memo } from 'react';

import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../utils/constants';

const TitleAndDescription = ({ title, desc }) => {
  return (
    <View style={styles.container}>
      {title.length > 0 && <Text style={styles.title}>{title}</Text>}
      {desc.length > 0 && <Text style={styles.description}>{desc}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.DARK_COLOR,
    textAlign: 'center',
    paddingTop: 10,
  },
  description: {
    fontSize: 14,
    color: Colors.LIGHT_COLOR,
    textAlign: 'center',
  },
});

export default memo(TitleAndDescription);
