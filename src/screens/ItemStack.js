import React from 'react';

import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack';

// screens
import ItemsScreen from './ItemsScreen';
import CompaniesScreen from './CompaniesScreen';

const itemStack = createStackNavigator();

const ItemStack = () => {
  return (
    <itemStack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
      }}
    >
      <itemStack.Screen name="Companies" component={CompaniesScreen} />
      <itemStack.Screen name="Items" component={ItemsScreen} />
    </itemStack.Navigator>
  );
};

export default ItemStack;
