import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import axios from 'axios';
import { BASEURL } from '../../utils/constants';

const initialState = {
  itemsSectionThreeStatus: 'idle',
  itemsSectionThreeError: '',
  itemsSectionThree: [],
  count: 0,
  refresh: true,
};

let CancelToken;
let source;

export const getItemsSectionThree = createAsyncThunk(
  'advertisement/itemsSectionThree',
  async ({ token }, { rejectWithValue }) => {
    try {
      CancelToken = axios.CancelToken;
      source = CancelToken.source();

      const response = await axios.get(`${BASEURL}/items?isActive=true&inSectionThree=true&page=1&limit=25`, {
        // timeout: 10000,
        cancelToken: source.token,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

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

export const itemsSectionThreeSlice = createSlice({
  name: 'itemsSectionThree',
  initialState,
  reducers: {
    resetItemsSectionThreeStatus: (state) => {
      state.itemsSectionThreeStatus = 'idle';
      state.itemsSectionThreeError = '';
    },

    resetItemsSectionThreeError: (state) => {
      state.itemsSectionThreeError = '';
    },

    addItemToSectionThreeSocket: (state, action) => {
      state.itemsSectionThree = [...state.itemsSectionThree, action.payload];
    },

    removeItemFromSectionThreeSocket: (state, action) => {
      state.itemsSectionThree = state.itemsSectionThree.filter((c) => c._id !== action.payload);
    },

    resetItemsSectionThree: (state) => {
      state.itemsSectionThreeStatus = 'idle';
      state.itemsSectionThreeError = '';
      state.itemsSectionThree = [];
      state.count = 0;
      state.refresh = true;
    },

    itemsSectionThreeSignOut: (state) => {
      state.itemsSectionThreeStatus = 'idle';
      state.itemsSectionThreeError = '';
      state.itemsSectionThree = [];
      state.count = 0;
      state.refresh = true;
    },
  },

  extraReducers: {
    [getItemsSectionThree.pending]: (state) => {
      state.itemsSectionThreeStatus = 'loading';
    },
    [getItemsSectionThree.fulfilled]: (state, action) => {
      state.itemsSectionThreeStatus = 'succeeded';
      state.itemsSectionThree = action.payload.data.items;
      state.itemsSectionThreeError = '';
      state.refresh = false;
    },
    [getItemsSectionThree.rejected]: (state, { payload }) => {
      state.itemsSectionThreeStatus = 'failed';

      if (payload === 'timeout') {
        state.itemsSectionThreeError = 'timeout-msg';
      } else if (payload === 'cancel') {
        state.itemsSectionThreeError = 'cancel-operation-msg';
      } else if (payload === 'network failed') {
        state.itemsSectionThreeError = 'network failed';
      } else state.itemsSectionThreeError = payload.message;
    },
  },
});

export const selectItemsSectionThree = (state) => state.itemsSectionThree;

export const {
  itemsSectionThreeSignOut,
  resetItemsSectionThreeStatus,
  resetItemsSectionThreeError,
  setRefreshItemsSliceThree,
  addItemToSectionThreeSocket,
  removeItemFromSectionThreeSocket,
} = itemsSectionThreeSlice.actions;

export default itemsSectionThreeSlice.reducer;
