import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Colors } from "../utils/constants";

const SignupStagesNumber = ({ stage, stagesArray }) => {
  return (
    <View style={styles.container}>
      {stagesArray.map((element, index) => (
        <View
          key={index}
          style={[
            styles.element,
            {
              backgroundColor:
                stage === element
                  ? Colors.OFFER_COLOR
                  : stage > element
                  ? Colors.SUCCEEDED_COLOR
                  : Colors.SECONDARY_COLOR,
              borderRadius: 6,
            },
          ]}
        >
          <Text style={styles.elementText}>{element}</Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
    width: "90%",
  },
  element: {
    width: 32,
    height: 32,
    dispaly: "flex",
    alignItems: "center",
    justifyContent: "center",
    // borderRadius: 16,
    marginHorizontal: 5,
  },
  elementText: {
    color: Colors.WHITE_COLOR,
    fontSize: 14,
    fontWeight: "bold",
  },
});

export default SignupStagesNumber;
