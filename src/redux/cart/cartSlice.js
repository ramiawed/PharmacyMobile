import { createSlice } from '@reduxjs/toolkit';
import { OfferTypes } from '../../utils/constants';

const initialState = {
  cartWarehouse: [],
  cartItems: [],
};

const calculateOfferQty = (selectedWarehouse, qty) => {
  // check if the specified warehouse has an offer
  if (selectedWarehouse.offers.length > 0) {
    // through all the offers, check if the entered quantity has an offer
    for (let i = 0; i < selectedWarehouse.offers.length; i++) {
      // check if the entered quantity has an offer
      if (qty >= selectedWarehouse.offers[i].qty) {
        // if it has return:
        // 1- mode of the offer (pieces, percentage)
        // 2- bonus
        // 2-1: if the mode is pieces return the bonus * (entered qty / bonus qty)
        // 2-2: if the mode is percentage return the bonus
        if (selectedWarehouse.offerMode === OfferTypes.PERCENTAGE) {
          return selectedWarehouse.offers[i].bonus;
        } else {
          return (
            selectedWarehouse.offers[i].bonus +
            calculateOfferQty(selectedWarehouse, qty - selectedWarehouse.offers[i].qty)
          );
        }
      }
    }
  }

  return 0;
};

const calculatePoints = (selectedWarehouse, qty) => {
  // check if the specified warehouse has an offer
  if (selectedWarehouse?.points?.length > 0) {
    // through all the offers, check if the entered quantity has an offer
    for (let i = 0; i < selectedWarehouse.points.length; i++) {
      // check if the entered quantity has an offer
      if (qty >= selectedWarehouse.points[i].qty) {
        return (
          selectedWarehouse.points[i].bonus + calculatePoints(selectedWarehouse, qty - selectedWarehouse.points[i].qty)
        );
      }
    }
  }

  return 0;
};

export const cartSlice = createSlice({
  name: 'cartSlice',
  initialState,
  reducers: {
    addItemToCart: (state, action) => {
      // destructing field from action.payload
      const { item, warehouse, qty } = action.payload;
      const bonusQty = calculateOfferQty(warehouse, qty);

      const addedItem = {
        ...action.payload,
        bonus: bonusQty,
        bonusType: bonusQty > 0 ? warehouse.offerMode : null,
        point: calculatePoints(warehouse, qty),
      };

      // check if you order anything from this warehouse
      // if not add it to the cartWarehouse
      if (!state.cartWarehouse.map((w) => w.name).includes(warehouse.name)) {
        const { maxQty, offerMode, offers, points, isActive, city, ...rest } = warehouse;
        state.cartWarehouse = [...state.cartWarehouse, rest];
      }

      const filteredArray = state.cartItems.filter(
        (i) => !(i.item._id === item._id && i.warehouse._id === warehouse._id),
      );
      state.cartItems = [...filteredArray, addedItem];
    },

    increaseItemQty: (state, action) => {
      // destructing fields from action.payload
      const key = action.payload;
      // if the item is in the cart, add one to its quantity
      state.cartItems = state.cartItems.map((ci) => {
        if (ci.key === key) {
          const bonusQty = calculateOfferQty(ci.warehouse, ci.qty + 1);

          return {
            ...ci,
            qty: ci.qty * 1 + 1,
            bonus: bonusQty,
            bonusType: bonusQty > 0 ? ci.warehouse.offerMode : null,
            point: calculatePoints(ci.warehouse, ci.qty + 1),
          };
        } else {
          return ci;
        }
      });
    },

    decreaseItemQty: (state, action) => {
      // destructing fields from action.payload
      const key = action.payload;
      // if the item is in the cart, add one to its quantity
      state.cartItems = state.cartItems.map((ci) => {
        if (ci.key === key) {
          const bonusQty = calculateOfferQty(ci.warehouse, ci.qty - 1);

          return {
            ...ci,
            qty: ci.qty * 1 - 1,
            bonus: bonusQty,
            bonusType: bonusQty > 0 ? ci.warehouse.offerMode : null,
            point: calculatePoints(ci.warehouse, ci.qty - 1),
          };
        } else {
          return ci;
        }
      });
    },

    removeItemFromCart: (state, action) => {
      // destructing fields from action.payload
      const { key, warehouse } = action.payload;

      state.cartItems = state.cartItems.filter((ci) => !(ci.key === key));

      const findItemByWarehouse = state.cartItems.find((ci) => ci.warehouse._id === warehouse._id);

      if (!findItemByWarehouse) {
        state.cartWarehouse = state.cartWarehouse.filter((w) => w.name !== warehouse.name);
      }
    },

    resetCartItems: (state, action) => {
      state.cartWarehouse = state.cartWarehouse.filter((w) => w.name !== action.payload.name);
      state.cartItems = state.cartItems.filter((ci) => ci.warehouse.name !== action.payload.name);
    },

    cartSliceSignOut: (state) => {
      state.cartItems = [];
      state.cartWarehouse = [];
    },
  },
});

export const { addItemToCart, removeItemFromCart, resetCartItems, increaseItemQty, decreaseItemQty, cartSliceSignOut } =
  cartSlice.actions;

export const selectCartItems = (state) => state.cart.cartItems;

export const selectCartWarehouse = (state) => state.cart.cartWarehouse;
export const selectCartItemCount = (state) => {
  let total = 0;
  state.cart.cartItems.forEach((item) => (total = Number.parseInt(total) + Number.parseInt(item.qty)));
  return total;
};

export default cartSlice.reducer;
