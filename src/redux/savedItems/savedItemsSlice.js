import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { BASEURL } from '../../utils/constants';

let CancelToken;
let source;

const initialState = {
  status: 'idle',
  savedItems: [],
  count: 0,
  error: '',
};

export const cancelOperation = () => {
  if (source) {
    source.cancel('operation canceled by user');
  }
};

export const getSavedItems = createAsyncThunk('savedItems/getSavedItems', async ({ token }, { rejectWithValue }) => {
  try {
    CancelToken = axios.CancelToken;
    source = CancelToken.source();

    const response = await axios.get(`${BASEURL}/savedItems`, {
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

export const addSavedItem = createAsyncThunk('savedItems/addSavedItem', async ({ obj, token }, { rejectWithValue }) => {
  try {
    CancelToken = axios.CancelToken;
    source = CancelToken.source();

    const response = await axios.post(
      `${BASEURL}/savedItems/add`,
      { savedItemId: obj.savedItemId },
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
});

export const removeSavedItem = createAsyncThunk(
  'savedItems/removeSavedItem',
  async ({ obj, token }, { rejectWithValue }) => {
    try {
      CancelToken = axios.CancelToken;
      source = CancelToken.source();

      const response = await axios.post(
        `${BASEURL}/savedItems/remove`,
        { savedItemId: obj.savedItemId },
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

export const savedItemsSlice = createSlice({
  name: 'savedItems',
  initialState,
  reducers: {
    resetSavedItems: (state) => {
      state.status = 'idle';
      state.savedItems = [];
      state.count = 0;
      state.error = '';
    },
    resetSavedItemsError: (state) => {
      state.status = 'idle';
      state.error = '';
    },
    savedItemsSliceSignOut: (state) => {
      state.status = 'idle';
      state.savedItems = [];
      state.count = 0;
      state.error = '';
    },
  },
  extraReducers: {
    [getSavedItems.pending]: (state) => {
      state.status = 'loading';
      state.error = '';
    },
    [getSavedItems.fulfilled]: (state, action) => {
      state.status = 'success';
      state.savedItems = action.payload.data.savedItems.length === 0 ? [] : action.payload.data.savedItems.items;
      state.count = action.payload.data.savedItems.length;
      state.error = '';
    },
    [getSavedItems.rejected]: (state, { payload }) => {
      state.status = 'failed';
      if (payload === 'timeout') {
        state.error = 'timeout-msg';
      } else if (payload === 'cancel') {
        state.error = 'cancel-operation-msg';
      } else if (payload === 'network failed') {
        state.error = 'network failed';
      } else state.error = payload.message;
    },
    [addSavedItem.pending]: (state) => {
      state.status = 'loading';
      state.error = '';
    },
    [addSavedItem.fulfilled]: (state, action) => {
      state.status = 'success';
      state.savedItems = [...state.savedItems, action.payload.data.savedItem];
      state.count = state.count + 1;
      state.error = '';
    },
    [addSavedItem.rejected]: (state, { payload }) => {
      state.status = 'failed';
      if (payload === 'timeout') {
        state.error = 'timeout-msg';
      } else if (payload === 'cancel') {
        state.error = 'cancel-operation-msg';
      } else if (payload === 'network failed') {
        state.error = 'network failed';
      } else state.error = payload.message;
    },

    [removeSavedItem.pending]: (state) => {
      state.status = 'loading';
      state.error = '';
    },
    [removeSavedItem.fulfilled]: (state, action) => {
      state.status = 'success';
      state.savedItems = state.savedItems.filter((si) => si._id !== action.payload.data.item);
      state.count = state.count - 1;
      state.error = '';
    },
    [removeSavedItem.rejected]: (state, { payload }) => {
      state.status = 'failed';
      if (payload === 'timeout') {
        state.error = 'timeout-msg';
      } else if (payload === 'cancel') {
        state.error = 'cancel-operation-msg';
      } else if (payload === 'network failed') {
        state.error = 'network failed';
      } else state.error = payload.message;
    },
  },
});

export const { resetSavedItems, resetSavedItemsError, savedItemsSliceSignOut } = savedItemsSlice.actions;

export const selectSavedItems = (state) => state.savedItems;

export default savedItemsSlice.reducer;
