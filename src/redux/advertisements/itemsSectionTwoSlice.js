import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import axios from 'axios';
import { BASEURL } from '../../utils/constants';

const initialState = {
  itemsSectionTwoStatus: 'idle',
  itemsSectionTwoError: '',
  itemsSectionTwo: [],
  count: 0,
  refresh: true,
};

let CancelToken;
let source;

export const getItemsSectionTwo = createAsyncThunk(
  'advertisement/itemsSectionTwo',
  async ({ token }, { rejectWithValue }) => {
    try {
      CancelToken = axios.CancelToken;
      source = CancelToken.source();

      const response = await axios.get(`${BASEURL}/items?isActive=true&inSectionTwo=true&page=1&limit=25`, {
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

export const itemsSectionTwoSlice = createSlice({
  name: 'itemsSectionTwo',
  initialState,
  reducers: {
    resetItemsSectionTwoStatus: (state) => {
      state.itemsSectionTwoStatus = 'idle';
      state.itemsSectionTwoError = '';
    },

    resetItemsSectionTwoError: (state) => {
      state.itemsSectionTwoError = '';
    },

    addItemToSectionTwoSocket: (state, action) => {
      state.itemsSectionTwo = [...state.itemsSectionTwo, action.payload];
    },

    removeItemFromSectionTwoSocket: (state, action) => {
      state.itemsSectionTwo = state.itemsSectionTwo.filter((c) => c._id !== action.payload);
    },

    resetItemsSectionTwo: (state) => {
      state.itemsSectionTwoStatus = 'idle';
      state.itemsSectionTwoError = '';
      state.itemsSectionTwo = [];
      state.count = 0;
      state.refresh = true;
    },

    itemsSectionTwoSignOut: (state) => {
      state.itemsSectionTwoStatus = 'idle';
      state.itemsSectionTwoError = '';
      state.itemsSectionTwo = [];
      state.count = 0;
      state.refresh = true;
    },
  },

  extraReducers: {
    [getItemsSectionTwo.pending]: (state) => {
      state.itemsSectionTwoStatus = 'loading';
    },
    [getItemsSectionTwo.fulfilled]: (state, action) => {
      state.itemsSectionTwoStatus = 'succeeded';
      state.itemsSectionTwo = action.payload.data.items;
      state.itemsSectionTwoError = '';
      state.refresh = false;
    },
    [getItemsSectionTwo.rejected]: (state, { payload }) => {
      state.itemsSectionTwoStatus = 'failed';

      if (payload === 'timeout') {
        state.itemsSectionTwoError = 'timeout-msg';
      } else if (payload === 'cancel') {
        state.itemsSectionTwoError = 'cancel-operation-msg';
      } else if (payload === 'network failed') {
        state.itemsSectionTwoError = 'network failed';
      } else state.itemsSectionTwoError = payload.message;
    },
  },
});

export const selectItemsSectionTwo = (state) => state.itemsSectionTwo;

export const {
  itemsSectionTwoSignOut,
  resetItemsSectionTwoStatus,
  resetItemsSectionTwoError,
  setRefreshItemsSliceTwo,
  addItemToSectionTwoSocket,
  removeItemFromSectionTwoSocket,
} = itemsSectionTwoSlice.actions;

export default itemsSectionTwoSlice.reducer;
