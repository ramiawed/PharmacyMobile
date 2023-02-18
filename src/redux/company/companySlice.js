import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { BASEURL, CitiesName } from '../../utils/constants';

let CancelToken = null;
let source = null;

const initialState = {
  status: 'idle',
  companies: [],
  error: '',
  pageState: {
    searchName: '',
    searchCity: CitiesName.ALL,
  },
};

export const cancelOperation = () => {
  if (source) {
    source.cancel('operation canceled by user');
  }
};

const resetCancelAndSource = () => {
  CancelToken = null;
  source = null;
};

export const getCompanies = createAsyncThunk(
  'companies/getCompanies',
  async ({ token }, { rejectWithValue, getState }) => {
    try {
      CancelToken = axios.CancelToken;
      source = CancelToken.source();
      let buildUrl = `${BASEURL}/users/companies`;

      const response = await axios.get(buildUrl, {
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

export const companiesSlice = createSlice({
  name: 'companies',
  initialState,
  reducers: {
    changeSearchName: (state, action) => {
      state.pageState = {
        ...state.pageState,
        searchName: action.payload,
      };
    },

    changeSearchCity: (state, action) => {
      state.pageState = {
        ...state.pageState,
        searchCity: action.payload,
      };
    },

    // : (state, action) => {
    //   state.pageState = {
    //     ...state.pageState,
    //     page: action.payload,
    //   };
    // },

    // changeShowFavorites: (state, action) => {
    //   state.pageState = {
    //     ...state.pageState,
    //     showFavorites: action.payload,
    //   };
    // },

    resetCompaniesPageState: (state) => {
      state.pageState = {
        searchName: '',
        searchCity: CitiesName.ALL,
      };
    },
    resetCompaniesArray: (state) => {
      state.companies = [];
      state.count = 0;
      state.pageState = {
        ...state.pageState,
        page: 1,
      };
    },

    resetError: (state) => {
      state.error = null;
    },

    resetStatus: (state) => {
      state.status = 'idle';
      state.error = null;
    },

    resetCompanies: (state) => {
      state.status = 'idle';
      state.companies = [];
      state.error = null;
    },

    companySliceSignOut: (state) => {
      state.status = 'idle';
      state.companies = [];
      state.error = '';
      state.pageState = {
        searchName: '',
        searchCity: CitiesName.ALL,
      };
    },
  },
  extraReducers: {
    [getCompanies.pending]: (state) => {
      state.status = 'loading';
      state.error = null;
    },
    [getCompanies.fulfilled]: (state, action) => {
      state.status = 'success';
      state.companies = [...action.payload.data];
      state.error = null;
      state.pageState = {
        ...state.pageState,
      };
    },
    [getCompanies.rejected]: (state, { payload }) => {
      state.status = 'failed';

      if (payload === 'timeout') {
        state.error = 'timeout';
      } else if (payload === 'cancel') {
        state.error = 'cancel-operation-msg';
      } else if (payload === 'network failed') {
        state.error = 'network failed';
      } else state.error = payload.message;
    },
  },
});

export const selectCompanies = (state) => state.companies;
export const selectCompaniesPageState = (state) => state.companies.pageState;
export const selectCompaniesIds = (state) => state.companies.companies.map((c) => c._id);

export const {
  resetError,
  resetStatus,
  resetCompanies,
  resetCompaniesPageState,
  changeSearchName,
  changeSearchCity,
  companySliceSignOut,
  resetCompaniesArray,
} = companiesSlice.actions;

export default companiesSlice.reducer;
