import React, { memo, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';

// redux stuff
import { useDispatch, useSelector } from 'react-redux';
import { selectUserData } from '../redux/auth/authSlice';
import { selectItemsSectionThreeFromSettings } from '../redux/settings/settingsSlice';
import { getItemsSectionThree, selectItemsSectionThree } from '../redux/advertisements/itemsSectionThreeSlice';

// components
import LoadingData from './LoadingData';
import TitleAndDescription from './TitleAndDescription';
import AdvItemsContainer from './AdvItemsContainer';

const ItemsSectionThree = () => {
  const dispatch = useDispatch();

  const { token } = useSelector(selectUserData);
  const { show, title, description } = useSelector(selectItemsSectionThreeFromSettings);
  const { itemsSectionThree, itemsSectionThreeStatus } = useSelector(selectItemsSectionThree);

  useEffect(() => {
    if (show) {
      dispatch(getItemsSectionThree({ token }));
    }
  }, []);

  return show ? (
    itemsSectionThreeStatus === 'loading' ? (
      <LoadingData />
    ) : itemsSectionThree.length > 0 ? (
      <View style={{ ...styles.container }}>
        <TitleAndDescription title={title} desc={description} />
        <AdvItemsContainer items={itemsSectionThree} />
      </View>
    ) : null
  ) : null;
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#B56576',
    borderRadius: 6,
    marginVertical: 5,
    marginHorizontal: 10,
  },
});

export default memo(ItemsSectionThree);
