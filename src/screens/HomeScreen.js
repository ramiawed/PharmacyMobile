import React from 'react';
import i18n from '../i18n/index';
import { View, Text, TextInput, ScrollView } from 'react-native';

// redux stuff
import { useSelector } from 'react-redux';

// component
import SearchHome from '../components/SearchHome';
import { selectSettings } from '../redux/settings/settingsSlice';
import { selectCompaniesSectionOne } from '../redux/advertisements/companiesSectionOneSlice';
import { selectCompaniesSectionTwo } from '../redux/advertisements/companiesSectionTwoSlice';
import { selectItemsSectionOne } from '../redux/advertisements/itemsSectionOneSlice';
import { selectItemsSectionTwo } from '../redux/advertisements/itemsSectionTwoSlice';
import { selectItemsSectionThree } from '../redux/advertisements/itemsSectionThreeSlice';

const HomeScreen = () => {
  const { companiesSectionOne, companiesSectionOneStatus } = useSelector(selectCompaniesSectionOne);
  const { companiesSectionTwo, companiesSectionTwoStatus } = useSelector(selectCompaniesSectionTwo);
  const { itemsSectionOne, itemsSectionOneStatus } = useSelector(selectItemsSectionOne);
  const { itemsSectionTwo, itemsSectionTwoStatus } = useSelector(selectItemsSectionTwo);
  const { itemsSectionThree, itemsSectionThreeStatus } = useSelector(selectItemsSectionThree);
  const { settings } = useSelector(selectSettings);

  return (
    <ScrollView>
      <SearchHome />
    </ScrollView>
  );
};

export default HomeScreen;
