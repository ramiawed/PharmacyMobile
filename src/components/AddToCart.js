import i18n from "../i18n/index";
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import CheckBox from "expo-checkbox";

// redux stuff
import { useDispatch, useSelector } from "react-redux";
import { selectUserData } from "../redux/auth/authSlice";
import { addItemToCart } from "../redux/cart/cartSlice";
import { addStatistics } from "../redux/statistics/statisticsSlice";
import { selectMedicines } from "../redux/medicines/medicinesSlices";
import { removeSavedItem } from "../redux/savedItems/savedItemsSlice";

// constants
import { Colors, OfferTypes } from "../utils/constants";

const checkOfferQty = (selectedWarehouse, qty) => {
  // check if the specified warehouse has an offer
  if (selectedWarehouse.offer.offers.length > 0) {
    // through all the offers, check if the entered quantity has an offer
    for (let i = 0; i < selectedWarehouse.offer.offers.length; i++) {
      // check if the entered quantity has an offer
      if (qty >= selectedWarehouse.offer.offers[i].qty) {
        // if it has return:
        // 1- mode of the offer (pieces, percentage)
        // 2- bonus
        // 2-1: if the mode is pieces return the bonus * (entered qty / bonus qty)
        // 2-2: if the mode is percentage return the bonus
        if (selectedWarehouse.offer.mode === OfferTypes.PERCENTAGE) {
          return selectedWarehouse.offer.offers[i].bonus;
        } else {
          return (
            selectedWarehouse.offer.offers[i].bonus +
            checkOfferQty(
              selectedWarehouse,
              qty - selectedWarehouse.offer.offers[i].qty
            )
          );
        }
      }
    }
  }

  return 0;
};

const AddToCart = ({ item, close, fromSavedItems }) => {
  const dispatch = useDispatch();

  // selectors
  const { token, user } = useSelector(selectUserData);
  // const { selectedWarehouse: sWarehouse } = useSelector(selectWarehouses);
  const {
    pageState: { searchWarehouseId: sWarehouse },
  } = useSelector(selectMedicines);

  // build the warehouse option array that contains this item
  // get all the warehouse that contains this item
  // put asterisk after warehouse name if the warehouse has an offer
  const itemWarehousesOption = item.warehouses
    .filter((w) => w.warehouse.city === user.city && w.warehouse.isActive)
    .map((w) => {
      const asterisk = w.offer.offers.length > 0 ? "*" : "";
      return {
        label: `${w.warehouse.name} ${asterisk}`,
        value: w.warehouse._id,
      };
    });

  // select the first warehouse in the list
  const [selectedWarehouse, setSelectedWarehouse] = useState(
    sWarehouse !== null
      ? item.warehouses
          .filter((w) => w.warehouse.city === user.city && w.warehouse.isActive)
          .find((w) => w.warehouse._id == sWarehouse)
      : item.warehouses.filter(
          (w) => w.warehouse.city === user.city && w.warehouse.isActive
        )[0]
  );

  const [offer, setOffer] = useState(
    sWarehouse !== null
      ? item.warehouses
          .filter((w) => w.warehouse.city === user.city && w.warehouse.isActive)
          .find((w) => w.warehouse._id == sWarehouse).offer
      : item.warehouses.filter(
          (w) => w.warehouse.city === user.city && w.warehouse.isActive
        )[0].offer
  );
  const [qty, setQty] = useState("");
  const [qtyError, setQtyError] = useState(false);
  const [selectedWarehouseError, setSelectedWarehouseError] = useState(false);

  const handleWarehouseChange = (val) => {
    setSelectedWarehouse(item.warehouses.find((w) => w.warehouse._id == val));
    setOffer(item.warehouses.find((w) => w.warehouse._id == val).offer);
  };

  const handleAddItemToCart = () => {
    if (!selectedWarehouse) {
      setSelectedWarehouseError(true);
      return;
    }

    if (qty.length === 0) {
      setQtyError(true);
      return;
    }

    if (selectedWarehouse.maxQty !== 0 && qty > selectedWarehouse.maxQty) {
      setQtyError(true);
      return;
    }

    const bonusQty = checkOfferQty(selectedWarehouse, qty);

    dispatch(
      addItemToCart({
        item: item,
        warehouse: selectedWarehouse,
        qty: qty,
        bonus: bonusQty > 0 ? bonusQty : null,
        bonusType: bonusQty > 0 ? selectedWarehouse.offer.mode : null,
      })
    );

    dispatch(
      addStatistics({
        obj: {
          sourceUser: user._id,
          targetItem: item._id,
          action: "item-added-to-cart",
        },
        token,
      })
    );

    if (fromSavedItems) {
      dispatch(removeSavedItem({ obj: { savedItemId: item._id }, token }));
    }

    close();
  };

  return (
    <View
      style={{
        backgroundColor: Colors.WHITE_COLOR,
      }}
    >
      <Text style={styles.header}>{i18n.t("add-to-cart")}</Text>
      <View style={styles.body}>
        <View
          style={{
            ...styles.availableWarehouseView,
            borderBottomColor: selectedWarehouseError
              ? Colors.FAILED_COLOR
              : "#e3e3e3",
          }}
        >
          <Text style={{ color: Colors.SUCCEEDED_COLOR, fontWeight: "bold" }}>
            {i18n.t("available-warehouses")}
          </Text>
          {itemWarehousesOption.map((opt) => (
            <View key={opt.value} style={styles.warehouseView}>
              <CheckBox
                value={selectedWarehouse.warehouse._id === opt.value}
                onValueChange={() => handleWarehouseChange(opt.value)}
              />
              <Text
                style={{
                  marginStart: 10,
                  color: Colors.MAIN_COLOR,
                  fontWeight: "bold",
                }}
              >
                {opt.label}
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.row}>
          <Text style={styles.rowLabel}>{i18n.t("item-max-qty")}</Text>
          <Text style={{ fontSize: 14, color: Colors.MAIN_COLOR }}>
            {selectedWarehouse.maxQty === 0
              ? i18n.t("no-limit-qty")
              : selectedWarehouse.maxQty}
          </Text>
        </View>
        <View
          style={{
            ...styles.row,
            borderBottomColor: qtyError ? Colors.FAILED_COLOR : "#e3e3e3",
          }}
        >
          <Text style={styles.rowLabel}>{i18n.t("selected-qty")}</Text>
          <TextInput
            value={qty}
            onChangeText={(val) => {
              setQty(val);
              setQtyError(false);
            }}
            style={styles.selectedQty}
            keyboardType="number-pad"
            maxLength={3}
          />
        </View>
      </View>

      {offer?.offers.length > 0 &&
        offer.offers.map((o, index) => (
          <View style={styles.offerRow} key={index}>
            <View style={styles.offerRowFirst}>
              <Text style={styles.label}>{i18n.t("quantity-label")}</Text>
              <Text style={styles.value}>{o.qty}</Text>
              <Text style={styles.label}>{i18n.t("after-quantity-label")}</Text>
            </View>
            <View style={styles.offerRowSecond}>
              <Text style={styles.label}>
                {offer.mode === OfferTypes.PIECES
                  ? i18n.t("bonus-quantity-label")
                  : i18n.t("bonus-percentage-label")}
              </Text>
              <Text style={styles.value}>{o.bonus}</Text>
              <Text style={styles.label}>
                {offer.mode === OfferTypes.PIECES
                  ? i18n.t("after-bonus-quantity-label")
                  : i18n.t("after-bonus-percentage-label")}
              </Text>
            </View>
          </View>
        ))}

      <View style={styles.actions}>
        <TouchableOpacity
          onPress={handleAddItemToCart}
          style={{
            ...styles.actionView,
            flex: 3,
            backgroundColor: Colors.SUCCEEDED_COLOR,
          }}
        >
          <Ionicons
            name="cart"
            size={24}
            color={Colors.WHITE_COLOR}
            style={{ marginEnd: 10 }}
          />
          <Text style={{ ...styles.actionText }}>{i18n.t("add-to-cart")}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={close}
          style={{
            ...styles.actionView,
            flex: 1,
            backgroundColor: Colors.FAILED_COLOR,
          }}
        >
          <Text style={{ ...styles.actionText }}>{i18n.t("cancel-label")}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  textInput: {
    width: "90%",
    marginHorizontal: 10,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.SECONDARY_COLOR,
  },
  row: {
    backgroundColor: Colors.WHITE_COLOR,
    width: "90%",
    borderBottomWidth: 1,
    borderBottomColor: "#e3e3e3",
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  offerRow: {
    backgroundColor: Colors.OFFER_COLOR,
    width: "90%",
    borderWidth: 1,
    borderRadius: 15,
    padding: 10,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    marginBottom: 10,
    borderColor: "#e3e3e3",
    marginHorizontal: 20,
  },
  offerRowFirst: {
    flexDirection: "row",
  },
  offerRowSecond: {
    flexDirection: "row",
  },
  value: {
    color: Colors.FAILED_COLOR,
    marginHorizontal: 10,
    fontWeight: "bold",
  },
  label: {
    color: Colors.GREY_COLOR,
  },
  rowLabel: {
    fontSize: 12,
    fontWeight: "bold",
    marginEnd: 10,
    color: Colors.GREY_COLOR,
    width: 85,
  },
  actions: {
    width: "90%",
    flexDirection: "row",
    alignItems: "stretch",
    marginHorizontal: 20,
    marginBottom: 10,
  },
  actionView: {
    flex: 3,
    marginEnd: 10,
    flexDirection: "row",
    backgroundColor: Colors.SUCCEEDED_COLOR,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 6,
  },
  actionText: {
    fontSize: 14,
    textAlign: "center",
    color: Colors.WHITE_COLOR,
    paddingVertical: 10,
  },
  header: {
    backgroundColor: Colors.MAIN_COLOR,
    color: Colors.WHITE_COLOR,
    paddingVertical: 20,
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  body: {
    alignItems: "center",
    paddingTop: 10,
  },
  selectedQty: {
    flex: 1,
    writingDirection: "rtl",
    textAlign: "right",
    color: Colors.MAIN_COLOR,
  },
  availableWarehouseView: {
    backgroundColor: Colors.WHITE_COLOR,
    width: "90%",
    borderBottomWidth: 1,
    borderBottomColor: "#e3e3e3",
    padding: 10,
    flexDirection: "column",
    alignItems: "center",
    marginBottom: 10,
  },
  warehouseView: {
    flexDirection: "row",
    justifyContent: "flex-start",
    width: "100%",
    marginVertical: 5,
  },
});

export default AddToCart;
