import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import axios from 'axios';
import { BASEURL } from '../../utils/constants';

const initialState = {
  itemsSectionOneStatus: 'idle',
  itemsSectionOneError: '',
  itemsSectionOne: [],
  count: 0,
  refresh: true,
};

let CancelToken;
let source;

export const getItemsSectionOne = createAsyncThunk(
  'advertisement/itemsSectionOne',
  async ({ token }, { rejectWithValue }) => {
    try {
      CancelToken = axios.CancelToken;
      source = CancelToken.source();

      const response = await axios.get(`${BASEURL}/items?isActive=true&inSectionOne=true&page=1&limit=25`, {
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

export const itemsSectionOneSlice = createSlice({
  name: 'itemsSectionOne',
  initialState,
  reducers: {
    resetItemsSectionOneStatus: (state) => {
      state.itemsSectionOneStatus = 'idle';
      state.itemsSectionOneError = '';
    },

    resetItemsSectionOneError: (state) => {
      state.itemsSectionOneError = '';
    },

    addItemToSectionOneSocket: (state, action) => {
      state.itemsSectionOne = [...state.itemsSectionOne, action.payload];
    },

    removeItemFromSectionOneSocket: (state, action) => {
      state.itemsSectionOne = state.itemsSectionOne.filter((c) => c._id !== action.payload);
    },

    resetItemsSectionOne: (state) => {
      state.itemsSectionOneStatus = 'idle';
      state.itemsSectionOneError = '';
      state.itemsSectionOne = [];
      state.count = 0;
      state.refresh = true;
    },

    itemsSectionOneSignOut: (state) => {
      state.itemsSectionOneStatus = 'idle';
      state.itemsSectionOneError = '';
      state.itemsSectionOne = [];
      state.count = 0;
      state.refresh = true;
    },
  },

  extraReducers: {
    [getItemsSectionOne.pending]: (state) => {
      state.itemsSectionOneStatus = 'loading';
    },
    [getItemsSectionOne.fulfilled]: (state, action) => {
      state.itemsSectionOneStatus = 'succeeded';
      state.itemsSectionOne = action.payload.data.items;
      state.itemsSectionOneError = '';
      state.refresh = false;
    },
    [getItemsSectionOne.rejected]: (state, { payload }) => {
      state.itemsSectionOneStatus = 'failed';

      if (payload === 'timeout') {
        state.itemsSectionOneError = 'timeout-msg';
      } else if (payload === 'cancel') {
        state.itemsSectionOneError = 'cancel-operation-msg';
      } else if (payload === 'network failed') {
        state.itemsSectionOneError = 'network failed';
      } else state.itemsSectionOneError = payload.message;
    },
  },
});

export const selectItemsSectionOne = (state) => state.itemsSectionOne;

export const {
  itemsSectionOneSignOut,
  resetItemsSectionOneStatus,
  resetItemsSectionOneError,
  addItemToSectionOneSocket,
  removeItemFromSectionOneSocket,
} = itemsSectionOneSlice.actions;

export default itemsSectionOneSlice.reducer;
