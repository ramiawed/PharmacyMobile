import React, { memo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

// redux stuff
import { useDispatch, useSelector } from 'react-redux';
import { selectUserData } from '../redux/auth/authSlice';
import { addStatistics } from '../redux/statistics/statisticsSlice';

// constants
import { Colors, UserTypeConstants } from '../utils/constants';

const AdvItemsContainer = ({ items }) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const { user, token } = useSelector(selectUserData);

  const selectItem = (item) => {
    if (user.type === UserTypeConstants.PHARMACY || user.type === UserTypeConstants.GUEST) {
      dispatch(
        addStatistics({
          obj: {
            sourceUser: user._id,
            targetItem: item._id,
            action: 'choose-item',
          },
          token,
        }),
      );
    }

    navigation.navigate('ItemDetails', {
      medicineId: item._id,
    });
  };

  return (
    <View style={styles.itemsContainer}>
      {items.map((item) => (
        <TouchableOpacity style={styles.item} onPress={() => selectItem(item)} key={item._id}>
          <View>
            <Text style={styles.itemName}>{item.name}</Text>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  itemsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    paddingVertical: 10,
  },
  item: {
    width: '45%',
    backgroundColor: Colors.WHITE_COLOR,
    margin: 5,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    borderRadius: 6,
    minHeight: 60,
  },
  itemName: {
    color: Colors.DARK_COLOR,
    textAlign: 'center',
    fontSize: 12,
  },
});

export default memo(AdvItemsContainer);
