import i18n from "../i18n/index";
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  LayoutAnimation,
  Platform,
  UIManager,
} from "react-native";

// constants
import { Colors } from "../utils/constants";

// components
import PartnerFavoriteRow from "./PartnerFavoriteRow";
import ItemFavoriteRow from "./ItemFavoriteRow";

if (Platform.OS === "android") {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

function CollapseSection({ header, favorites, type, isOpen }) {
  const [open, setOpen] = useState(isOpen);

  const onPress = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setOpen(!open);
  };

  return (
    <TouchableOpacity style={[styles.item]} activeOpacity={1}>
      <TouchableOpacity style={styles.headerContainer} onPress={onPress}>
        <Text style={styles.headerText}>{i18n.t(header)}</Text>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{favorites.length}</Text>
        </View>
      </TouchableOpacity>

      {open &&
        (type === "item" ? (
          <View>
            {favorites.map((favorite) => (
              <ItemFavoriteRow key={favorite._id} favorite={favorite} />
            ))}
          </View>
        ) : (
          <View>
            {favorites.map((favorite) => (
              <PartnerFavoriteRow
                key={favorite._id}
                type={type}
                favorite={favorite}
              />
            ))}
          </View>
        ))}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  item: {
    marginHorizontal: 10,
    borderWidth: 1,
    borderColor: "#e3e3e3",
    borderRadius: 6,
    overflow: "hidden",
    marginBottom: 10,
  },
  headerContainer: {
    backgroundColor: Colors.MAIN_COLOR,
    paddingVertical: 5,
    paddingHorizontal: 10,

    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  headerText: {
    color: Colors.WHITE_COLOR,
    fontWeight: "900",
    fontSize: 18,
    flex: 1,
  },
  badge: {
    width: 24,
    height: 24,
    backgroundColor: Colors.WHITE_COLOR,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 6,
  },
  badgeText: {
    color: Colors.MAIN_COLOR,
    fontSize: 10,
  },
});

export default CollapseSection;
