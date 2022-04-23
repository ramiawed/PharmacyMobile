import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableWithoutFeedback, LayoutAnimation, Platform, UIManager } from 'react-native';
import { Colors } from '../utils/constants';

if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

const ExpandedView = ({ title, children, danger }) => {
  const [expanded, setExpanded] = useState(true);

  const onPress = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded(!expanded);
  };

  return (
    <View style={{ ...styles.container, borderColor: danger ? Colors.FAILED_COLOR : Colors.GREY_COLOR }}>
      <TouchableWithoutFeedback onPress={onPress}>
        <Text
          style={{
            ...styles.header,
            backgroundColor: danger ? Colors.FAILED_COLOR : Colors.MAIN_COLOR,
          }}
        >
          {title}
        </Text>
      </TouchableWithoutFeedback>
      {expanded && children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: Colors.GREY_COLOR,
    width: '95%',
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: 10,
  },
  header: {
    backgroundColor: Colors.MAIN_COLOR,
    color: Colors.WHITE_COLOR,
    padding: 10,
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default ExpandedView;
