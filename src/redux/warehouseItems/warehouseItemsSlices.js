import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  status: 'idle',
  warehouseItems: [],
  count: 0,
  error: '',
  removeFromWarehouseStatus: 'idle',
  removeFromWarehouseError: '',
  changeMaxQtyStatus: 'idle',
  changeMaxQtyError: '',
  changeOfferStatus: 'idle',
  changeOfferError: '',
};

export const getWarehouseItems = createAsyncThunk(
  'warehouseItems/getItems',
  async ({ queryString, token }, { rejectWithValue }) => {
    try {
      let buildUrl = `/items/warehouseItems?page=${queryString.page}&limit=9`;

      if (queryString.name) {
        buildUrl = buildUrl + `&name=${queryString.name}`;
      }

      if (queryString.companyName) {
        buildUrl = buildUrl + `&companyName=${queryString.companyName}`;
      }

      const response = await axios.get(buildUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  },
);

export const removeItemFromWarehouse = createAsyncThunk(
  'warehouseItems/removeFromWarehouse',
  async ({ obj, token }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `/items/warehouse/remove-item/${obj.itemId}`,
        { warehouseId: obj.warehouseId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  },
);

export const changeItemWarehouseMaxQty = createAsyncThunk(
  'warehouseItems/changeItemsMaxQty',
  async ({ obj, token }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `/items/warehouse/change-max-qty/${obj.itemId}`,
        { warehouseId: obj.warehouseId, qty: obj.qty },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  },
);

export const changeItemWarehouseOffer = createAsyncThunk(
  'warehouseItems/changeItemsOffer',
  async ({ obj, token }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `/items/warehouse/change-offer/${obj.itemId}`,
        { warehouseId: obj.warehouseId, offer: obj.offer },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  },
);

export const warehouseItemsSlice = createSlice({
  name: 'warehouseItemsSlice',
  initialState,
  reducers: {
    resetStatus: (state) => {
      state.status = 'idle';
      state.error = '';
    },
    resetError: (state) => {
      state.error = '';
    },
    resetAddToWarehouseError: (state) => {
      state.addToWarehouseError = '';
    },
    resetRemoveFromWarehouseStatus: (state) => {
      state.removeFromWarehouseStatus = 'idle';
      state.removeFromWarehouseError = '';
    },
    resetRemoveFromWarehouseError: (state) => {
      state.RemoveFromWarehouseError = '';
    },
    resetChangeMaxQtyStatus: (state) => {
      state.changeMaxQtyStatus = 'idle';
      state.changeMaxQtyError = '';
    },
    resetChangeMaxQtyError: (state) => {
      state.changeMaxQtyError = '';
    },
    resetChangeOfferStatus: (state) => {
      state.changeOfferStatus = 'idle';
      state.changeOfferError = '';
    },
    resetChangeOfferError: (state) => {
      state.changeOfferError = '';
    },
    resetWarehouseItems: (state) => {
      state.status = 'idle';
      state.warehouseItems = [];
      state.count = 0;
      state.error = '';
      state.removeFromWarehouseStatus = 'idle';
      state.removeFromWarehouseError = '';
      state.changeMaxQtyStatus = 'idle';
      state.changeMaxQtyError = '';
      state.changeOfferStatus = 'idle';
      state.changeOfferError = '';
    },
  },
  extraReducers: {
    [getWarehouseItems.pending]: (state, action) => {
      state.status = 'loading';
    },
    [getWarehouseItems.fulfilled]: (state, action) => {
      state.status = 'succeeded';
      state.warehouseItems = action.payload.data.items;
      state.count = action.payload.count;
      state.error = '';
    },
    [getWarehouseItems.rejected]: (state, { error, meta, payload }) => {
      state.status = 'failed';
      state.error = payload.message;
    },
    [removeItemFromWarehouse.pending]: (state, action) => {
      state.removeFromWarehouseStatus = 'loading';
    },
    [removeItemFromWarehouse.fulfilled]: (state, action) => {
      state.removeFromWarehouseStatus = 'succeeded';
      // const newItems = state.warehouseItems.map((item) => {
      //   if (item._id === action.payload.data.item._id) {
      //     return action.payload.data.item;
      //   } else return item;
      // });

      // state.warehouseItems = newItems;
      // state.count = state.count - 1;
    },
    [removeItemFromWarehouse.rejected]: (state, { error, meta, payload }) => {
      state.removeFromWarehouseStatus = 'failed';
      state.removeFromWarehouseError = payload.message;
    },
    [changeItemWarehouseMaxQty.pending]: (state, action) => {
      state.changeMaxQtyStatus = 'loading';
    },
    [changeItemWarehouseMaxQty.fulfilled]: (state, action) => {
      state.changeMaxQtyStatus = 'succeeded';
    },
    [changeItemWarehouseMaxQty.rejected]: (state, { error, meta, payload }) => {
      state.changeMaxQtyStatus = 'failed';
      state.changeMaxQtyError = payload.message;
    },
    [changeItemWarehouseOffer.pending]: (state, action) => {
      state.changeOfferStatus = 'loading';
    },
    [changeItemWarehouseOffer.fulfilled]: (state, action) => {
      state.changeOfferStatus = 'succeeded';
      state.warehouseItems = state.warehouseItems.map((item) => {
        if (item._id === action.payload.data.item._id) {
          return action.payload.data.item;
        } else return item;
      });
    },
    [changeItemWarehouseOffer.rejected]: (state, { error, meta, payload }) => {
      state.changeOfferStatus = 'failed';
      state.changeOfferError = payload.message;
    },
  },
});

export const {
  resetStatus,
  resetError,
  resetWarehouseItems,
  resetRemoveFromWarehouseStatus,
  resetChangeMaxQtyStatus,
  resetChangeMaxQtyError,
  resetChangeOfferStatus,
  resetChangeOfferError,
} = warehouseItemsSlice.actions;

export const selectWarehouseItems = (state) => state.warehouseItems;

export default warehouseItemsSlice.reducer;
