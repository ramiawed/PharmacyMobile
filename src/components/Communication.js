import React from "react";

import { View, StyleSheet, Linking, Text } from "react-native";

import { FontAwesome5 } from "@expo/vector-icons";
import { Colors } from "../utils/constants";
import i18n from "../i18n";

const Communication = () => {
  const openApp = (url) => {
    Linking.openURL(url)
      .then(() => {})
      .catch(() => {
        alert("تأكد من تنزيل البرنامج المحدد.");
      });
  };

  return (
    <View style={{ alignItems: "center", marginTop: 20 }}>
      <Text
        style={{
          fontSize: 16,
          color: Colors.DARK_COLOR,
          fontWeight: "bold",
          textDecorationLine: "underline",
        }}
      >
        {i18n.t("for-communication")}
      </Text>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          paddingTop: 10,
          paddingBottom: 50,
          // paddingVertical: 30,
        }}
      >
        <FontAwesome5
          name="facebook"
          size={36}
          color="#4267B2"
          style={{ marginHorizontal: 5 }}
          onPress={() => {
            openApp("fb://Smart-Pharma-106820748580558/");
          }}
        />
        <FontAwesome5
          name="whatsapp"
          size={36}
          color="#128C7E"
          style={{ marginHorizontal: 5 }}
          onPress={() =>
            openApp("whatsapp://send?text=" + "" + "&phone=+963956660333")
          }
        />
        <FontAwesome5
          name="instagram"
          size={36}
          color="#F56040"
          style={{ marginHorizontal: 5 }}
          onPress={() =>
            openApp(
              "https://www.instagram.com/p/CZsAC7Rrocc/?utm_medium=copy_link"
            )
          }
        />
        <FontAwesome5
          name="telegram"
          size={36}
          color="#229ED9"
          style={{ marginHorizontal: 5 }}
          onPress={() => openApp("https://t.me/+8SM-2Zfg8fcyNDdk")}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({});

export default Communication;
