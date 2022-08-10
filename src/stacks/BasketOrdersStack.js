import React from 'react';

import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack';

// screens
import OrdersScreen from '../screens/OrdersScreen';
import BasketOrderDetailsScreen from '../screens/BasketOrderDetailsScreen';

const ordersStack = createStackNavigator();

const BasketOrdersStack = () => {
  return (
    <ordersStack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
      }}
    >
      <ordersStack.Screen name="allBasketOrders" component={OrdersScreen} initialParams={{type: 'basket'}} />
      <ordersStack.Screen name="BasketOrder" component={BasketOrderDetailsScreen} />
    </ordersStack.Navigator>
  );
};

export default BasketOrdersStack;
