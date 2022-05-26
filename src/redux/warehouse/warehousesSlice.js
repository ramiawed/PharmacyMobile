import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { BASEURL, CitiesName } from '../../utils/constants';

let CancelToken = null;
let source = null;

const initialState = {
  status: 'idle',
  warehouses: [],
  count: 0,
  error: '',
  selectedWarehouse: null,
  pageState: {
    searchName: '',
    searchCity: CitiesName.ALL,
    displayType: 'list',
    showFavorites: false,
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

export const getWarehouses = createAsyncThunk(
  'warehouses/getWarehouses',
  async ({ token }, { rejectWithValue, getState }) => {
    const {
      warehouses: { pageState },
    } = getState();

    try {
      CancelToken = axios.CancelToken;
      source = CancelToken.source();

      let buildUrl = `${BASEURL}/users?type=warehouse&isActive=true&isApproved=true&page=${pageState.page}&limit=15&details=some`;

      if (pageState.searchName.trim() !== '') {
        buildUrl = buildUrl + `&name=${pageState.searchName}`;
      }

      if (pageState.searchCity !== CitiesName.ALL) {
        buildUrl = buildUrl + `&city=${pageState.searchCity}`;
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

export const warehousesSlice = createSlice({
  name: 'warehouses',
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

    changeDisplayType: (state, action) => {
      state.pageState = {
        ...state.pageState,
        displayType: action.payload,
      };
    },

    changePage: (state, action) => {
      state.pageState = {
        ...state.pageState,
        page: action.payload,
      };
    },

    changeShowFavorites: (state, action) => {
      state.pageState = {
        ...state.pageState,
        showFavorites: action.payload,
      };
    },

    setSelectedWarehouse: (state, action) => {
      state.selectedWarehouse = action.payload;
    },

    resetWarehousePageState: (state) => {
      state.pageState = {
        searchName: '',
        searchCity: CitiesName.ALL,
        displayType: 'list',
        showFavorites: false,
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
    resetWarehouse: (state) => {
      state.status = 'idle';
      state.warehouses = [];
      state.count = 0;
      state.error = null;
      state.pageState = {
        ...state.pageState,
        page: 1,
      };
    },
    resetWarehousesArray: (state) => {
      state.warehouses = [];
      state.count = 0;
      state.pageState = {
        ...state.pageState,
        page: 1,
      };
    },
    resetCount: (state) => {
      state.count = 0;
    },
    warehouseSliceSignOut: (state) => {
      state.status = 'idle';
      state.warehouses = [];
      state.count = 0;
      state.error = null;
      state.pageState = {
        searchName: '',
        searchCity: CitiesName.ALL,
        displayType: 'list',
        showFavorites: false,
        page: 1,
      };
    },
  },
  extraReducers: {
    [getWarehouses.pending]: (state) => {
      state.status = 'loading';
      state.error = null;
    },
    [getWarehouses.fulfilled]: (state, action) => {
      state.status = 'success';
      state.warehouses = [...state.warehouses, ...action.payload.data.users];
      state.count = action.payload.count;
      state.error = null;
      state.pageState = {
        ...state.pageState,
        page: Math.ceil(state.warehouses.length / 15) + 1,
      };
    },
    [getWarehouses.rejected]: (state, { payload }) => {
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

export const selectWarehouses = (state) => state.warehouses;
export const selectWarehousesPageState = (state) => state.warehouses.pageState;

export const {
  resetError,
  resetStatus,
  resetWarehouse,
  resetWarehousePageState,
  changeSearchName,
  changeSearchCity,
  changeDisplayType,
  changePage,
  changeShowFavorites,
  warehouseSliceSignOut,
  resetWarehousesArray,
  setSelectedWarehouse,
} = warehousesSlice.actions;

export default warehousesSlice.reducer;
