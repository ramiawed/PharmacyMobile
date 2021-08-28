import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { baseUrl } from '../../utils/constants';

let CancelToken;
let source;

const initialState = {
  status: 'idle',
  updateStatus: 'idle',
  changeLogoStatus: 'idle',
  changePasswordStatus: 'idle',
  deleteStatus: 'idle',
  user: null,
  token: '',
  error: '',
  updateError: '',
  passwordError: '',
  deleteError: '',
  changeLogoError: '',
};

export const cancelOperation = () => {
  if (source) {
    source.cancel('operation canceled by user');
  }
};

export const authSign = createAsyncThunk('auth/signin', async ({ username, password }, { rejectWithValue }) => {
  try {
    CancelToken = axios.CancelToken;
    source = CancelToken.source();

    console.log(username, password);

    const response = await axios.post(
      `${baseUrl}/api/v1/users/signin`,
      {
        username,
        password,
      },
      {
        timeout: 10000,
        cancelToken: source.token,
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

// export const authSignup = createAsyncThunk(
//   "auth/signup",
//   async ({ obj, token }, { rejectWithValue }) => {
//     try {
//       CancelToken = axios.CancelToken;
//       source = CancelToken.source();

//       const response = await axios.post(
//         "http://localhost:8000/api/v1/users/signup",
//         obj,
//         {
//           timeout: 10000,
//           cancelToken: source.token,
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       return response.data;
//     } catch (err) {
//       if (err.code === "ECONNABORTED" && err.message.startsWith("timeout")) {
//         return rejectWithValue("timeout");
//       }
//       if (axios.isCancel(err)) {
//         return rejectWithValue("cancel");
//       }
//       return rejectWithValue(err.response.data);
//     }
//   }
// );

export const updateUserInfo = createAsyncThunk('auth/updateUser', async ({ obj, token }, { rejectWithValue }) => {
  try {
    CancelToken = axios.CancelToken;
    source = CancelToken.source();

    const response = await axios.post('http://localhost:8000/api/v1/users/updateMe', obj, {
      timeout: 10000,
      cancelToken: source.token,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (err) {
    // timeout finished
    if (err.code === 'ECONNABORTED' && err.message.startsWith('timeout')) {
      return rejectWithValue('timeout');
    }

    // the operation had canceled
    if (axios.isCancel(err)) {
      return rejectWithValue('cancel');
    }

    // no response from server
    // or no url for this request
    if (!err.response) {
      return rejectWithValue('network failed');
    }

    return rejectWithValue(err.response.data);
  }
});

export const changeMyPassword = createAsyncThunk(
  'auth/changeMyPassword',
  async ({ obj, token }, { rejectWithValue }) => {
    try {
      CancelToken = axios.CancelToken;
      source = CancelToken.source();

      const response = await axios.post('http://localhost:8000/api/v1/users/changeMyPassword', obj, {
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

export const deleteMe = createAsyncThunk('auth/deleteMe', async ({ obj, token }, { rejectWithValue }) => {
  try {
    CancelToken = axios.CancelToken;
    source = CancelToken.source();

    const response = await axios.post('http://localhost:8000/api/v1/users/deleteMe', obj, {
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

export const changeLogo = createAsyncThunk('auth/changeLogo', async ({ data, token }, { rejectWithValue }) => {
  try {
    CancelToken = axios.CancelToken;
    source = CancelToken.source();

    const response = await axios.post('http://localhost:8000/api/v1/users/upload', data, {
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

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    resetError: (state) => {
      state.status = 'idle';
      state.error = '';
    },
    resetStatus: (state) => {
      state.status = 'idle';
      state.error = '';
    },
    signOut: (state) => {
      state.status = 'idle';
      state.updateStatus = 'idle';
      state.user = null;
      state.token = '';
      state.error = '';
      state.passwordError = '';
      state.deleteError = '';
      state.changeLogoStatus = 'idle';
      state.changeLogoError = '';
    },

    resetUpdateStatus: (state) => {
      state.updateStatus = 'idle';
    },
    resetUpdateError: (state) => {
      state.updateStatus = 'idle';
      state.updateError = '';
    },

    resetPasswordStatus: (state) => {
      state.changePasswordStatus = 'idle';
    },
    resetPasswordError: (state) => {
      state.changePasswordStatus = 'idle';
      state.passwordError = '';
    },

    resetDeleteStatus: (state) => {
      state.deleteStatus = 'idle';
    },
    resetDeleteError: (state) => {
      state.deleteStatus = 'idle';
      state.deleteError = '';
    },

    resetChangeLogoStatus: (state) => {
      state.changeLogoStatus = 'idle';
      state.changeLogoError = '';
    },
    resetChangeLogoError: (state) => {
      state.changeLogoError = '';
    },
  },
  extraReducers: {
    // use sign in lifecycle
    [authSign.pending]: (state, action) => {
      state.status = 'loading';
      state.error = '';
    },
    [authSign.fulfilled]: (state, action) => {
      state.status = 'succeeded';
      state.token = action.payload.token;
      state.user = action.payload.data.user;
      state.error = '';
    },
    [authSign.rejected]: (state, { error, meta, payload }) => {
      state.status = 'failed';
      state.token = '';
      state.user = null;

      if (payload === 'timeout') {
        state.error = 'timeout-msg';
      } else if (payload === 'cancel') {
        state.error = 'cancel-operation-msg';
      } else if (payload === 'network failed') {
        state.error = 'network failed';
      } else state.error = payload.message;
    },

    // user update info lifecycle
    [updateUserInfo.pending]: (state) => {
      state.updateStatus = 'loading';
    },
    [updateUserInfo.fulfilled]: (state, action) => {
      state.updateStatus = 'succeeded';
      state.user = action.payload.data.user;
    },
    [updateUserInfo.rejected]: (state, { payload }) => {
      state.updateStatus = 'failed';
      if (payload === 'timeout') {
        state.updateError = 'timeout';
      } else if (payload === 'cancel') {
        state.updateError = 'cancel';
      } else if (payload === 'network failed') {
        state.updateError = 'network failed';
      } else state.updateError = payload.message;
    },

    // change password lifecycle
    [changeMyPassword.pending]: (state) => {
      state.changePasswordStatus = 'loading';
      state.passwordError = '';
    },
    [changeMyPassword.fulfilled]: (state, action) => {
      state.changePasswordStatus = 'succeeded';
      state.user = action.payload.data.user;
    },
    [changeMyPassword.rejected]: (state, { error, meta, payload }) => {
      state.changePasswordStatus = 'failed';
      if (payload === 'timeout') {
        state.passwordError = payload;
      } else if (payload === 'cancel') {
        state.passwordError = 'cancel-operation-msg';
      } else if (payload === 'network failed') {
        state.passwordError = 'network failed';
      } else state.passwordError = payload.message;
    },

    // delete me lifecycle
    [deleteMe.pending]: (state) => {
      state.deleteStatus = 'loading';
      state.deleteError = '';
    },
    [deleteMe.fulfilled]: (state) => {
      state.deleteStatus = 'succeeded';
      state.user = null;
    },
    [deleteMe.rejected]: (state, { payload }) => {
      state.deleteStatus = 'failed';
      if (payload === 'timeout') {
        state.deleteError = 'timeout-msg';
      } else if (payload === 'cancel') {
        state.deleteError = 'cancel-operation-msg';
      } else if (payload === 'network failed') {
        state.deleteError = 'network failed';
      } else state.deleteError = payload.message;
    },

    // change the logo of a user lifecycle
    [changeLogo.pending]: (state) => {
      state.changeLogoStatus = 'loading';
    },
    [changeLogo.fulfilled]: (state, action) => {
      state.changeLogoStatus = 'succeeded';
      state.user = action.payload.data.user;
    },
    [changeLogo.rejected]: (state, { payload }) => {
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
  resetError,
  resetStatus,
  signOut,
  resetPasswordStatus,
  resetPasswordError,
  resetDeleteStatus,
  resetDeleteError,
  resetChangeLogoStatus,
  resetChangeLogoError,
  resetUpdateStatus,
  resetUpdateError,
} = authSlice.actions;

export const selectToken = (state) => state.auth.token;
export const selectUser = (state) => state.auth.user;
export const selectError = (state) => state.auth.error;
export const selectStatus = (state) => state.auth.status;
export const selectUserData = (state) => state.auth;

export default authSlice.reducer;
