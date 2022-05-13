import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { BASEURL } from '../../utils/constants';

const initialState = {
  status: 'idle',
  completed: 'loading',
  settings: {
    companiesSectionOne: {
      show: true,
      title: 'company section one title',
      description: 'company section one description',
      order: 1,
    },
    companiesSectionTwo: {
      show: true,
      title: 'company section two title',
      description: 'company section two description',
      order: 1,
    },
    warehousesSectionOne: {
      show: true,
      title: 'warehouse section one title',
      description: 'warehouse section one description',
      order: 1,
    },
    itemsSectionOne: {
      show: true,
      title: 'item section one title',
      description: 'item section one description',
      order: 1,
    },
    itemsSectionTwo: {
      show: true,
      title: 'item section two title',
      description: 'company section two description',
      order: 1,
    },
    itemsSectionThree: {
      show: true,
      title: 'item section three title',
      description: 'item section three description',
      order: 1,
    },
    showAdvertisements: false,
    showWarehouseItem: false,
    saveOrders: false,
  },
  error: '',
};

let CancelToken;
let source;

export const getAllSettings = createAsyncThunk('settings/getAllSetting', async ({ token, rejectWithValue }) => {
  try {
    CancelToken = axios.CancelToken;
    source = CancelToken.source();

    const response = await axios.get(`${BASEURL}/settings`, {
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
});

export const settingsSlice = createSlice({
  name: 'settingsSlice',
  initialState,
  reducers: {
    resetSettingStatus: (state) => {
      state.status = 'idle';
    },
    resetSettingError: (state) => {
      state.status = 'idle';
      state.error = '';
    },
    resetSetting: (state) => {
      state.status = 'idle';
      state.completed = 'loading';
      state.error = '';
      state.settings = {
        companiesSectionOne: {
          show: true,
          title: 'company section one title',
          description: 'company section one description',
          order: 1,
        },
        companiesSectionTwo: {
          show: true,
          title: 'company section two title',
          description: 'company section two description',
          order: 1,
        },
        warehousesSectionOne: {
          show: true,
          title: 'warehouse section one title',
          description: 'warehouse section one description',
          order: 1,
        },
        itemsSectionOne: {
          show: true,
          title: 'item section one title',
          description: 'item section one description',
          order: 1,
        },
        itemsSectionTwo: {
          show: true,
          title: 'item section two title',
          description: 'company section two description',
          order: 1,
        },
        itemsSectionThree: {
          show: true,
          title: 'item section three title',
          description: 'item section three description',
          order: 1,
        },
      };
    },
    settingsSignOut: (state) => {
      state.status = 'idle';
      state.completed = 'loading';
      state.error = '';
      state.settings = {
        companiesSectionOne: {
          show: true,
          title: 'company section one title',
          description: 'company section one description',
          order: 1,
        },
        companiesSectionTwo: {
          show: true,
          title: 'company section two title',
          description: 'company section two description',
          order: 1,
        },
        warehousesSectionOne: {
          show: true,
          title: 'warehouse section one title',
          description: 'warehouse section one description',
          order: 1,
        },
        itemsSectionOne: {
          show: true,
          title: 'item section one title',
          description: 'item section one description',
          order: 1,
        },
        itemsSectionTwo: {
          show: true,
          title: 'item section two title',
          description: 'company section two description',
          order: 1,
        },
        itemsSectionThree: {
          show: true,
          title: 'item section three title',
          description: 'item section three description',
          order: 1,
        },
      };
    },
    socketUpdateSettings: (state, action) => {
      state.settings = {
        ...state.settings,
        ...action.payload,
      };
    },
  },
  extraReducers: {
    [getAllSettings.pending]: (state) => {
      state.status = 'loading';
    },
    [getAllSettings.fulfilled]: (state, action) => {
      state.status = 'succeeded';
      state.completed = 'done';
      state.settings = action.payload.data.settings[0];
    },
    [getAllSettings.rejected]: (state, { payload }) => {
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

export const selectSettings = (state) => state.settings;
export const selectCompaniesSectionOneFromSettings = (state) => state.settings.settings.companiesSectionOne;
export const selectCompaniesSectionTwoFromSettings = (state) => state.settings.settings.companiesSectionTwo;
export const selectWarehousesSectionOneFromSettings = (state) => state.settings.settings.warehousesSectionOne;
export const selectItemsSectionOneFromSettings = (state) => state.settings.settings.itemsSectionOne;
export const selectItemsSectionTwoFromSettings = (state) => state.settings.settings.itemsSectionTwo;
export const selectItemsSectionThreeFromSettings = (state) => state.settings.settings.itemsSectionThree;

export const { resetSettingStatus, resetSettingError, resetSetting, settingsSignOut, socketUpdateSettings } =
  settingsSlice.actions;

export default settingsSlice.reducer;
