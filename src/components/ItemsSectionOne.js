import React, { memo, useEffect } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';

// redux stuff
import { useDispatch, useSelector } from 'react-redux';
import { selectUserData } from '../redux/auth/authSlice';
import { selectItemsSectionOneFromSettings } from '../redux/settings/settingsSlice';
import { getItemsSectionOne, selectItemsSectionOne } from '../redux/advertisements/itemsSectionOneSlice';

// constants
import LoadingData from './LoadingData';
import TitleAndDescription from './TitleAndDescription';
import AdvItemsContainer from './AdvItemsContainer';

const ItemsSectionOne = () => {
  const dispatch = useDispatch();

  const { token } = useSelector(selectUserData);
  const { show, title, description } = useSelector(selectItemsSectionOneFromSettings);
  const { itemsSectionOne, itemsSectionOneStatus } = useSelector(selectItemsSectionOne);

  useEffect(() => {
    if (show) {
      dispatch(getItemsSectionOne({ token }));
    }
  }, []);

  return show ? (
    itemsSectionOneStatus === 'loading' ? (
      <LoadingData />
    ) : itemsSectionOne.length > 0 ? (
      <View style={styles.container}>
        <TitleAndDescription title={title} desc={description} />
        {itemsSectionOne?.length > 0 && (
          <FlatList
            data={itemsSectionOne}
            keyExtractor={(item) => item._id}
            horizontal={true}
            renderItem={({ item }) => <AdvItemsContainer item={item} />}
          />
        )}

        {/* <AdvItemsContainer items={itemsSectionOne} /> */}
      </View>
    ) : null
  ) : null;
};

const styles = StyleSheet.create({
  container: {
    // backgroundColor: '#6D597A',
    borderRadius: 6,
    marginVertical: 5,
    marginHorizontal: 10,
    padding: 10,
  },
});

export default memo(ItemsSectionOne);
