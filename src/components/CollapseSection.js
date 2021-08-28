import i18n from '../i18n/index';
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, LayoutAnimation, Platform, UIManager } from 'react-native';
import { Colors } from '../utils/constants';
import PartnerFavoriteRow from './PartnerFavoriteRow';
import ItemFavoriteRow from './ItemFavoriteRow';

if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

function CollapseSection({ header, favorites, type }) {
  const [open, setopen] = useState(false);

  const onPress = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setopen(!open);
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
        (type === 'item' ? (
          <View>
            {favorites.map((favorite) => (
              <ItemFavoriteRow key={favorite._id} favorite={favorite} />
            ))}
          </View>
        ) : (
          <View>
            {favorites.map((favorite) => (
              <PartnerFavoriteRow key={favorite._id} type={type} favorite={favorite} />
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
    borderColor: Colors.SECONDARY_COLOR,
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: 10,
  },
  headerContainer: {
    backgroundColor: Colors.SECONDARY_COLOR,
    paddingVertical: 10,
    paddingHorizontal: 10,

    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  headerText: {
    color: '#fff',
    fontWeight: '900',
    fontSize: 18,
    flex: 1,
  },
  badge: {
    width: 32,
    height: 32,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
  },
  badgeText: {
    color: Colors.SECONDARY_COLOR,
    fontWeight: '700',
    fontSize: 16,
  },
});

export default CollapseSection;
