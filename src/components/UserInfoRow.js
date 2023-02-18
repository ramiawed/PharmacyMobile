import React from "react";
import i18n from "../i18n/index";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

import { Feather } from "@expo/vector-icons";

// constants
import { Colors } from "../utils/constants";

const UserInfoRow = ({
  label,
  value,
  action,
  editable,
  withoutBottomBorder,
}) => {
  return (
    <View
      style={{ ...styles.row, borderBottomWidth: withoutBottomBorder ? 0 : 1 }}
    >
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
      {editable && (
        <Feather
          name="edit"
          size={24}
          color={Colors.DARK_COLOR}
          onPress={action}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    width: "100%",
    paddingHorizontal: 5,
    flexDirection: "row",
    alignItems: "center",
    borderBottomColor: "#e3e3e3",
    flexWrap: "wrap",
    overflow: "hidden",
    paddingVertical: 10,
  },
  value: {
    flex: 1,
    color: Colors.MAIN_COLOR,
    fontSize: 16,
    fontWeight: "bold",
    marginStart: 5,
    writingDirection: "rtl",
    textAlign: "left",
  },
  label: {
    width: 100,
    color: Colors.GREY_COLOR,
    fontSize: 14,
  },
  button: {
    backgroundColor: Colors.SUCCEEDED_COLOR,
    color: Colors.WHITE_COLOR,
    padding: 5,
    borderRadius: 6,
  },
});

export default UserInfoRow;
