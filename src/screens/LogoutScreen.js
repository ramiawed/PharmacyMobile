import React, { useState } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import i18n from "../i18n";

// component
import Loader from "../components/Loader";

// redux stuff
import { useDispatch, useSelector } from "react-redux";
import { authSignWithToken, selectUserData } from "../redux/auth/authSlice";
import { unwrapResult } from "@reduxjs/toolkit";
import { addStatistics } from "../redux/statistics/statisticsSlice";
import { getAllSettings } from "../redux/settings/settingsSlice";
import { getFavorites } from "../redux/favorites/favoritesSlice";
import { getAllAdvertisements } from "../redux/advertisements/advertisementsSlice";
import { getSavedItems } from "../redux/savedItems/savedItemsSlice";

// constants
import { signoutHandler } from "../utils/functions";
import { Colors, UserTypeConstants, VERSION } from "../utils/constants";

const LogoutScreen = () => {
  const dispatch = useDispatch();

  // selectors
  const { token, user } = useSelector(selectUserData);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("login-with-token-error-msg");

  const loginHandler = () => {
    if (token) {
      setLoading(true);
      dispatch(authSignWithToken({ token, version: VERSION }))
        .then(unwrapResult)
        .then((result) => {
          dispatch(
            addStatistics({
              obj: {
                targetUser: result.data.user._id,
                action: "user-sign-in",
              },
              token: result.token,
            })
          );
          dispatch(getAllSettings({ token: result.token }));
          dispatch(getFavorites({ token: result.token }));
          dispatch(getAllAdvertisements({ token: result.token }));
          if (user.type === UserTypeConstants.PHARMACY) {
            dispatch(getSavedItems({ token: result.token }));
          }
          setLoading(false);
        })
        .catch((err) => {
          if (err.message == "update the app") {
            setErrorMsg("update the app");
          }
          setLoading(false);
        });
    }
  };

  const signout = () => {
    signoutHandler(dispatch, token);
  };

  return (
    <View style={styles.container}>
      <Image
        source={require("../../assets/logo.png")}
        style={{ width: 150, height: 150, resizeMode: "contain" }}
      />
      <Text style={styles.warningMsg}>{i18n.t(errorMsg)}</Text>
      <TouchableOpacity style={styles.checkBtn} onPress={loginHandler}>
        <Text style={styles.checkBtnText}>{i18n.t("try-again-label")}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.checkBtn} onPress={signout}>
        <Text style={styles.checkBtnText}>{i18n.t("nav-sign-out")}</Text>
      </TouchableOpacity>
      {loading && <Loader />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.WHITE_COLOR,
    justifyContent: "center",
    alignItems: "center",
  },
  warningMsg: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.MAIN_COLOR,
    marginVertical: 10,
    textAlign: "center",
  },
  version: {
    fontSize: 16,
    fontWeight: "bold",
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
});

export default LogoutScreen;
