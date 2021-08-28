import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { baseUrl } from '../../utils/constants';

let CancelToken;
let source;

const initialState = {
  status: 'idle',
  favorites_partners: [],
  favorites_items: [],
  error: '',
};

export const cancelOperation = () => {
  if (source) {
    source.cancel('operation canceled by user');
  }
};

export const getFavorites = createAsyncThunk('favorites/getFavorites', async ({ token }, { rejectWithValue }) => {
  try {
    CancelToken = axios.CancelToken;
    source = CancelToken.source();

    const response = await axios.get(`${baseUrl}/api/v1/favorites`, {
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

export const addFavorite = createAsyncThunk('favorites/addFavorite', async ({ obj, token }, { rejectWithValue }) => {
  try {
    CancelToken = axios.CancelToken;
    source = CancelToken.source();

    const response = await axios.post(
      `${baseUrl}/api/v1/favorites/add`,
      { favoriteId: obj.favoriteId },
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

export const removeFavorite = createAsyncThunk(
  'favorites/removeFavorite',
  async ({ obj, token }, { rejectWithValue }) => {
    try {
      CancelToken = axios.CancelToken;
      source = CancelToken.source();

      const response = await axios.post(
        `${baseUrl}/api/v1/favorites/remove`,
        { favoriteId: obj.favoriteId },
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
  },
);

export const addFavoriteItem = createAsyncThunk(
  'favorites/addFavoriteItem',
  async ({ obj, token }, { rejectWithValue }) => {
    try {
      CancelToken = axios.CancelToken;
      source = CancelToken.source();

      const response = await axios.post(
        `${baseUrl}/api/v1/favorites/add/items`,
        { favoriteItemId: obj.favoriteItemId },
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
  },
);

export const removeFavoriteItem = createAsyncThunk(
  'favorites/removeFavoriteItem',
  async ({ obj, token }, { rejectWithValue }) => {
    try {
      CancelToken = axios.CancelToken;
      source = CancelToken.source();

      const response = await axios.post(
        `${baseUrl}/api/v1/favorites/remove/items`,
        { favoriteItemId: obj.favoriteItemId },
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
  },
);

export const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    resetFavorites: (state) => {
      state.status = 'idle';
      state.favorites_partners = [];
      state.favorites_items = [];
      state.error = '';
    },
    resetFavoriteError: (state) => {
      state.status = 'idle';
      state.error = '';
    },
  },
  extraReducers: {
    [getFavorites.pending]: (state) => {
      state.status = 'loading';
      state.error = null;
    },
    [getFavorites.fulfilled]: (state, action) => {
      state.status = 'success';
      if (action.payload.data.favorites !== null) {
        state.favorites_partners = action.payload.data.favorites.favorites;
        state.favorites_items = action.payload.data.favorites.favorites_items;
      }
      state.error = null;
    },
    [getFavorites.rejected]: (state, { payload }) => {
      state.status = 'failed';
      if (payload === 'timeout') {
        state.error = 'timeout-msg';
      } else if (payload === 'cancel') {
        state.error = 'cancel-operation-msg';
      } else if (payload === 'network failed') {
        state.error = 'network failed';
      } else state.error = payload.message;
    },
    [addFavorite.pending]: (state) => {
      state.status = 'loading';
      state.error = null;
    },
    [addFavorite.fulfilled]: (state, action) => {
      state.status = 'success';
      state.favorites_partners = [...state.favorites_partners, action.payload.data.favorite];
      state.error = null;
    },
    [addFavorite.rejected]: (state, { payload }) => {
      state.status = 'failed';
      if (payload === 'timeout') {
        state.error = 'timeout-msg';
      } else if (payload === 'cancel') {
        state.error = 'cancel-operation-msg';
      } else if (payload === 'network failed') {
        state.error = 'network failed';
      } else state.error = payload.message;
    },
    [addFavoriteItem.pending]: (state) => {
      state.status = 'loading';
      state.error = null;
    },
    [addFavoriteItem.fulfilled]: (state, action) => {
      state.status = 'success';
      state.favorites_items = [...state.favorites_items, action.payload.data.favorite];
      state.error = null;
    },
    [addFavorite.rejected]: (state, { payload }) => {
      state.status = 'failed';
      if (payload === 'timeout') {
        state.error = 'timeout-msg';
      } else if (payload === 'cancel') {
        state.error = 'cancel-operation-msg';
      } else if (payload === 'network failed') {
        state.error = 'network failed';
      } else state.error = payload.message;
    },
    [removeFavorite.pending]: (state) => {
      state.status = 'loading';
      state.error = null;
    },
    [removeFavorite.fulfilled]: (state, action) => {
      state.status = 'success';
      state.favorites_partners = state.favorites_partners.filter((fa) => fa._id !== action.payload.data.favorite);
      state.error = null;
    },
    [removeFavorite.rejected]: (state, { payload }) => {
      state.status = 'failed';
      if (payload === 'timeout') {
        state.error = 'timeout-msg';
      } else if (payload === 'cancel') {
        state.error = 'cancel-operation-msg';
      } else if (payload === 'network failed') {
        state.error = 'network failed';
      } else state.error = payload.message;
    },
    [removeFavoriteItem.pending]: (state, action) => {
      state.status = 'loading';
      state.error = null;
    },
    [removeFavoriteItem.fulfilled]: (state, action) => {
      state.status = 'success';
      state.favorites_items = state.favorites_items.filter((fa) => fa._id !== action.payload.data.favorite);
      state.error = null;
    },
    [removeFavoriteItem.rejected]: (state, { payload }) => {
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

export const { resetFavorites, resetFavoriteError } = favoritesSlice.actions;

export const selectFavoritesPartners = (state) => state.favorites.favorites_partners;
export const selectFavoritesItems = (state) => state.favorites.favorites_items;
export const selectFavorites = (state) => state.favorites;

export default favoritesSlice.reducer;
