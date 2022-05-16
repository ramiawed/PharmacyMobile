import React, { useState } from 'react';
import i18n from '../i18n';
import * as Updates from 'expo-updates';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';

// constants
import { Colors } from '../utils/constants';

const AboutScreen = () => {
  const [updateChecking, setUpdateChecking] = useState(false);

  const triggerUpdateCheck = async () => {
    try {
      const update = await Updates.checkForUpdateAsync();
      if (update.isAvailable) {
        await Updates.fetchUpdateAsync();
        await Updates.reloadAsync();
      }
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Image source={require('../../assets/logo.png')} style={{ width: 150, height: 150, resizeMode: 'contain' }} />
      <Text style={styles.appName}>{i18n.t('app-name')}</Text>
      <Text style={styles.version}>Version: 1.0.0</Text>
      <TouchableOpacity
        style={styles.checkBtn}
        onPress={async () => {
          setUpdateChecking(true);
          await triggerUpdateCheck();
          setUpdateChecking(false);
        }}
      >
        <Text style={styles.checkBtnText}>Check for updates</Text>
      </TouchableOpacity>
      <View style={{ flex: 1, justifyContent: 'flex-end', paddingBottom: 20 }}>
        <Text style={styles.developedBy}>Developed by: eng. Rami Awed</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.WHITE_COLOR,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  appName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.MAIN_COLOR,
    marginVertical: 10,
  },
  version: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.SECONDARY_COLOR,
  },
  checkBtn: {
    backgroundColor: Colors.SUCCEEDED_COLOR,
    padding: 10,
    borderRadius: 6,
    marginVertical: 10,
  },
  checkBtnText: {
    color: Colors.WHITE_COLOR,
  },
  developedBy: {
    color: Colors.SECONDARY_COLOR,
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default AboutScreen;
