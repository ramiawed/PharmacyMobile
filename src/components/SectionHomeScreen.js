import React, { useEffect } from 'react';

import { View, StyleSheet, Text, FlatList, Dimensions } from 'react-native';

// components
import ItemCard from './ItemCard';
import PartnerCard from './PartnerCard';

// constants
import { Colors } from '../utils/constants';

const SectionHomeScreen = ({ data, containerBackground, headerBackground, header, description, type, order }) => {
  const windowHeight = Dimensions.get('window').height;

  return (
    <View
      style={{
        backgroundColor: containerBackground,
        height: (windowHeight - 140) / 2,
      }}
    >
      <View
        style={{
          backgroundColor: headerBackground,
          ...styles.headerContainer,
        }}
      >
        <Text style={styles.header}>{header}</Text>
        <Text style={styles.description}>{description}</Text>
      </View>

      <FlatList
        data={data}
        keyExtractor={(item) => item._id}
        contentContainerStyle={{
          padding: 10,
        }}
        horizontal={true}
        renderItem={({ item, index }) => {
          return type === 'company' ? (
            <PartnerCard partner={item} type="company" advertisement={true} />
          ) : (
            <ItemCard item={item} index={index} advertisement={true} />
          );
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    color: Colors.WHITE_COLOR,
    fontWeight: '700',
    fontSize: 24,
    textAlign: 'center',
  },
  description: {
    color: Colors.WHITE_COLOR,
    fontWeight: '400',
    fontSize: 16,
    textAlign: 'center',
  },
  headerContainer: {
    marginVertical: 5,
    marginHorizontal: 15,
    borderRadius: 6,
    paddingVertical: 5,
  },
});

export default SectionHomeScreen;
