import React, { useCallback, useEffect, useState } from "react";
import i18n from "../i18n/index";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import axios from "axios";
// libraries
import { BottomSheet } from "react-native-btr";
import * as ImagePicker from "expo-image-picker";

// icons
import { EvilIcons } from "@expo/vector-icons";

// component
import Loader from "../components/Loader";
import ExpandedView from "../components/ExpandedView";
import UserInfoRow from "../components/UserInfoRow";
import AddToCart from "../components/AddToCart";
import ItemImage from "../components/ItemImage";

// redux stuff
import { unwrapResult } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import {
  addItemToWarehouse,
  removeItemFromWarehouse,
  selectMedicines,
} from "../redux/medicines/medicinesSlices";
import { selectUserData } from "../redux/auth/authSlice";

// icons
import { Ionicons, AntDesign } from "@expo/vector-icons";

// constants
import {
  BASEURL,
  checkItemExistsInWarehouse,
  Colors,
  UserTypeConstants,
} from "../utils/constants";
import ScreenWrapper from "./ScreenWrapper";

const ItemDetailsScreen = ({ route }) => {
  const { medicineId } = route.params;
  const dispatch = useDispatch();

  const { token, user } = useSelector(selectUserData);
  const { addToWarehouseStatus, removeFromWarehouseStatus } =
    useSelector(selectMedicines);

  const [refreshing, setRefreshing] = useState(false);
  const [showAddToCartModal, setShowAddToCartModal] = useState(false);
  const [item, setItem] = useState(null);

  const getItemFromDB = useCallback(() => {
    setItem(null);
    axios
      .get(`${BASEURL}/items/item/${medicineId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setItem(response.data.data.item);
        setRefreshing(false);
      })
      .catch((err) => {
        setRefreshing(false);
      });
  });

  const removeItemFromWarehouseHandler = () => {
    dispatch(
      removeItemFromWarehouse({
        obj: {
          itemId: item._id,
          warehouseId: user._id,
        },
        token,
      })
    )
      .then(unwrapResult)
      .then(() => getItemFromDB())
      .catch((err) => {});
  };

  const addItemToWarehouseHandler = () => {
    dispatch(
      addItemToWarehouse({
        obj: {
          itemId: item._id,
          warehouseId: user._id,
        },
        token,
      })
    )
      .then(unwrapResult)
      .then(() => getItemFromDB())
      .catch(() => {});
  };

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      const data = new FormData();

      let localUri = result.uri;
      let filename = localUri.split("/").pop();

      // Infer the type of the image
      let match = /\.(\w+)$/.exec(filename);
      let type = match ? `image/${match[1]}` : `image`;
      data.append("file", { uri: localUri, name: filename, type });

      const config = {
        headers: {
          "content-type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      };

      axios
        .post(`${BASEURL}/items/upload/${item._id}`, data, config)
        .then(() => {
          getItemFromDB();
        })
        .catch((err) => {});
    }
  };

  const onRefreshing = () => {
    setRefreshing(true);
    getItemFromDB();
  };

  useEffect(() => {
    if (medicineId) {
      getItemFromDB();
    }
  }, [medicineId]);

  return user ? (
    item ? (
      <ScreenWrapper>
        <View style={styles.container}>
          <ScrollView
            contentContainerStyle={{
              padding: 10,
              paddingBottom: 50,
            }}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefreshing}
              />
            }
          >
            <ItemImage item={item} />
            {(item.company._id === user._id ||
              user.type === UserTypeConstants.ADMIN) && (
              <TouchableOpacity
                style={{
                  backgroundColor: Colors.WHITE_COLOR,
                  alignItems: "center",
                }}
                onPress={pickImage}
              >
                <View style={styles.changeImageBtn}>
                  <EvilIcons
                    name="image"
                    size={24}
                    color={Colors.WHITE_COLOR}
                    style={{ paddingHorizontal: 4 }}
                  />
                  <Text style={{ color: Colors.WHITE_COLOR }}>
                    {i18n.t("change-logo")}
                  </Text>
                </View>
              </TouchableOpacity>
            )}
            {user.type === UserTypeConstants.PHARMACY &&
              item !== null &&
              checkItemExistsInWarehouse(item, user) && (
                <TouchableOpacity
                  style={{
                    backgroundColor: Colors.WHITE_COLOR,
                    alignItems: "center",
                  }}
                  onPress={() => {
                    setShowAddToCartModal(true);
                  }}
                >
                  <View style={styles.addBtn}>
                    <Ionicons
                      name="cart"
                      size={24}
                      color={Colors.WHITE_COLOR}
                      style={{ paddingHorizontal: 4 }}
                    />
                    <Text style={{ color: Colors.WHITE_COLOR }}>
                      {i18n.t("add-to-cart")}
                    </Text>
                  </View>
                </TouchableOpacity>
              )}

            {user.type === UserTypeConstants.WAREHOUSE &&
              (item.warehouses
                ?.map((w) => w.warehouse._id)
                .includes(user._id) ? (
                <TouchableOpacity
                  style={{
                    backgroundColor: Colors.WHITE_COLOR,
                    alignItems: "center",
                  }}
                  onPress={removeItemFromWarehouseHandler}
                >
                  <View
                    style={{
                      ...styles.addBtn,
                      backgroundColor: Colors.FAILED_COLOR,
                    }}
                  >
                    <AntDesign
                      name="delete"
                      size={24}
                      color={Colors.WHITE_COLOR}
                      style={{ paddingHorizontal: 4 }}
                    />
                    <Text style={{ color: Colors.WHITE_COLOR }}>
                      {i18n.t("remove-from-warehouse")}
                    </Text>
                  </View>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={{
                    backgroundColor: Colors.WHITE_COLOR,
                    alignItems: "center",
                  }}
                  onPress={addItemToWarehouseHandler}
                >
                  <View style={styles.addBtn}>
                    <Ionicons
                      name="add-circle"
                      size={24}
                      color={Colors.WHITE_COLOR}
                      style={{ paddingHorizontal: 4 }}
                    />
                    <Text style={{ color: Colors.WHITE_COLOR }}>
                      {i18n.t("add-to-warehouse")}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            <ExpandedView title={i18n.t("item-main-info")}>
              <UserInfoRow
                label={i18n.t("item-trade-name")}
                value={item.name}
                editable={false}
              />
              <UserInfoRow
                label={i18n.t("item-trade-name-ar")}
                value={item.nameAr}
                editable={false}
              />
              <UserInfoRow
                label={i18n.t("item-formula")}
                value={item.formula}
                editable={false}
              />
              <UserInfoRow
                label={i18n.t("item-caliber")}
                value={item.caliber}
                editable={false}
              />
              <UserInfoRow
                label={i18n.t("item-packing")}
                value={item.packing}
                editable={false}
              />
              {user.type === UserTypeConstants.ADMIN && (
                <UserInfoRow
                  label={i18n.t("item-barcode")}
                  value={item.barcode}
                  editable={false}
                />
              )}
            </ExpandedView>

            <ExpandedView title={i18n.t("item-price")}>
              {user.type !== UserTypeConstants.GUEST && (
                <UserInfoRow
                  label={i18n.t("item-price")}
                  value={item.price}
                  editable={false}
                />
              )}
              <UserInfoRow
                label={i18n.t("item-customer-price")}
                value={item.customer_price}
                editable={false}
              />
            </ExpandedView>

            <ExpandedView title={i18n.t("item-composition")}>
              <Text
                style={{
                  color: Colors.MAIN_COLOR,
                  fontSize: 14,
                  padding: 6,
                }}
              >
                {item.composition?.replace("+", " + ")}
              </Text>
            </ExpandedView>

            <ExpandedView title={i18n.t("item-indication")}>
              <Text
                style={{
                  color: Colors.MAIN_COLOR,
                  fontSize: 14,
                  padding: 6,
                }}
              >
                {item.indication.length > 0
                  ? item.indication.replace("+", " + ")
                  : i18n.t("empty-value")}
              </Text>
            </ExpandedView>
          </ScrollView>

          {(addToWarehouseStatus === "loading" ||
            removeFromWarehouseStatus === "loading") && <Loader />}

          <BottomSheet
            visible={showAddToCartModal}
            onBackButtonPress={() => setShowAddToCartModal(false)}
            onBackdropPress={() => setShowAddToCartModal(false)}
          >
            <AddToCart item={item} close={() => setShowAddToCartModal(false)} />
          </BottomSheet>
        </View>
      </ScreenWrapper>
    ) : (
      <Loader />
    )
  ) : (
    <></>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.WHITE_COLOR,
    width: "100%",
  },
  addBtn: {
    flexDirection: "row",
    backgroundColor: Colors.SUCCEEDED_COLOR,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 6,
    padding: 6,
    marginVertical: 5,
  },
  changeImageBtn: {
    flexDirection: "row",
    backgroundColor: Colors.SUCCEEDED_COLOR,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 6,
    padding: 6,
    marginVertical: 5,
  },
});

export default ItemDetailsScreen;
