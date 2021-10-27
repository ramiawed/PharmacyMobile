import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { baseUrl } from '../../utils/constants';

let CancelToken;
let source;

const initialState = {
  status: 'idle',
  companies: [],
  count: 0,
  error: '',
  pageState: {
    searchName: '',
    searchCity: '',
    page: 1,
  },
};

export const cancelOperation = () => {
  if (source) {
    source.cancel('operation canceled by user');
  }
};

export const getCompanies = createAsyncThunk(
  'companies/getCompanies',
  async ({ queryString, token }, { rejectWithValue }) => {
    try {
      CancelToken = axios.CancelToken;
      source = CancelToken.source;

      let buildUrl = `${baseUrl}/api/v1/users?type=company&page=${queryString.page}&limit=20`;

      if (queryString.name) {
        buildUrl = buildUrl + `&name=${queryString.name}`;
      }

      if (queryString.city) {
        buildUrl = buildUrl + `&city=${queryString.city}`;
      }

      if (queryString.approve !== undefined) {
        buildUrl = buildUrl + `&isApproved=${queryString.approve}`;
      }

      if (queryString.active !== undefined) {
        buildUrl = buildUrl + `&isActive=${queryString.active}`;
      }

      const response = await axios.get(buildUrl, {
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
    resetSearchName: (state) => {
      state.pageState = {
        ...state.pageState,
        searchName: '',
      };
    },
    changeSearchCity: (state, action) => {
      state.pageState = {
        ...state.pageState,
        searchCity: action.payload,
      };
    },
    resetSearchCity: (state) => {
      state.pageState = {
        ...state.pageState,
        searchCity: '',
      };
    },
    changeDisplayType: (state, action) => {
      state.pageState = {
        ...state.pageState,
        displayType: action.payload,
      };
    },
    resetDisplayType: (state) => {
      state.pageState = {
        ...state.pageState,
        displayType: 'list',
      };
    },
    changePage: (state, action) => {
      state.pageState = {
        ...state.pageState,
        page: action.payload,
      };
    },
    resetPage: (state) => {
      state.pageState = {
        ...state.pageState,
        page: 1,
      };
    },
    resetCompaniesPageState: (state) => {
      state.pageState = {
        searchName: '',
        searchCity: '',
        displayType: 'list',
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
      state.count = 0;
      state.error = null;
    },
    resetCount: (state) => {
      state.count = 0;
    },
  },
  extraReducers: {
    [getCompanies.pending]: (state) => {
      state.status = 'loading';
      state.error = null;
    },
    [getCompanies.fulfilled]: (state, action) => {
      state.status = 'success';
      state.companies = [...state.companies, ...action.payload.data.users];
      state.count = action.payload.count;
      state.error = null;
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

export const {
  resetError,
  resetStatus,
  resetCompanies,
  resetCompaniesPageState,
  changeSearchName,
  changeSearchCity,
  changeDisplayType,
  changePage,
  resetSearchName,
  resetSearchCity,
  resetDisplayType,
  resetPage,
} = companiesSlice.actions;

export default companiesSlice.reducer;
