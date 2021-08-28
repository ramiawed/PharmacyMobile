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

import { AntDesign } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { addFavorite, removeFavorite, selectFavoritesPartners } from '../redux/favorites/favoritesSlice';
import { statisticsCompanySelected, statisticsUserFavorites } from '../redux/statistics/statisticsSlice';
import { Colors, baseUrl, UserTypeConstants } from '../utils/constants';
import { selectUserData } from '../redux/auth/authSlice';
import { unwrapResult } from '@reduxjs/toolkit';
import { setSelectedCompany } from '../redux/companyItems/companyItemsSlices';

const SPACING = 20;
const AVATAR_SIZE = 70;

const CompanyCard = ({ company, navigation }) => {
  const dispatch = useDispatch();

  const { token, user } = useSelector(selectUserData);
  const favorites = useSelector(selectFavoritesPartners);

  const [changeFavoriteLoading, setChangeFavoriteLoading] = useState(false);

  // method to handle add company to user's favorite
  const addCompanyToFavorite = () => {
    // check the internet connection
    // if (!isOnline) {
    //   dispatch(changeOnlineMsg());
    //   return;
    // }

    setChangeFavoriteLoading(true);

    dispatch(addFavorite({ obj: { favoriteId: company._id }, token }))
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
    // check the internet connection

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
    if (user.type === UserTypeConstants.PHARMACY || user.type === UserTypeConstants.NORMAL) {
      dispatch(
        statisticsCompanySelected({
          obj: { companyId: company._id },
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
        navigation.navigate('Items', { companyId: company._id });
      }}
    >
      <Animated.View
        style={{
          ...styles.animatedView,
          flex: 1,
          marginHorizontal: 4,
          // opacity,
          // transform: [{ scale }],
        }}
      >
        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
          {company.logo_url && company.logo_url.length !== 0 ? (
            <Image
              source={{ uri: `${baseUrl}/${company.logo_url}` }}
              style={{ width: AVATAR_SIZE, height: AVATAR_SIZE, borderRadius: AVATAR_SIZE }}
            />
          ) : (
            <Image
              source={{ uri: `${baseUrl}/Adacard 201627116290082.png` }}
              style={{ width: AVATAR_SIZE, height: AVATAR_SIZE, borderRadius: AVATAR_SIZE }}
            />
          )}
        </View>

        <View>
          <Text style={styles.title}>{company.name}</Text>
        </View>

        <TouchableWithoutFeedback onPress={() => {}}>
          <View style={styles.favoriteIcon}>
            {changeFavoriteLoading ? (
              <ActivityIndicator size="small" color={Colors.YELLOW_COLOR} />
            ) : favorites && favorites.map((favorite) => favorite._id).includes(company?._id) ? (
              <AntDesign
                name="star"
                size={24}
                color={Colors.YELLOW_COLOR}
                onPress={() => removeCompanyFromFavorite(company._id)}
              />
            ) : (
              <AntDesign
                name="staro"
                size={24}
                color={Colors.YELLOW_COLOR}
                onPress={() => addCompanyToFavorite(company._id)}
              />
            )}
          </View>
        </TouchableWithoutFeedback>
      </Animated.View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
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
  searchInput: {
    borderWidth: 1,
    borderColor: Colors.SECONDARY_COLOR,
    backgroundColor: Colors.MAIN_COLOR,
    borderRadius: 6,
    margin: SPACING,
    marginBottom: 10,
    marginTop: Platform.OS === 'ios' ? SPACING * 2 : SPACING,
    padding: Platform.OS === 'ios' ? 10 : 5,
    writingDirection: 'rtl',
  },

  title: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.MAIN_COLOR,
    textAlign: 'center',
  },

  noContent: {
    fontSize: 18,
    fontWeight: '500',
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
});

export default CompanyCard;
