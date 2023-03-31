import React, { memo, useEffect } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';

// redux stuff
import { useDispatch, useSelector } from 'react-redux';
import { selectUserData } from '../redux/auth/authSlice';
import { selectItemsSectionTwoFromSettings } from '../redux/settings/settingsSlice';
import { getItemsSectionTwo, selectItemsSectionTwo } from '../redux/advertisements/itemsSectionTwoSlice';

// components
import TitleAndDescription from './TitleAndDescription';
import AdvItemsContainer from './AdvItemsContainer';
import LoadingData from './LoadingData';

const ItemsSectionTwo = () => {
  const dispatch = useDispatch();

  const { token } = useSelector(selectUserData);
  const { show, title, description } = useSelector(selectItemsSectionTwoFromSettings);
  const { itemsSectionTwo, itemsSectionTwoStatus } = useSelector(selectItemsSectionTwo);

  useEffect(() => {
    if (show) {
      dispatch(getItemsSectionTwo({ token }));
    }
  }, []);

  return show ? (
    itemsSectionTwoStatus === 'loading' ? (
      <LoadingData />
    ) : itemsSectionTwo.length > 0 ? (
      <View style={styles.container}>
        <TitleAndDescription title={title} desc={description} />
        {itemsSectionTwo?.length > 0 && (
          <FlatList
            data={itemsSectionTwo}
            keyExtractor={(item) => item._id}
            horizontal={true}
            renderItem={({ item }) => <AdvItemsContainer item={item} />}
          />
        )}
      </View>
    ) : null
  ) : null;
};

const styles = StyleSheet.create({
  container: {
    // backgroundColor: '#915F78',
    borderRadius: 6,
    marginVertical: 5,
    marginHorizontal: 10,
  },
});

export default memo(ItemsSectionTwo);
