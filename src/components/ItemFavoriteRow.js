import React, { useState } from "react";

import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
} from "react-native";

// libraries
import { BottomSheet } from "react-native-btr";

// components
import AddToCart from "./AddToCart";

// redux stuff
import { selectUserData } from "../redux/auth/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { removeFavoriteItem } from "../redux/favorites/favoritesSlice";

// navigation stuff
import { useNavigation } from "@react-navigation/native";

// constants
import {
  checkItemExistsInWarehouse,
  Colors,
  UserTypeConstants,
} from "../utils/constants";

// icons
import { AntDesign, Ionicons } from "@expo/vector-icons";

const ItemFavoriteRow = ({ favorite }) => {
  const navigation = useNavigation();
  const { token, user } = useSelector(selectUserData);
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);
  const [showAddToCartModal, setShowAddToCartModal] = useState(false);

  const canAddToCart =
    user.type === UserTypeConstants.PHARMACY &&
    checkItemExistsInWarehouse(favorite, user);

  // method to handle remove company from user's favorite
  const removeItemFromFavorite = () => {
    setLoading(true);

    dispatch(
      removeFavoriteItem({ obj: { favoriteItemId: favorite._id }, token })
    );
  };

  const goToItemScreen = (id) => {
    navigation.navigate("ItemDetails", {
      medicineId: id,
    });
  };

  return (
    <>
      <View key={favorite._id} style={styles.row}>
        <View style={{ flex: 1, justifyContent: "space-between" }}>
          <View>
            <Text
              style={{
                ...styles.name,
                fontSize:
                  favorite.name.length >= 35
                    ? 14
                    : favorite.name.length > 25
                    ? 14
                    : 18,
              }}
              onPress={() => goToItemScreen(favorite._id)}
            >
              {favorite.name}
            </Text>
          </View>
          <View>
            <Text style={styles.companyName}>{favorite.company.name}</Text>
          </View>
          <View>
            {favorite.caliber ? (
              <Text style={styles.caliber}>{favorite.caliber}</Text>
            ) : (
              <></>
            )}
          </View>
        </View>

        {canAddToCart && (
          <Ionicons
            name="cart"
            size={32}
            color={Colors.SUCCEEDED_COLOR}
            style={{ paddingHorizontal: 2 }}
            onPress={() => setShowAddToCartModal(true)}
          />
        )}
        {loading ? (
          <ActivityIndicator size="small" color={Colors.YELLOW_COLOR} />
        ) : (
          <AntDesign
            name="star"
            size={32}
            color={Colors.YELLOW_COLOR}
            onPress={() => removeItemFromFavorite(favorite._id)}
          />
        )}
      </View>

      <BottomSheet
        visible={showAddToCartModal}
        onBackButtonPress={() => setShowAddToCartModal(false)}
        onBackdropPress={() => setShowAddToCartModal(false)}
      >
        <AddToCart item={favorite} close={() => setShowAddToCartModal(false)} />
      </BottomSheet>
    </>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    writingDirection: "rtl",
    padding: 10,
    borderBottomWidth: 1,
    borderColor: "rgba(0, 0, 0, .1)",
  },
  name: {
    fontSize: 18,
    color: Colors.MAIN_COLOR,
    flex: 1,
    textAlign: "left",
  },
  companyName: {
    fontSize: 14,
    color: Colors.SUCCEEDED_COLOR,
    fontWeight: "bold",
    marginVertical: 4,
    textAlign: "left",
  },
  caliber: {
    textAlign: "left",
    fontSize: 12,
    fontWeight: "bold",
    color: Colors.SECONDARY_COLOR,
  },
});

export default ItemFavoriteRow;
