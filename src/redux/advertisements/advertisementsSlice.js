import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import axios from 'axios';
import { BASEURL } from '../../utils/constants';

const initialState = {
  status: 'idle',
  completed: 'loading',
  advertisements: [],
  forceRefresh: false,
  error: '',
};

let CancelToken = null;
let source = null;

export const cancelOperation = () => {
  if (source) {
    source.cancel('operation canceled by user');
  }
};

const resetCancelAndSource = () => {
  CancelToken = null;
  source = null;
};

export const getAllAdvertisements = createAsyncThunk(
  'advertisement/getAllAdvertisements',
  async ({ token }, { rejectWithValue }) => {
    try {
      CancelToken = axios.CancelToken;
      source = CancelToken.source();

      const response = await axios.get(`${BASEURL}/advertisement`, {
        // timeout: 10000,
        cancelToken: source.token,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      resetCancelAndSource();

      return response.data;
    } catch (err) {
      resetCancelAndSource();
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

export const advertisementsSlice = createSlice({
  name: 'advertisements',
  initialState,
  reducers: {
    resetStatus: (state) => {
      state.status = 'idle';
      state.error = '';
    },
    resetError: (state) => {
      state.status = 'idle';
      state.error = '';
    },
    setForceRefresh: (state, action) => {
      state.forceRefresh = action.payload;
    },
    resetAdvertisements: (state) => {
      state.status = 'idle';
      state.error = '';
      state.forceRefresh = false;
      state.advertisements = [];
    },
    advertisementsSignOut: (state) => {
      state.status = 'idle';
      state.completed = 'loading';
      state.error = '';
      state.forceRefresh = false;
      state.advertisements = [];
    },
    addAdvertisementSocket: (state, action) => {
      const { _id } = action.payload;
      const filteredAdvertisements = state.advertisements.filter((adv) => adv._id === _id);
      if (filteredAdvertisements.length === 0) {
        state.advertisements = [action.payload, ...state.advertisements];
      }
    },
  },
  extraReducers: {
    [getAllAdvertisements.pending]: (state) => {
      state.status = 'loading';
    },
    [getAllAdvertisements.fulfilled]: (state, action) => {
      state.status = 'succeeded';
      state.completed = 'done';
      state.advertisements = action.payload.data.advertisements;
      state.error = '';
    },
    [getAllAdvertisements.rejected]: (state, { payload }) => {
      state.status = 'failed';

      try {
        if (payload === 'timeout') {
          state.error = 'general-error';
        } else if (payload === 'cancel') {
          state.error = 'general-error';
        } else if (payload === 'network failed') {
          state.error = 'general-error';
        } else state.error = payload.message;
      } catch (err) {
        state.error = 'general-error';
      }
    },
  },
});

export const {
  resetError,
  resetStatus,
  resetAdvertisements,
  advertisementsSignOut,
  setForceRefresh,
  addAdvertisementSocket,
} = advertisementsSlice.actions;

export const selectAdvertisements = (state) => state.advertisements;

export default advertisementsSlice.reducer;
