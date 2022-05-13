import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import axios from 'axios';
import { BASEURL } from '../../utils/constants';

const initialState = {
  companiesSectionTwoStatus: 'idle',
  companiesSectionTwoError: '',
  companiesSectionTwo: [],
  count: 0,
  refresh: true,
};

let CancelToken;
let source;

export const getCompaniesSectionTwo = createAsyncThunk(
  'advertisement/companiesSectionTwo',
  async ({ token }, { rejectWithValue }) => {
    try {
      CancelToken = axios.CancelToken;
      source = CancelToken.source();

      const response = await axios.get(
        `${BASEURL}/users?type=company&isActive=true&inSectionTwo=true&page=1&limit=25`,
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

export const companiesSectionTwoSlice = createSlice({
  name: 'companiesSectionTwo',
  initialState,
  reducers: {
    resetCompaniesSectionTwoStatus: (state) => {
      state.companiesSectionTwoStatus = 'idle';
      state.companiesSectionTwoError = '';
    },

    resetCompaniesSectionTwoError: (state) => {
      state.companiesSectionTwoError = '';
    },

    addCompanyToSectionTwoSocket: (state, action) => {
      state.companiesSectionTwo = [...state.companiesSectionTwo, action.payload];
    },

    removeCompanyFromSectionTwoSocket: (state, action) => {
      state.companiesSectionTwo = state.companiesSectionTwo.filter((c) => c._id !== action.payload);
    },

    resetCompaniesSectionTwo: (state) => {
      state.companiesSectionTwoStatus = 'idle';
      state.companiesSectionTwoError = '';
      state.companiesSectionTwo = [];
      state.count = 0;
      state.refresh = true;
    },

    companiesSectionTwoSignOut: (state) => {
      state.companiesSectionTwoStatus = 'idle';
      state.companiesSectionTwoError = '';
      state.companiesSectionTwo = [];
      state.count = 0;
      state.refresh = true;
    },
  },

  extraReducers: {
    [getCompaniesSectionTwo.pending]: (state) => {
      state.companiesSectionTwoStatus = 'loading';
    },
    [getCompaniesSectionTwo.fulfilled]: (state, action) => {
      state.companiesSectionTwoStatus = 'succeeded';
      state.companiesSectionTwo = action.payload.data.users;
      state.companiesSectionTwoError = '';
      state.refresh = false;
    },
    [getCompaniesSectionTwo.rejected]: (state, { payload }) => {
      state.companiesSectionTwoStatus = 'failed';

      if (payload === 'timeout') {
        state.companiesSectionTwoError = 'timeout-msg';
      } else if (payload === 'cancel') {
        state.companiesSectionTwoError = 'cancel-operation-msg';
      } else if (payload === 'network failed') {
        state.companiesSectionTwoError = 'network failed';
      } else state.companiesSectionTwoError = payload.message;
    },
  },
});

export const selectCompaniesSectionTwo = (state) => state.companiesSectionTwo;

export const {
  companiesSectionTwoSignOut,
  resetCompaniesSectionTwoStatus,
  resetCompaniesSectionTwoError,
  addCompanyToSectionTwoSocket,
  removeCompanyFromSectionTwoSocket,
} = companiesSectionTwoSlice.actions;

export default companiesSectionTwoSlice.reducer;
