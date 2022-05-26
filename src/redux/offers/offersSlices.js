import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { BASEURL } from '../../utils/constants';

let CancelToken;
let source;

const initialState = {
  status: 'idle',
  medicines: [],
  count: 0,
  error: '',
  pageState: {
    searchName: '',
    searchCompanyName: '',
    searchWarehouseName: '',
    page: 1,
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

export const getOffers = createAsyncThunk(
  'offers/getOfferMedicines',
  async ({ token }, { rejectWithValue, getState }) => {
    try {
      const {
        offers: { pageState },
      } = getState();
      CancelToken = axios.CancelToken;
      source = CancelToken.source();

      let buildUrl = `${BASEURL}/items/items-with-offer?page=${pageState.page}&limit=15`;

      if (pageState.searchName.trim() !== '') {
        buildUrl = buildUrl + `&itemName=${pageState.searchName}`;
      }

      if (pageState.searchCompanyName.trim() !== '') {
        buildUrl = buildUrl + `&companyName=${pageState.searchCompanyName}`;
      }

      if (pageState.searchWarehouseName.trim() !== '') {
        buildUrl = buildUrl + `&warehouseName=${pageState.searchWarehouseName}`;
      }

      const response = await axios.get(buildUrl, {
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

export const offersSlice = createSlice({
  name: 'offersSlice',
  initialState,
  reducers: {
    resetStatus: (state) => {
      state.status = 'idle';
      state.error = '';
    },

    resetError: (state) => {
      state.error = '';
    },

    setSearchName: (state, action) => {
      state.pageState = {
        ...state.pageState,
        searchName: action.payload,
      };
    },

    setSearchCompanyName: (state, action) => {
      state.pageState = {
        ...state.pageState,
        searchCompanyName: action.payload,
      };
    },

    setSearchWarehouseName: (state, action) => {
      state.pageState = {
        ...state.pageState,
        searchWarehouseName: action.payload,
      };
    },

    setPage: (state, action) => {
      state.pageState = {
        ...state.pageState,
        page: action.payload,
      };
    },

    resetOfferItemsArray: (state) => {
      state.medicines = [];
      state.count = 0;
      state.pageState = {
        ...state.pageState,
        page: 1,
      };
    },

    resetOfferItemsPageState: (state) => {
      state.pageState = {
        searchName: '',
        searchCompanyName: '',
        searchWarehouseName: '',
        page: 1,
      };
    },

    offersSliceSignOut: (state) => {
      state.status = 'idle';
      state.medicines = [];
      state.count = 0;
      state.error = '';
      state.pageState = {
        searchName: '',
        searchCompanyName: '',
        searchWarehouseName: '',
        page: 1,
      };
    },
  },
  extraReducers: {
    [getOffers.pending]: (state) => {
      state.status = 'loading';
    },
    [getOffers.fulfilled]: (state, action) => {
      state.status = 'succeeded';
      state.medicines = [...state.medicines, ...action.payload.data.data];
      state.count = action.payload.count;
      state.error = '';
      state.pageState = {
        ...state.pageState,
        page: Math.ceil(state.medicines.length / 15) + 1,
      };
    },
    [getOffers.rejected]: (state, { error, meta, payload }) => {
      state.status = 'failed';

      if (payload === 'timeout') {
        state.error = payload;
      } else if (payload === 'cancel') {
        state.error = 'cancel-operation-msg';
      } else if (payload === 'network failed') {
        state.error = 'network failed';
      } else state.error = payload.message;
    },
  },
});

export const {
  resetStatus,
  resetError,
  resetMedicines,
  offersSliceSignOut,
  setSearchName,
  setSearchCompanyName,
  setSearchWarehouseName,
  setPage,
  resetOfferItemsArray,
  resetOfferItemsPageState,
} = offersSlice.actions;

export const selectOfferMedicines = (state) => state.offers;

export default offersSlice.reducer;
