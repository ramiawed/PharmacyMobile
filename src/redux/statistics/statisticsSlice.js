import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { baseUrl } from '../../utils/constants';

const initialState = {
  status: 'idle',
  statistics: [],
  count: 0,
  error: '',
};

export const getStatistics = createAsyncThunk('statistics/getStatistics', async ({ obj }, { rejectWithValue }) => {
  try {
    let response;
    let queryString = '';

    if (obj.type === 'users') {
      queryString = `${baseUrl}/api/v1/statistics/users?page=${obj.page}&limit=${obj.limit}&field=${obj.field}`;
    } else {
      queryString = `${baseUrl}/api/v1/statistics/items?page=${obj.page}&limit=${obj.limit}&field=${obj.field}`;
    }

    if (obj.name) {
      queryString = queryString + `&name=${obj.name}`;
    }

    if (obj.date) {
      queryString = queryString + `&date=${obj.date}&date1=${obj.date1}`;
    }

    response = await axios.get(queryString);

    return response.data;
  } catch (err) {
    return rejectWithValue(err.message.data);
  }
});

// user sign in
export const statisticsSignin = createAsyncThunk('statistics/signin', async ({ token }, { rejectWithValue }) => {
  try {
    const response = await axios.post(
      `${baseUrl}/api/v1/statistics/signin`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return response.data;
  } catch (err) {
    return rejectWithValue(err.response.data);
  }
});

// select a company
export const statisticsCompanySelected = createAsyncThunk(
  'statistics/selectedCompany',
  async ({ obj, token }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${baseUrl}/api/v1/statistics/selectedCompany`, obj, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  },
);

// orders
export const statisticsOrders = createAsyncThunk('statistics/orders', async ({ token }, { rejectWithValue }) => {
  try {
    const response = await axios.post(
      `${baseUrl}/api/v1/statistics/orders`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return response.data;
  } catch (err) {
    return rejectWithValue(err.response.data);
  }
});

// user added to another user's favorites
export const statisticsUserFavorites = createAsyncThunk(
  'statistics/favorite',
  async ({ obj, token }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${baseUrl}/api/v1/statistics/favorite`, obj, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  },
);

// item added to user item's favorites
export const statisticsItemFavorites = createAsyncThunk(
  'statistics/favoriteItem',
  async ({ obj, token }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${baseUrl}/api/v1/statistics/favoriteItem`, obj, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  },
);

// item added to cart
export const statisticsItemAddedToCart = createAsyncThunk(
  'statistics/itemAddedToCart',
  async ({ obj, token }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${baseUrl}/api/v1/statistics/itemAddedToCart`, obj, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  },
);

// item selected
export const statisticsItemSelected = createAsyncThunk(
  'statistics/selectedItem',
  async ({ obj, token }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${baseUrl}/api/v1/statistics/selectedItem`, obj, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  },
);

export const statisticsSlice = createSlice({
  name: 'statisticsSlice',
  initialState,
  reducers: {
    resetStatisticsStatus: (state) => {
      state.status = 'idle';
    },
    resetStatisticsError: (state) => {
      state.status = 'idle';
      state.error = '';
    },
    resetStatistics: (state) => {
      state.status = 'idle';
      state.statistics = [];
      state.count = 0;
      state.error = '';
    },
  },
  extraReducers: {
    [getStatistics.pending]: (state, action) => {
      state.status = 'loading';
    },
    [getStatistics.fulfilled]: (state, action) => {
      state.status = 'success';
      state.statistics = [...state.statistics, ...action.payload.data.data];
      state.count = action.payload.count;
    },
    [getStatistics.rejected]: (state, action) => {
      state.status = 'failed';
    },
  },
});

export const selectStatistics = (state) => state.statistics;

export const { resetStatisticsStatus, resetStatisticsError, resetStatistics } = statisticsSlice.actions;

export default statisticsSlice.reducer;
