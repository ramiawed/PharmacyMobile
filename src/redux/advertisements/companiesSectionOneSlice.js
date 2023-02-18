import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import axios from 'axios';
import { BASEURL } from '../../utils/constants';

const initialState = {
  companiesSectionOneStatus: 'idle',
  companiesSectionOneError: '',
  companiesSectionOne: [],
  count: 0,
  refresh: true,
};

let CancelToken = null;
let source = null;

export const getCompaniesSectionOne = createAsyncThunk(
  'advertisement/companiesSectionOne',
  async ({ token }, { rejectWithValue }) => {
    try {
      CancelToken = axios.CancelToken;
      source = CancelToken.source();

      const response = await axios.get(
        `${BASEURL}/users?type=company&isActive=true&inSectionOne=true&page=1&limit=25`,
        {
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

export const companiesSectionOneSlice = createSlice({
  name: 'companiesSectionOne',
  initialState,
  reducers: {
    resetCompaniesSectionOneStatus: (state) => {
      state.companiesSectionOneStatus = 'idle';
      state.companiesSectionOneError = '';
    },

    resetCompaniesSectionOneError: (state) => {
      state.companiesSectionOneError = '';
    },

    addCompanyToSectionOneSocket: (state, action) => {
      state.companiesSectionOne = [...state.companiesSectionOne, action.payload];
    },

    removeCompanyFromSectionOneSocket: (state, action) => {
      state.companiesSectionOne = state.companiesSectionOne.filter((c) => c._id !== action.payload);
    },

    resetCompaniesSectionOne: (state) => {
      state.companiesSectionOneStatus = 'idle';
      state.companiesSectionOneError = '';
      state.companiesSectionOne = [];
      state.count = 0;
      state.refresh = true;
    },

    companiesSectionOneSignOut: (state) => {
      state.companiesSectionOneStatus = 'idle';
      state.companiesSectionOneError = '';
      state.companiesSectionOne = [];
      state.count = 0;
      state.refresh = true;
    },
  },

  extraReducers: {
    [getCompaniesSectionOne.pending]: (state) => {
      state.companiesSectionOneStatus = 'loading';
    },
    [getCompaniesSectionOne.fulfilled]: (state, action) => {
      state.companiesSectionOneStatus = 'succeeded';
      state.companiesSectionOne = action.payload.data.users;
      state.companiesSectionOneError = '';
      state.refresh = false;
    },
    [getCompaniesSectionOne.rejected]: (state, { payload }) => {
      state.companiesSectionOneStatus = 'failed';

      if (payload === 'timeout') {
        state.companiesSectionOneError = 'timeout-msg';
      } else if (payload === 'cancel') {
        state.companiesSectionOneError = 'cancel-operation-msg';
      } else if (payload === 'network failed') {
        state.companiesSectionOneError = 'network failed';
      } else state.companiesSectionOneError = payload.message;
    },
  },
});

export const selectCompaniesSectionOne = (state) => state.companiesSectionOne;

export const {
  companiesSectionOneSignOut,
  resetCompaniesSectionOneStatus,
  resetCompaniesSectionOneError,
  addCompanyToSectionOneSocket,
  removeCompanyFromSectionOneSocket,
} = companiesSectionOneSlice.actions;

export default companiesSectionOneSlice.reducer;
