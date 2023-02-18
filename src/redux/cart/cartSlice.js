import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  cartWarehouse: [],
  cartItems: [],
};

export const cartSlice = createSlice({
  name: 'cartSlice',

  initialState,

  reducers: {
    addItemToCart: (state, action) => {
      // destructing field from action.payload
      const {
        item: { _id: itemId },
        warehouse,
      } = action.payload;

      // check if you order anything from this warehouse
      // if not add it to the cartWarehouse
      if (!state.cartWarehouse.map((w) => w.name).includes(action.payload.warehouse.warehouse.name)) {
        state.cartWarehouse = [...state.cartWarehouse, warehouse.warehouse];
      }

      // check if the item is already in the cart
      const findItem = state.cartItems.find(
        (item) => item.item._id === itemId && item.warehouse.warehouse._id === warehouse.warehouse.warehouseId,
      );

      // if the item is already in the cart, replace the item
      if (findItem) {
        const filteredArray = state.cartItems.filter(
          (item) => !(item.item._id === itemId && item.warehouse.warehouse._id === warehouse.warehouse.warehouseId),
        );

        state.cartItems = [...filteredArray, action.payload];
      } else {
        // if the item is not in the cart, add it to cart
        state.cartItems = [...state.cartItems, action.payload];
      }
    },

    increaseItemQty: (state, action) => {
      // destructing fields from action.payload
      const {
        item: { _id: itemId },
        warehouse: {
          warehouse: { _id: warehouseId },
        },
      } = action.payload;

      // check if the item is in the cart
      const findItem = state.cartItems.find(
        (item) => item.item._id === itemId && item.warehouse.warehouse._id === warehouseId,
      );

      // if the item is in the cart, add one to its quantity
      if (findItem) {
        state.cartItems = state.cartItems.map((item) => {
          if (item.item._id === itemId && item.warehouse.warehouse._id === warehouseId) {
            return { ...item, qty: item.qty * 1 + 1 };
          } else {
            return item;
          }
        });
      }
    },

    decreaseItemQty: (state, action) => {
      // destructing fields from action.payload
      const {
        item: { _id: itemId },
        warehouse: {
          warehouse: { _id: warehouseId },
        },
      } = action.payload;

      // check if the item is in the cart
      const findItem = state.cartItems.find(
        (item) => item.item._id === itemId && item.warehouse.warehouse._id === warehouseId,
      );

      // if the item is in the cart, mins one from its quantity
      // if the quantity is zero don't do anything
      if (findItem) {
        state.cartItems = state.cartItems.map((item) => {
          if (item.item._id === itemId && item.warehouse.warehouse._id === warehouseId) {
            return { ...item, qty: item.qty - 1 };
          } else {
            return item;
          }
        });
      }
    },

    removeItemFromCart: (state, action) => {
      // destructing fields from action.payload
      const {
        item: { _id: itemId },
        warehouse: {
          warehouse: { _id: warehouseId, name: warehouseName },
        },
      } = action.payload;

      state.cartItems = state.cartItems.filter(
        (item) => !(item.item._id === itemId && item.warehouse.warehouse._id === warehouseId),
      );

      const findItemByWarehouse = state.cartItems.find((item) => item.warehouse.warehouse._id === warehouseId);

      if (!findItemByWarehouse) {
        state.cartWarehouse = state.cartWarehouse.filter((w) => w.name !== warehouseName);
      }
    },
    resetCartItems: (state, action) => {
      state.cartWarehouse = state.cartWarehouse.filter((w) => w.name !== action.payload.name);
      state.cartItems = state.cartItems.filter((item) => item.warehouse.warehouse.name !== action.payload.name);
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
