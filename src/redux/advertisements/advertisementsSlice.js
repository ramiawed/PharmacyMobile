import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import axios from 'axios';
import { BASEURL } from '../../utils/constants';

const initialState = {
  status: 'idle',
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

export const addAdvertisement = createAsyncThunk(
  'advertisement/addAdvertisement',
  async ({ data, token }, { rejectWithValue }) => {
    try {
      CancelToken = axios.CancelToken;
      source = CancelToken.source();

      const config = {
        headers: {
          'content-type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await axios.post(`${BASEURL}/advertisement/upload`, data, config);

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

export const deleteAdvertisement = createAsyncThunk(
  'advertisement/deleteAdvertisement',
  async ({ id, token }, { rejectWithValue }) => {
    try {
      CancelToken = axios.CancelToken;
      source = CancelToken.source();

      const response = await axios.post(
        `${BASEURL}/advertisement/${id}`,
        {},
        {
          // timeout: 10000,
          cancelToken: source.token,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

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
    [addAdvertisement.pending]: (state) => {
      state.status = 'loading';
    },
    [addAdvertisement.fulfilled]: (state, action) => {
      state.status = 'succeeded';
      state.advertisements = [action.payload.data.advertisement, ...state.advertisements];
      state.forceRefresh = false;
    },
    [addAdvertisement.rejected]: (state, { payload }) => {
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
    [deleteAdvertisement.pending]: (state) => {
      state.status = 'loading';
    },
    [deleteAdvertisement.fulfilled]: (state, action) => {
      state.status = 'succeeded';
      state.advertisements = state.advertisements.filter((adv) => adv._id !== action.payload.data.advertisement._id);
    },
    [deleteAdvertisement.rejected]: (state, { payload }) => {
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
    [getAllAdvertisements.pending]: (state) => {
      state.status = 'loading';
    },
    [getAllAdvertisements.fulfilled]: (state, action) => {
      state.status = 'succeeded';
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
