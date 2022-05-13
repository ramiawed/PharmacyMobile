import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { BASEURL } from '../../utils/constants';

let CancelToken;
let source;

const initialState = {
  status: 'idle',
  statistics: [],
  count: 0,
  error: '',
  pageState: {
    searchName: '',
    date: '',
    dateOption: '',
    page: 1,
  },
};

export const addStatistics = createAsyncThunk(
  'statistics/addStatistics',
  async ({ obj, token }, { rejectWithValue }) => {
    try {
      CancelToken = axios.CancelToken;
      source = CancelToken.source();

      const response = await axios.post(`${BASEURL}/statistics`, obj, {
        // timeout: 10000,
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

export const statisticsSlice = createSlice({
  name: 'statisticsSlice',
  initialState,
  reducers: {},
});

export const selectStatistics = (state) => state.statistics;

export default statisticsSlice.reducer;
