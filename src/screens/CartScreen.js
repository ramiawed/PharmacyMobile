import React from "react";
import { View, StyleSheet, ScrollView } from "react-native";

// redux stuff
import { useSelector } from "react-redux";
import { selectUser } from "../redux/auth/authSlice";
import { selectCartWarehouse } from "../redux/cart/cartSlice";

// components
import CartWarehouse from "../components/CartWarehouse";
import NoContent from "../components/NoContent";

// constants
import { Colors } from "../utils/constants";
import ScreenWrapper from "./ScreenWrapper";

const CartScreen = () => {
  // selectors
  // get the logged user from redux store
  const user = useSelector(selectUser);
  // get the cart warehouses from redux store
  const cartWarehouse = useSelector(selectCartWarehouse);

  return user ? (
    <ScreenWrapper>
      <View style={styles.container}>
        {cartWarehouse.length > 0 && (
          <ScrollView
            contentContainerStyle={{
              width: "100%",
            }}
          >
            <View>
              {cartWarehouse.map((w, index) => (
                <CartWarehouse warehouse={w} key={index} index={index} />
              ))}
            </View>
          </ScrollView>
        )}

        {cartWarehouse.length === 0 && <NoContent msg="empty-cart" />}
      </View>
    </ScreenWrapper>
  ) : null;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.WHITE_COLOR,
    width: "100%",
    paddingBottom: 50,
  },
  noContentContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  noContent: {
    paddingTop: 25,
    fontSize: 18,
    fontWeight: "500",
    color: Colors.SECONDARY_COLOR,
  },
  noContentImage: {
    width: 200,
    height: 200,
    resizeMode: "contain",
  },
});

export default CartScreen;
