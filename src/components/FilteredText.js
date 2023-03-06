import React from 'react';

import { Text, StyleSheet } from 'react-native';

const FilteredText = ({ value, searchText, style }) => {
  const arraySplit = searchText
    ? value.toLowerCase().includes(searchText.toLowerCase())
      ? value.toLowerCase().split(searchText.toLowerCase())
      : []
    : [];

  return (
    <>
      {arraySplit.length > 0 ? (
        <Text style={{ ...style }}>
          {arraySplit[0].toUpperCase()}
          <Text
            style={{
              ...styles.highlight,
            }}
          >
            {searchText.toUpperCase()}
          </Text>
          {arraySplit[1].toUpperCase()}
        </Text>
      ) : (
        <Text style={{ ...style }}>{value}</Text>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  highlight: {
    backgroundColor: '#FCDA00',
    color: '#FF0000',
    borderRadius: 4,
    fontWeight: 'bold',
  },
});

export default FilteredText;
