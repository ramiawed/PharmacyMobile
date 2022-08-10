import React from 'react';

import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack';
import OrdersScreen from '../screens/OrdersScreen';
import OrderDetailsScreen from '../screens/OrderDetailsScreen';

// screens

const ordersStack = createStackNavigator();

const OrdersStack = () => {
  return (
    <ordersStack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
      }}
    >
      <ordersStack.Screen name="allOrders" component={OrdersScreen} initialParams={{type: 'order'}} />
      <ordersStack.Screen name="Order" component={OrderDetailsScreen} />
    </ordersStack.Navigator>
  );
};

export default OrdersStack;
