import React from 'react';

import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack';

// screens
import MedicinesScreen from './MedicinesScreen';
import MedicineScreen from './MedicineScreen';

const medicineStack = createStackNavigator();

const MedicinesStack = () => {
  return (
    <medicineStack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
      }}
    >
      <medicineStack.Screen
        name="AllMedicines"
        component={MedicinesScreen}
        initialParams={{ companyId: null, warehouseId: null }}
      />
      <medicineStack.Screen name="Medicine" component={MedicineScreen} />
    </medicineStack.Navigator>
  );
};

export default MedicinesStack;
