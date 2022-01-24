import React, { useState } from 'react';

import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableWithoutFeedback,
  Platform,
  Animated,
  ActivityIndicator,
} from 'react-native';

import { useNavigation } from '@react-navigation/native';

import { AntDesign } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { addFavorite, removeFavorite, selectFavoritesPartners } from '../redux/favorites/favoritesSlice';
import { statisticsCompanySelected, statisticsUserFavorites } from '../redux/statistics/statisticsSlice';
import { Colors, baseUrl, UserTypeConstants } from '../utils/constants';
import { selectUserData } from '../redux/auth/authSlice';
import { unwrapResult } from '@reduxjs/toolkit';
import { resetMedicines } from '../redux/medicines/medicinesSlices';

const SPACING = 20;
const AVATAR_SIZE = 70;

const PartnerCard = ({ partner, type, advertisement }) => {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const { token, user } = useSelector(selectUserData);
  const favorites = useSelector(selectFavoritesPartners);

  const [changeFavoriteLoading, setChangeFavoriteLoading] = useState(false);

  // method to handle add company to user's favorite
  const addCompanyToFavorite = () => {
    setChangeFavoriteLoading(true);

    dispatch(addFavorite({ obj: { favoriteId: partner._id }, token }))
      .then(unwrapResult)
      .then(() => {
        setChangeFavoriteLoading(false);
        dispatch(statisticsUserFavorites({ obj: { userId: user._id }, token }));
      })
      .catch(() => {
        setChangeFavoriteLoading(false);
      });
  };

  // method to handle remove company from user's favorite
  const removeCompanyFromFavorite = (id) => {
    setChangeFavoriteLoading(true);

    dispatch(removeFavorite({ obj: { favoriteId: id }, token }))
      .then(unwrapResult)
      .then(() => {
        setChangeFavoriteLoading(false);
      })
      .catch(() => setChangeFavoriteLoading(false));
  };

  const dispatchCompanySelectedHandler = () => {
    // if the user type is pharmacy or normal, change the selectedCount
    // and selectedDates for this company
    if (type === 'company' && (user.type === UserTypeConstants.PHARMACY || user.type === UserTypeConstants.GUEST)) {
      dispatch(
        statisticsCompanySelected({
          obj: { companyId: partner._id },
          token,
        }),
      );
    }
  };

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        dispatchCompanySelectedHandler();
        // dispatch(setSelectedCompany(company._id));
        dispatch(resetMedicines());
        navigation.navigate('Medicines', {
          screen: 'AllMedicines',
          params: {
            companyId: type === 'company' ? partner._id : null,
            warehouseId: type === 'warehouse' ? partner._id : null,
          },
        });
      }}
    >
      <Animated.View
        style={{
          ...styles.animatedView,
          flex: 1,
          marginHorizontal: 4,
        }}
      >
        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
          {partner.logo_url && partner.logo_url.length !== 0 ? (
            <Image
              source={{ uri: `${baseUrl}/${partner.logo_url}` }}
              style={advertisement ? styles.logoLarge : styles.logo}
            />
          ) : (
            <Image
              source={{ uri: `${baseUrl}/Adacard 201627116290082.png` }}
              style={advertisement ? styles.logoLarge : styles.logo}
            />
          )}
        </View>

        <View>
          <Text style={styles.title}>{partner.name}</Text>
        </View>

        <TouchableWithoutFeedback onPress={() => {}}>
          <View style={styles.favoriteIcon}>
            {changeFavoriteLoading ? (
              <ActivityIndicator size="small" color={Colors.YELLOW_COLOR} />
            ) : favorites && favorites.map((favorite) => favorite._id).includes(partner?._id) ? (
              <AntDesign
                name="star"
                size={24}
                color={Colors.YELLOW_COLOR}
                onPress={() => removeCompanyFromFavorite(partner._id)}
              />
            ) : (
              <AntDesign
                name="staro"
                size={24}
                color={Colors.YELLOW_COLOR}
                onPress={() => addCompanyToFavorite(partner._id)}
              />
            )}
          </View>
        </TouchableWithoutFeedback>
      </Animated.View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  animatedView: {
    padding: SPACING,
    marginBottom: SPACING,
    backgroundColor: 'rgba(255,255,255, 1)',
    borderRadius: 12,
    shadowColor: Colors.SECONDARY_COLOR,
    shadowOffset: {
      width: 0,
      height: 7,
    },
    shadowOpacity: 0.43,
    shadowRadius: 9.51,

    elevation: 25,
  },

  title: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.MAIN_COLOR,
    textAlign: 'center',
  },

  favoriteIcon: {
    position: 'absolute',
    top: 0,
    end: 0,
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 70,
    height: 70,
    borderRadius: 70,
  },
  logoLarge: {
    width: 130,
    height: 130,
    borderRadius: 130,
  },
});

export default PartnerCard;
