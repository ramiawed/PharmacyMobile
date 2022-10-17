import React from 'react';
import { View, ScrollView, Text, Image, StyleSheet, RefreshControl } from 'react-native';

import i18n from '../i18n';
import { Colors } from '../utils/constants';

const NoContent = ({ refreshing, onRefreshing, msg }) => {
  return (
    <ScrollView
      contentContainerStyle={{
        width: '100%',
        height: '100%',
      }}
      refreshControl={
        onRefreshing ? (
          <RefreshControl
            //refresh control used for the Pull to Refresh
            refreshing={refreshing}
            onRefresh={onRefreshing}
          />
        ) : null
      }
    >
      <View style={styles.noContentContainer}>
        <Image source={require('../../assets/no-content.jpeg')} style={styles.noContentImage} />
        <Text style={styles.noContent}>{i18n.t(msg)}</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  noContentContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noContentImage: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
  },
  noContent: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.MAIN_COLOR,
  },
});

export default NoContent;
