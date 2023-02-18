import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback, useState } from "react";
import { View, Text, StyleSheet, Image, ScrollView } from "react-native";
import Loader from "../components/Loader";
import axios from "axios";

// redux stuff
import { useSelector } from "react-redux";
import { selectToken } from "../redux/auth/authSlice";

// constants
import { BASEURL, Colors, SERVER_URL } from "../utils/constants";
import ScreenWrapper from "./ScreenWrapper";

const NotificationDetailsScreen = ({ route }) => {
  const { notificationId } = route.params;

  const token = useSelector(selectToken);

  const [notification, setNotification] = useState(null);

  const getNotification = async () => {
    const response = await axios.get(
      `${BASEURL}/notifications/${notificationId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setNotification(response.data.data.notification);
  };

  useFocusEffect(
    useCallback(() => {
      // Do something when the screen is focused
      getNotification();
      return () => {};
    }, [])
  );

  return notification ? (
    <ScreenWrapper>
      <View style={styles.container}>
        <View style={styles.imageContainer}>
          {notification.logo_url && notification.logo_url.length !== 0 ? (
            <Image
              source={{
                uri: `${SERVER_URL}/notifications/${notification.logo_url}`,
              }}
              style={styles.image}
            />
          ) : (
            <Image
              source={require("../../assets/logo.png")}
              style={styles.image}
            />
          )}
        </View>
        <Text style={styles.header}>{notification.header}</Text>
        <ScrollView contentContainerStyle={styles.bodyScrollView}>
          <View>
            <Text style={styles.body}>{notification.body}</Text>
          </View>
        </ScrollView>
      </View>
    </ScreenWrapper>
  ) : (
    <Loader />
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    flex: 1,
    backgroundColor: Colors.WHITE_COLOR,
  },
  imageContainer: {
    padding: 15,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: 200,
    height: 200,
    resizeMode: "contain",
  },
  header: {
    color: Colors.SUCCEEDED_COLOR,
    textDecorationLine: "underline",
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    padding: 10,
  },
  bodyScrollView: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  body: {
    color: Colors.MAIN_COLOR,
    fontSize: 16,
    textAlign: "justify",
    lineHeight: 32,
  },
});

export default NotificationDetailsScreen;
