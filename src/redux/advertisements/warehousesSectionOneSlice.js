import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import axios from 'axios';
import { BASEURL } from '../../utils/constants';

const initialState = {
  warehousesSectionOneStatus: 'idle',
  warehousesSectionOneError: '',
  warehousesSectionOne: [],
  count: 0,
  refresh: true,
};

let CancelToken;
let source;

export const getWarehousesSectionOne = createAsyncThunk(
  'advertisement/warehousesSectionOne',
  async ({ token }, { rejectWithValue }) => {
    try {
      CancelToken = axios.CancelToken;
      source = CancelToken.source();

      const response = await axios.get(
        `${BASEURL}/users?type=warehouse&isActive=true&inSectionOne=true&page=1&limit=25`,
        {
          // timeout: 10000,
          cancelToken: source.token,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      return response.data;
    } catch (err) {
      if (err.code === 'ECONNABORTED' && err.message.startsWith('timeout')) {
        return rejectWithValue('timeout');
      }
      if (axios.isCancel(err)) {
        return rejectWithValue('cancel');
      }

      if (!err.response) {
        return rejectWithValue('network failed');
      }

      return rejectWithValue(err.response.data);
    }
  },
);

export const warehousesSectionOneSlice = createSlice({
  name: 'warehousesSectionOne',
  initialState,
  reducers: {
    resetWarehousesSectionOneStatus: (state) => {
      state.warehousesSectionOneStatus = 'idle';
      state.warehousesSectionOneError = '';
    },

    resetWarehousesSectionOneError: (state) => {
      state.warehousesSectionOneError = '';
    },

    addWarehouseToSectionOneSocket: (state, action) => {
      state.warehousesSectionOne = [...state.warehousesSectionOne, action.payload];
    },

    removeWarehouseToSectionOneSocket: (state, action) => {
      state.warehousesSectionOne = state.warehousesSectionOne.filter((w) => w._id !== action.payload);
    },

    resetWarehousesSectionOne: (state) => {
      state.warehousesSectionOneStatus = 'idle';
      state.warehousesSectionOneError = '';
      state.warehousesSectionOne = [];
      state.count = 0;
      state.refresh = true;
    },

    warehousesSectionOneSignOut: (state) => {
      state.warehousesSectionOneStatus = 'idle';
      state.warehousesSectionOneError = '';
      state.warehousesSectionOne = [];
      state.count = 0;
      state.refresh = true;
    },
  },

  extraReducers: {
    [getWarehousesSectionOne.pending]: (state) => {
      state.warehousesSectionOneStatus = 'loading';
    },
    [getWarehousesSectionOne.fulfilled]: (state, action) => {
      state.warehousesSectionOneStatus = 'succeeded';
      state.warehousesSectionOne = action.payload.data.users;
      state.warehousesSectionOneError = '';
      state.refresh = false;
    },
    [getWarehousesSectionOne.rejected]: (state, { payload }) => {
      state.warehousesSectionOneStatus = 'failed';

      if (payload === 'timeout') {
        state.warehousesSectionOneError = 'timeout-msg';
      } else if (payload === 'cancel') {
        state.warehousesSectionOneError = 'cancel-operation-msg';
      } else if (payload === 'network failed') {
        state.warehousesSectionOneError = 'network failed';
      } else state.warehousesSectionOneError = payload.message;
    },
  },
});

export const selectWarehousesSectionOne = (state) => state.warehousesSectionOne;

export const {
  warehousesSectionOneSignOut,
  resetWarehousesSectionOneStatus,
  resetWarehousesSectionOneError,
  setRefreshWarehouseSliceOne,
  addWarehouseToSectionOneSocket,
  removeWarehouseToSectionOneSocket,
} = warehousesSectionOneSlice.actions;

export default warehousesSectionOneSlice.reducer;
