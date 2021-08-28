import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { baseUrl } from '../../utils/constants';
// import { cacheAdapterEnhancer } from "axios-extensions";

let CancelToken;
let source;

const initialState = {
  status: 'idle',
  items: [],
  count: 0,
  error: '',
  addStatus: 'idle',
  addError: '',
  activeStatus: 'idle',
  activeError: '',
  updateStatus: 'idle',
  updateError: '',
  changeLogoStatus: 'idle',
  changeLogoError: '',
};

export const getItems = createAsyncThunk('items/getItems', async ({ queryString, token }, { rejectWithValue }) => {
  CancelToken = axios.CancelToken;
  source = CancelToken.source;

  try {
    let buildUrl = `${baseUrl}/api/v1/items?page=${queryString.page}&limit=10`;

    if (queryString.companyId) {
      buildUrl = buildUrl + `&companyId=${queryString.companyId}`;
    }

    if (queryString.warehouseId) {
      buildUrl = buildUrl + `&warehouseId=${queryString.warehouseId}`;
    }

    if (queryString.name) {
      buildUrl = buildUrl + `&itemName=${queryString.name}`;
    }

    if (queryString.companyName) {
      buildUrl = buildUrl + `&companyName=${queryString.companyName}`;
    }

    if (queryString.warehouseName) {
      buildUrl = buildUrl + `&warehouseName=${queryString.warehouseName}`;
    }

    if (queryString.isActive !== undefined) {
      buildUrl = buildUrl + `&isActive=${queryString.isActive}`;
    }

    if (queryString.sort) {
      buildUrl = buildUrl + `&sort=${queryString.sort}`;
    }

    if (queryString.inWarehouse) {
      buildUrl = buildUrl + `&inWarehouse=true`;
    }

    if (queryString.outWarehouse) {
      buildUrl = buildUrl + `&outWarehouse=true`;
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
});

export const addItem = createAsyncThunk('items/addItem', async ({ obj, token }, { rejectWithValue }) => {
  try {
    CancelToken = axios.CancelToken;
    source = CancelToken.source();

    const response = await axios.post('http://localhost:8000/api/v1/items', obj, {
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
});

export const updateItem = createAsyncThunk('items/updateItem', async ({ obj, token }, { rejectWithValue }) => {
  try {
    CancelToken = axios.CancelToken;
    source = CancelToken.source();

    const response = await axios.post(
      `http://localhost:8000/api/v1/items/item/${obj._id}`,
      { ...obj },
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
});

export const addItems = createAsyncThunk('items/addItems', async ({ obj, token }, { rejectWithValue }) => {
  try {
    CancelToken = axios.CancelToken;
    source = CancelToken.source();

    const response = await axios.post('http://localhost:8000/api/v1/items/excel', obj, {
      timeout: 25000,
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
});

export const changeItemActiveState = createAsyncThunk(
  'items/changeActive',
  async ({ obj, token }, { rejectWithValue }) => {
    try {
      CancelToken = axios.CancelToken;
      source = CancelToken.source();

      // const http = axios.create({
      //   baseURL: "http://localhost:8000/api/v1",
      //   timeout: 10000,
      //   cancelToken: source.token,
      //   headers: {
      //     "Cache-Control": "no-cache",
      //     Authorization: `Bearer ${token}`,
      //   },
      //   adapter: cacheAdapterEnhancer(axios.defaults.adapter, {
      //     enabledByDefault: false,
      //     cacheFlag: "useCache",
      //   }),
      // });

      const response = await axios.post(
        `http://localhost:8000/api/v1/items/active/${obj.itemId}`,
        { action: obj.action },
        {
          timeout: 10000,
          cancelToken: source.token,

          headers: {
            'Cache-Control': 'no-cache',
            Pragma: 'no-cache',
            Expires: '0',
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

export const changeItemLogo = createAsyncThunk(
  'items/changeLogo',
  async ({ data, _id, token }, { rejectWithValue }) => {
    try {
      CancelToken = axios.CancelToken;
      source = CancelToken.source();

      const response = await axios.post(`http://localhost:8000/api/v1/items/upload/${_id}`, data, {
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

export const itemsSlice = createSlice({
  name: 'itemsSlice',
  initialState,
  reducers: {
    resetStatus: (state) => {
      state.status = 'idle';
      state.error = '';
    },
    resetError: (state) => {
      state.error = '';
    },
    resetActiveStatus: (state) => {
      state.activeStatus = 'idle';
      state.activeError = '';
    },
    resetActiveError: (state) => {
      state.activeError = '';
    },
    resetAddStatus: (state) => {
      state.addStatus = 'idle';
      state.addError = '';
    },
    resetAddError: (state) => {
      state.addError = '';
    },
    resetUpdateStatus: (state) => {
      state.updateStatus = 'idle';
      state.updateError = '';
    },
    resetUpdateError: (state) => {
      state.updateError = '';
    },
    resetChangeLogoStatus: (state) => {
      state.changeLogoStatus = 'idle';
      state.changeLogoError = '';
    },
    resetChangeLogoError: (state) => {
      state.changeLogoError = '';
    },
    resetItems: (state) => {
      state.status = 'idle';
      state.items = [];
      state.count = 0;
      state.error = '';
      state.addStatus = '';
      state.addError = '';
      state.activeStatus = 'idle';
      state.activeError = '';
      state.updateStatus = 'idle';
      state.updateError = '';
      state.changeLogoStatus = 'idle';
      state.changeLogoError = '';
    },
  },
  extraReducers: {
    [getItems.pending]: (state) => {
      state.status = 'loading';
    },
    [getItems.fulfilled]: (state, action) => {
      state.status = 'succeeded';
      state.items = action.payload.data.items;
      state.count = action.payload.count;
      state.error = '';
    },
    [getItems.rejected]: (state, { payload }) => {
      state.status = 'failed';

      if (payload === 'timeout') {
        state.error = 'timeout-msg';
      } else if (payload === 'cancel') {
        state.error = 'cancel-operation-msg';
      } else if (payload === 'network failed') {
        state.error = 'network failed';
      } else state.error = payload.message;
    },
    [addItem.pending]: (state) => {
      state.addStatus = 'loading';
    },
    [addItem.fulfilled]: (state) => {
      state.addStatus = 'succeeded';
      // state.items = [...state.items, action.payload.data.item];
      state.addError = '';
    },
    [addItem.rejected]: (state, { payload }) => {
      state.addStatus = 'failed';

      if (payload === 'timeout') {
        state.addError = 'timeout-msg';
      } else if (payload === 'cancel') {
        state.addError = 'cancel-operation-msg';
      } else if (payload === 'network failed') {
        state.addError = 'network failed';
      } else state.addError = payload.message;
    },
    [addItems.pending]: (state) => {
      state.addStatus = 'loading';
    },
    [addItems.fulfilled]: (state) => {
      state.addStatus = 'succeeded';
      // state.items = [...state.items, action.payload.data.items];
      state.addError = '';
    },
    [addItems.rejected]: (state, { payload }) => {
      state.addStatus = 'failed';

      if (payload === 'timeout') {
        state.addError = 'timeout-msg';
      } else if (payload === 'cancel') {
        state.addError = 'cancel-operation-msg';
      } else if (payload === 'network failed') {
        state.addError = 'network failed';
      } else state.addError = payload.message;
    },
    [changeItemActiveState.pending]: (state) => {
      state.activeStatus = 'loading';
    },
    [changeItemActiveState.fulfilled]: (state, action) => {
      state.activeStatus = 'succeeded';
      const newItems = state.items.map((item) => {
        if (item._id === action.payload.data.item._id) {
          return action.payload.data.item;
        } else return item;
      });

      state.items = newItems;
    },
    [changeItemActiveState.rejected]: (state, { payload }) => {
      state.activeStatus = 'failed';

      if (payload === 'timeout') {
        state.activeError = 'timeout-msg';
      } else if (payload === 'cancel') {
        state.activeError = 'cancel-operation-msg';
      } else if (payload === 'network failed') {
        state.activeError = 'network failed';
      } else state.activeError = payload.message;
    },
    [updateItem.pending]: (state, action) => {
      state.updateStatus = 'loading';
    },
    [updateItem.fulfilled]: (state, action) => {
      state.updateStatus = 'succeeded';
      const newItems = state.items.map((item) => {
        if (item._id === action.payload.data.item._id) {
          return action.payload.data.item;
        } else return item;
      });

      state.items = newItems;
    },
    [updateItem.rejected]: (state, { payload }) => {
      state.updateStatus = 'failed';

      if (payload === 'timeout') {
        state.updateError = 'timeout-msg';
      } else if (payload === 'cancel') {
        state.updateError = 'cancel-operation-msg';
      } else if (payload === 'network failed') {
        state.updateError = 'network failed';
      } else state.updateError = payload.message;
    },
    [changeItemLogo.pending]: (state) => {
      state.changeLogoStatus = 'loading';
    },
    [changeItemLogo.fulfilled]: (state) => {
      state.changeLogoStatus = 'succeeded';
    },
    [changeItemLogo.rejected]: (state, { payload }) => {
      state.changeLogoStatus = 'failed';

      if (payload === 'timeout') {
        state.changeLogoError = 'timeout-msg';
      } else if (payload === 'cancel') {
        state.changeLogoError = 'cancel-operation-msg';
      } else if (payload === 'network failed') {
        state.changeLogoError = 'network failed';
      } else state.changeLogoError = payload.message;
    },
  },
});

export const {
  resetStatus,
  resetError,
  resetItems,
  resetActiveStatus,
  resetActiveError,
  resetAddStatus,
  resetAddError,
  resetUpdateError,
  resetUpdateStatus,
  resetChangeLogoStatus,
  resetChangeLogoError,
} = itemsSlice.actions;

export const selectItems = (state) => state.items;

export default itemsSlice.reducer;
