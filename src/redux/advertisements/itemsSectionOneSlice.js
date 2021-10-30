import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import axios from 'axios';
import { baseUrl } from '../../utils/constants';

const initialState = {
  itemsSectionOneStatus: 'idle',
  itemsSectionOneError: '',
  addItemToSectionOneStatus: '',
  addItemToSectionOneError: '',
  removeItemFromSectionOneStatus: 'idle',
  removeItemFromSectionOneError: '',
  itemsSectionOne: [],
  count: 0,
};

let CancelToken;
let source;

export const getItemsSectionOne = createAsyncThunk(
  'advertisement/itemsSectionOne',
  async ({ token }, { rejectWithValue }) => {
    try {
      CancelToken = axios.CancelToken;
      source = CancelToken.source();

      const response = await axios.get(`${baseUrl}/api/v1/items?isActive=true&inSectionOne=true&page=1&limit=25`, {
        timeout: 10000,
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

export const addItemToSectionOne = createAsyncThunk(
  'advertisement/addItemToSectionOne',
  async ({ token, id }, { rejectWithValue }) => {
    try {
      CancelToken = axios.CancelToken;
      source = CancelToken.source();

      const response = await axios.post(
        `${baseUrl}/api/v1/items/item/${id}`,
        {
          inSectionOne: true,
        },
        {
          timeout: 10000,
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

export const removeItemFromSectionOne = createAsyncThunk(
  'advertisement/removeItemFromSectionOne',
  async ({ token, id }, { rejectWithValue }) => {
    try {
      CancelToken = axios.CancelToken;
      source = CancelToken.source();

      const response = await axios.post(
        `${baseUrl}/api/v1/items/item/${id}`,
        {
          inSectionOne: false,
        },
        {
          timeout: 10000,
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

    resetAddItemToSectionOneStatus: (state) => {
      state.addItemToSectionOneStatus = 'idle';
      state.addItemToSectionOneError = '';
    },

    resetAddItemToSectionOneError: (state) => {
      state.addItemToSectionOneError = '';
    },

    resetRemoveItemFromSectionOneStatus: (state) => {
      state.removeItemFromSectionOneStatus = 'idle';
      state.removeItemFromSectionOneError = '';
    },

    resetRemoveItemFromSectionOneError: (state) => {
      state.removeItemFromSectionOneError = '';
    },

    resetItemsSectionOne: (state) => {
      state.itemsSectionOneStatus = 'idle';
      state.itemsSectionOneError = '';
      state.addItemToSectionOneStatus = 'idle';
      state.addItemToSectionOneError = '';
      state.removeItemFromSectionOneStatus = 'idle';
      state.removeItemFromSectionOneError = '';
      state.itemsSectionOne = [];
      state.count = 0;
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

    [addItemToSectionOne.pending]: (state) => {
      state.addItemToSectionOneStatus = 'loading';
    },
    [addItemToSectionOne.fulfilled]: (state, action) => {
      state.addItemToSectionOneStatus = 'succeeded';
      state.addItemToSectionOneError = '';
      state.itemsSectionOne = [...state.itemsSectionOne, action.payload.data.item];
    },
    [addItemToSectionOne.rejected]: (state, { payload }) => {
      state.addItemToSectionOneStatus = 'failed';

      if (payload === 'timeout') {
        state.addItemToSectionOneError = 'timeout-msg';
      } else if (payload === 'cancel') {
        state.addItemToSectionOneError = 'cancel-operation-msg';
      } else if (payload === 'network failed') {
        state.addItemToSectionOneError = 'network failed';
      } else state.addItemToSectionOneError = payload.message;
    },

    [removeItemFromSectionOne.pending]: (state) => {
      state.removeItemFromSectionOneStatus = 'loading';
    },
    [removeItemFromSectionOne.fulfilled]: (state, action) => {
      state.removeItemFromSectionOneStatus = 'succeeded';
      state.removeItemFromSectionOneError = '';
      state.itemsSectionOne = state.itemsSectionOne.filter((company) => company._id !== action.payload.data.item._id);
    },
    [removeItemFromSectionOne.rejected]: (state, { payload }) => {
      state.removeItemFromSectionOneStatus = 'failed';

      if (payload === 'timeout') {
        state.removeItemFromSectionOneError = 'timeout-msg';
      } else if (payload === 'cancel') {
        state.removeItemFromSectionOneError = 'cancel-operation-msg';
      } else if (payload === 'network failed') {
        state.removeItemFromSectionOneError = 'network failed';
      } else state.removeItemFromSectionOneError = payload.message;
    },
  },
});

export const selectItemsSectionOne = (state) => state.itemsSectionOne;

export const {
  resetItemsSectionOneStatus,
  resetItemsSectionOneError,
  resetAddItemToSectionOneStatus,
  resetAddItemToSectionOneError,
  resetRemoveItemFromSectionOneStatus,
  resetRemoveItemFromSectionOneError,
  resetFavoritesItems,
} = itemsSectionOneSlice.actions;

export default itemsSectionOneSlice.reducer;
