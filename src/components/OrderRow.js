import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import { t } from "i18n-js";
import { View, Text, StyleSheet, TouchableWithoutFeedback } from "react-native";

// libraries
import { BottomSheet } from "react-native-btr";

// components
import ConfirmBottomSheet from "../components/ConfirmBottomSheet";

// redux stuff
import { useSelector } from "react-redux";
import { selectUserData } from "../redux/auth/authSlice";

// icons
import { AntDesign } from "@expo/vector-icons";

// constants
import {
  Colors,
  OrdersStatusOptions,
  UserTypeConstants,
} from "../utils/constants";

const OrderRow = ({ order, deleteAction, type }) => {
  const navigation = useNavigation();

  const { user } = useSelector(selectUserData);

  const [showDeleteConfirmBts, setShowDeleteConfirmBts] = useState(false);

  const rowClickHandler = () => {
    if (type === "normal") {
      navigation.navigate("OrderDetails", {
        orderId: order._id,
      });
    } else {
      navigation.navigate("BasketOrderDetails", {
        orderId: order._id,
      });
    }
  };

  return order ? (
    <View style={styles.container}>
      <TouchableWithoutFeedback
        style={{
          ...styles.details,
          borderStartWidth: user.type === UserTypeConstants.ADMIN ? 0 : 1,
        }}
        onPress={() => rowClickHandler(order._id)}
      >
        <View style={styles.details}>
          {(user.type === UserTypeConstants.ADMIN ||
            user.type === UserTypeConstants.WAREHOUSE) && (
            <View style={{ ...styles.row, ...styles.withBottomBorder }}>
              <Text style={styles.name}>{order.pharmacy?.name}</Text>
            </View>
          )}

          {(user.type === UserTypeConstants.ADMIN ||
            user.type === UserTypeConstants.WAREHOUSE) && (
            <View style={{ ...styles.row, ...styles.withBottomBorder }}>
              <Text style={styles.address}>
                {order.pharmacy?.addressDetails}
              </Text>
            </View>
          )}

          {(user.type === UserTypeConstants.ADMIN ||
            user.type === UserTypeConstants.PHARMACY) && (
            <View style={{ ...styles.row, ...styles.withBottomBorder }}>
              <Text style={styles.name}>{order.warehouse?.name}</Text>
            </View>
          )}

          <View style={{ ...styles.date, ...styles.withBottomBorder }}>
            <Text style={styles.dateText}>
              {order.createdAt?.split("T")[0]}
            </Text>
          </View>

          <View style={{ ...styles.row, ...styles.center }}>
            <Text style={styles.status}>{t(order.status)}</Text>
            {order.status === OrdersStatusOptions.WILL_DONT_SERVER && (
              <Text style={styles.status}>
                {order.couldNotDeliverDate.split("T")[0]}
              </Text>
            )}
            {order.status === OrdersStatusOptions.CONFIRM && (
              <Text style={styles.status}>
                {order.confirmDate.split("T")[0]}
              </Text>
            )}
            {order.status === OrdersStatusOptions.DELIVERY && (
              <Text style={styles.status}>
                {order.deliverDate?.split("T")[0]}{" "}
                {order.deliverTime
                  ? `---${t("time-label")}: ${order.deliverTime}`
                  : ""}
              </Text>
            )}
            {order.status === OrdersStatusOptions.SHIPPING && (
              <Text style={styles.status}>
                {order.shippedDate
                  ? order.shippedDate.split("T")[0]
                  : t("shipped-done")}
                {order.shippedTime
                  ? `---${t("time-label")}: ${order.shippedTime}`
                  : ""}
              </Text>
            )}
          </View>
        </View>
      </TouchableWithoutFeedback>

      {user.type !== UserTypeConstants.WAREHOUSE ? (
        <View style={styles.actions}>
          <AntDesign
            name="delete"
            size={20}
            color={Colors.FAILED_COLOR}
            onPress={() => setShowDeleteConfirmBts(true)}
          />
        </View>
      ) : null}

      <BottomSheet
        visible={showDeleteConfirmBts}
        onBackButtonPress={() => setShowDeleteConfirmBts(false)}
        onBackdropPress={() => setShowDeleteConfirmBts(false)}
      >
        <ConfirmBottomSheet
          okLabel="ok-label"
          cancelLabel="cancel-label"
          header="delete-order-confirm-header"
          message="delete-order-confirm-msg"
          cancelAction={() => setShowDeleteConfirmBts(false)}
          okAction={() => deleteAction(order._id)}
        />
      </BottomSheet>
    </View>
  ) : null;
};

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: Colors.LIGHT_GREY_COLOR,
    flexDirection: "column",
    padding: 5,
    marginBottom: 10,
    borderRadius: 6,
    overflow: "hidden",
  },
  details: {
    paddingHorizontal: 10,
    flex: 1,
  },
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    flex: 1,
    paddingVertical: 5,
  },
  name: {
    color: Colors.MAIN_COLOR,
    fontWeight: "bold",
    flex: 1,
    fontSize: 16,
  },
  address: {
    color: Colors.SUCCEEDED_COLOR,
    fontSize: 14,
    fontWeight: "bold",
    flex: 1,
  },
  date: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    flex: 1,
    paddingVertical: 5,
  },
  dateText: {
    color: Colors.DARK_COLOR,
  },
  actions: {
    position: "absolute",
    top: 10,
    right: 10,
    alignItems: "center",
    justifyContent: "space-around",
    paddingStart: 10,
    borderStartColor: Colors.LIGHT_GREY_COLOR,
    borderStartWidth: 1,
  },
  withBottomBorder: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.LIGHT_GREY_COLOR,
  },
  status: {
    color: Colors.SUCCEEDED_COLOR,
    fontWeight: "bold",
    textAlign: "center",
  },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
});

export default OrderRow;
