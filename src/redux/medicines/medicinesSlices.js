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
  addToWarehouseStatus: 'idle',
  addToWarehouseError: '',
  removeFromWarehouseStatus: 'idle',
  removeFromWarehouseError: '',
  pageState: {
    searchName: '',
    searchWarehouseId: null,
    searchCompanyId: null,
    searchCompanyName: '',
    searchWarehouseName: '',
    searchInWarehouse: false,
    searchOutWarehouse: false,
    searchHaveOffer: false,
    city: '',
    displayType: 'list',
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

export const getMedicines = createAsyncThunk(
  'medicines/getMedicines',
  async ({ token }, { rejectWithValue, getState }) => {
    try {
      const {
        medicines: { pageState },
      } = getState();
      CancelToken = axios.CancelToken;
      source = CancelToken.source();

      let buildUrl = `${BASEURL}/items?forAdmin=false&isActive=true&page=${pageState.page}&limit=15`;

      if (pageState.searchName.trim() !== '') {
        buildUrl = buildUrl + `&itemName=${pageState.searchName}`;
      }

      if (pageState.searchCompanyId !== null) {
        buildUrl = buildUrl + `&companyId=${pageState.searchCompanyId}`;
      }

      if (pageState.searchWarehouseId !== null) {
        buildUrl = buildUrl + `&warehouseId=${pageState.searchWarehouseId}`;
      }

      if (pageState.searchCompanyName.trim() !== '') {
        buildUrl = buildUrl + `&companyName=${pageState.searchCompanyName}`;
      }

      if (pageState.searchWarehouseName.trim() !== '') {
        buildUrl = buildUrl + `&warehouseName=${pageState.searchWarehouseName}`;
      }

      if (pageState.searchInWarehouse) {
        buildUrl = buildUrl + `&inWarehouse=true`;
      }

      if (pageState.searchOutWarehouse) {
        buildUrl = buildUrl + `&outWarehouse=true`;
      }

      if (pageState.searchHaveOffer) {
        buildUrl = buildUrl + `&haveOffer=true`;
      }

      if (pageState.city) {
        buildUrl = buildUrl + `&city=${pageState.city}`;
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

export const addItemToWarehouse = createAsyncThunk(
  'medicines/addToWarehouse',
  async ({ obj, token }, { rejectWithValue }) => {
    try {
      CancelToken = axios.CancelToken;
      source = CancelToken.source();

      const response = await axios.post(
        `${BASEURL}/items/warehouse/add-item/${obj.itemId}/${obj.city}`,
        { warehouseId: obj.warehouseId },
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

export const removeItemFromWarehouse = createAsyncThunk(
  'medicines/removeFromWarehouse',
  async ({ obj, token }, { rejectWithValue }) => {
    try {
      CancelToken = axios.CancelToken;
      source = CancelToken.source();

      const response = await axios.post(
        `${BASEURL}/items/warehouse/remove-item/${obj.itemId}/${obj.city}`,
        { warehouseId: obj.warehouseId },
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

export const medicinesSlice = createSlice({
  name: 'medicinesSlice',
  initialState,
  reducers: {
    resetStatus: (state) => {
      state.status = 'idle';
      state.error = '';
    },

    resetError: (state) => {
      state.error = '';
    },

    resetAddToWarehouseStatus: (state) => {
      state.addToWarehouseStatus = 'idle';
      state.addToWarehouseError = '';
    },

    resetAddToWarehouseError: (state) => {
      state.addToWarehouseError = '';
    },

    resetRemoveFromWarehouseStatus: (state) => {
      state.removeFromWarehouseStatus = 'idle';
      state.removeFromWarehouseError = '';
    },

    resetRemoveFromWarehouseError: (state) => {
      state.removeFromWarehouseError = '';
    },

    setSearchName: (state, action) => {
      state.pageState = {
        ...state.pageState,
        searchName: action.payload,
      };
    },

    setSearchCompanyId: (state, action) => {
      state.pageState = {
        ...state.pageState,
        searchCompanyId: action.payload,
      };
    },

    setSearchWarehouseId: (state, action) => {
      state.pageState = {
        ...state.pageState,
        searchWarehouseId: action.payload,
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

    setSearchInWarehouse: (state, action) => {
      state.pageState = {
        ...state.pageState,
        searchInWarehouse: action.payload,
      };
    },

    setSearchOutWarehouse: (state, action) => {
      state.pageState = {
        ...state.pageState,
        searchOutWarehouse: action.payload,
      };
    },

    setSearchHaveOffer: (state, action) => {
      state.pageState = {
        ...state.pageState,
        searchHaveOffer: action.payload,
      };
    },

    setPage: (state, action) => {
      state.pageState = {
        ...state.pageState,
        page: action.payload,
      };
    },

    setCity: (state, action) => {
      state.pageState = {
        ...state.pageState,
        city: action.payload,
      };
    },

    setDisplayType: (state, action) => {
      state.pageState = {
        ...state.pageState,
        displayType: action.payload,
      };
    },

    warehouseAddBonusSocket: (state, action) => {
      state.medicines = state.medicines.map((m) => {
        if (m._id === action.payload.itemId) {
          return {
            ...m,
            warehouses: action.payload.warehouses,
          };
        }
        return m;
      });
    },

    warehouseAddOrRemoveItemSocket: (state, action) => {
      state.medicines = state.medicines.map((m) => {
        if (m._id === action.payload.itemId) {
          return {
            ...m,
            warehouses: action.payload.warehouses,
            existing_place: action.payload.existing_place,
          };
        }
        return m;
      });
    },

    resetMedicinesArray: (state) => {
      state.medicines = [];
      state.count = 0;
      state.pageState = {
        ...state.pageState,
        page: 1,
      };
    },

    resetMedicinesPageState: (state) => {
      state.pageState = {
        searchName: '',
        searchCompanyName: '',
        searchWarehouseName: '',
        searchWarehouseId: null,
        searchCompanyId: null,
        searchInWarehouse: false,
        searchOutWarehouse: false,
        searchHaveOffer: false,
        city: '',
        displayType: 'list',
        page: 1,
      };
    },

    resetMedicines: (state) => {
      state.status = 'idle';
      state.medicines = [];
      state.count = 0;
      state.error = '';
      state.addToWarehouseStatus = 'idle';
      state.addToWarehouseError = '';
      state.removeFromWarehouseStatus = 'idle';
      state.removeFromWarehouseError = '';
      state.pageState = {
        searchName: '',
        searchCompanyName: '',
        searchWarehouseName: '',
        searchWarehouseId: null,
        searchCompanyId: null,
        searchInWarehouse: false,
        searchOutWarehouse: false,
        searchHaveOffer: false,
        city: '',
        displayType: 'list',
        page: 1,
      };
    },

    medicinesSliceSignOut: (state) => {
      state.status = 'idle';
      state.medicines = [];
      state.count = 0;
      state.error = '';
      state.addToWarehouseStatus = 'idle';
      state.addToWarehouseError = '';
      state.removeFromWarehouseStatus = 'idle';
      state.removeFromWarehouseError = '';
      state.pageState = {
        searchName: '',
        searchCompanyName: '',
        searchWarehouseName: '',
        searchWarehouseId: null,
        searchCompanyId: null,
        searchInWarehouse: false,
        searchOutWarehouse: false,
        searchHaveOffer: false,
        city: '',
        displayType: 'list',
        page: 1,
      };
    },
  },
  extraReducers: {
    [getMedicines.pending]: (state) => {
      state.status = 'loading';
    },
    [getMedicines.fulfilled]: (state, action) => {
      state.status = 'succeeded';
      state.medicines = [...state.medicines, ...action.payload.data.items];
      state.count = action.payload.count;
      state.error = '';
      state.pageState = {
        ...state.pageState,
        page: Math.ceil(state.medicines.length / 15) + 1,
      };
    },
    [getMedicines.rejected]: (state, { error, meta, payload }) => {
      state.status = 'failed';

      if (payload === 'timeout') {
        state.error = payload;
      } else if (payload === 'cancel') {
        state.error = 'cancel-operation-msg';
      } else if (payload === 'network failed') {
        state.error = 'network failed';
      } else state.error = payload.message;
    },
    [addItemToWarehouse.pending]: (state) => {
      state.addToWarehouseStatus = 'loading';
    },
    [addItemToWarehouse.fulfilled]: (state, action) => {
      state.addToWarehouseStatus = 'succeeded';

      const newItems = state.medicines.map((item) => {
        if (item._id === action.payload.data.item._id) {
          return action.payload.data.item;
        } else return item;
      });

      state.medicines = newItems;
    },
    [addItemToWarehouse.rejected]: (state, { error, meta, payload }) => {
      state.addToWarehouseStatus = 'failed';

      if (payload === 'timeout') {
        state.addToWarehouseError = payload;
      } else if (payload === 'cancel') {
        state.addToWarehouseError = 'cancel-operation-msg';
      } else if (payload === 'network failed') {
        state.addToWarehouseError = 'network failed';
      } else state.addToWarehouseError = payload.message;
    },
    [removeItemFromWarehouse.pending]: (state, action) => {
      state.removeFromWarehouseStatus = 'loading';
    },
    [removeItemFromWarehouse.fulfilled]: (state, action) => {
      state.removeFromWarehouseStatus = 'succeeded';
      const newItems = state.medicines.map((item) => {
        if (item._id === action.payload.data.item._id) {
          return action.payload.data.item;
        } else return item;
      });

      state.medicines = newItems;
    },
    [removeItemFromWarehouse.rejected]: (state, { error, meta, payload }) => {
      state.removeFromWarehouseStatus = 'failed';

      if (payload === 'timeout') {
        state.removeFromWarehouseError = payload;
      } else if (payload === 'cancel') {
        state.removeFromWarehouseError = 'cancel-operation-msg';
      } else if (payload === 'network failed') {
        state.removeFromWarehouseError = 'network failed';
      } else state.removeFromWarehouseError = payload.message;
    },
  },
});

export const {
  resetStatus,
  resetError,
  resetMedicines,
  medicinesSliceSignOut,
  resetAddToWarehouseStatus,
  resetAddToWarehouseError,
  resetRemoveFromWarehouseStatus,
  resetRemoveFromWarehouseError,
  setSearchName,
  setSearchCompanyId,
  setSearchWarehouseId,
  setSearchCompanyName,
  setSearchWarehouseName,
  setSearchInWarehouse,
  setSearchOutWarehouse,
  setSearchHaveOffer,
  setPage,
  setCity,
  setDisplayType,
  resetMedicinesArray,
  resetMedicinesPageState,
  warehouseAddBonusSocket,
  warehouseAddOrRemoveItemSocket,
} = medicinesSlice.actions;

export const selectMedicines = (state) => state.medicines;

export default medicinesSlice.reducer;
