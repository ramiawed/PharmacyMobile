import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { BASEURL } from "../../utils/constants";

let CancelToken = null;
let source = null;

const initialState = {
  status: "idle",
  updateStatus: "idle",
  changeLogoStatus: "idle",
  changePasswordStatus: "idle",
  deleteStatus: "idle",
  user: null,
  token: "",
  error: "",
  updateError: "",
  passwordError: "",
  deleteError: "",
  changeLogoError: "",
};

export const cancelOperation = () => {
  if (source) {
    source.cancel("operation canceled by user");
  }
};

const resetCancelAndSource = () => {
  CancelToken = null;
  source = null;
};

export const authSign = createAsyncThunk(
  "auth/signin",
  async ({ username, password, version }, { rejectWithValue }) => {
    try {
      CancelToken = axios.CancelToken;
      source = CancelToken.source();

      const response = await axios.post(
        `${BASEURL}/users/signin`,
        {
          username: username.trim(),
          password,
          version,
        },
        {
          cancelToken: source.token,
        }
      );

      resetCancelAndSource();

      return response.data;
    } catch (err) {
      resetCancelAndSource();
      if (err.code === "ECONNABORTED" && err.message.startsWith("timeout")) {
        return rejectWithValue("timeout");
      }
      if (axios.isCancel(err)) {
        return rejectWithValue("cancel");
      }

      if (!err.response) {
        return rejectWithValue("network failed");
      }

      return rejectWithValue(err.response.data);
    }
  }
);

export const authSignWithToken = createAsyncThunk(
  "auth/authSignWithToken",
  async ({ token, version }, { rejectWithValue }) => {
    try {
      CancelToken = axios.CancelToken;
      source = CancelToken.source();

      const response = await axios.post(
        `${BASEURL}/users/signinwithtoken`,
        {
          token,
          version,
        },
        {
          cancelToken: source.token,
        }
      );

      resetCancelAndSource();

      return response.data;
    } catch (err) {
      resetCancelAndSource();
      if (err.code === "ECONNABORTED" && err.message.startsWith("timeout")) {
        return rejectWithValue("timeout");
      }
      if (axios.isCancel(err)) {
        return rejectWithValue("cancel");
      }

      if (!err.response) {
        return rejectWithValue("network failed");
      }

      return rejectWithValue(err.response.data);
    }
  }
);

export const saveExpoPushToken = createAsyncThunk(
  "auth/saveExpoPushToken",
  async ({ expoPushToken, token }, { rejectWithValue }) => {
    try {
      CancelToken = axios.CancelToken;
      source = CancelToken.source();
      const response = await axios.post(
        `${BASEURL}/users/store-expo-push-token?expoPushToken=${expoPushToken}`,
        {},
        {
          cancelToken: source.token,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      resetCancelAndSource();

      return response.data;
    } catch (err) {
      resetCancelAndSource();
      if (err.code === "ECONNABORTED" && err.message.startsWith("timeout")) {
        return rejectWithValue("timeout");
      }
      if (axios.isCancel(err)) {
        return rejectWithValue("cancel");
      }

      if (!err.response) {
        return rejectWithValue("network failed");
      }

      return rejectWithValue(err.response.data);
    }
  }
);

export const clearExpoPushToken = createAsyncThunk(
  "auth/clearExpoPushToken",
  async ({ expoPushToken, token }, { rejectWithValue }) => {
    try {
      CancelToken = axios.CancelToken;
      source = CancelToken.source();

      const response = await axios.post(
        `${BASEURL}/users/clear-expo-push-token?expoPushToken=${expoPushToken}`,
        {},
        {
          cancelToken: source.token,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      resetCancelAndSource();

      return response.data;
    } catch (err) {
      resetCancelAndSource();
      if (err.code === "ECONNABORTED" && err.message.startsWith("timeout")) {
        return rejectWithValue("timeout");
      }
      if (axios.isCancel(err)) {
        return rejectWithValue("cancel");
      }

      if (!err.response) {
        return rejectWithValue("network failed");
      }

      return rejectWithValue(err.response.data);
    }
  }
);

export const updateUserInfo = createAsyncThunk(
  "auth/updateUser",
  async ({ obj, token }, { rejectWithValue }) => {
    try {
      CancelToken = axios.CancelToken;
      source = CancelToken.source();

      const response = await axios.post(`${BASEURL}/users/updateMe`, obj, {
        cancelToken: source.token,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      resetCancelAndSource();
      return response.data;
    } catch (err) {
      resetCancelAndSource();
      // timeout finished
      if (err.code === "ECONNABORTED" && err.message.startsWith("timeout")) {
        return rejectWithValue("timeout");
      }

      // the operation had canceled
      if (axios.isCancel(err)) {
        return rejectWithValue("cancel");
      }

      // no response from server
      // or no url for this request
      if (!err.response) {
        return rejectWithValue("network failed");
      }

      return rejectWithValue(err.response.data);
    }
  }
);

export const changeMyPassword = createAsyncThunk(
  "auth/changeMyPassword",
  async ({ obj, token }, { rejectWithValue }) => {
    try {
      CancelToken = axios.CancelToken;
      source = CancelToken.source();

      const response = await axios.post(
        `${BASEURL}/users/changeMyPassword`,
        obj,
        {
          cancelToken: source.token,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      resetCancelAndSource();
      return response.data;
    } catch (err) {
      resetCancelAndSource();
      if (err.code === "ECONNABORTED" && err.message.startsWith("timeout")) {
        return rejectWithValue("timeout");
      }
      if (axios.isCancel(err)) {
        return rejectWithValue("cancel");
      }
      if (!err.response) {
        return rejectWithValue("network failed");
      }
      return rejectWithValue(err.response.data);
    }
  }
);

export const deleteMe = createAsyncThunk(
  "auth/deleteMe",
  async ({ obj, token }, { rejectWithValue }) => {
    try {
      CancelToken = axios.CancelToken;
      source = CancelToken.source();

      const response = await axios.post(`${BASEURL}/users/deleteMe`, obj, {
        cancelToken: source.token,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      resetCancelAndSource();
      return response.data;
    } catch (err) {
      resetCancelAndSource();
      if (err.code === "ECONNABORTED" && err.message.startsWith("timeout")) {
        return rejectWithValue("timeout");
      }
      if (axios.isCancel(err)) {
        return rejectWithValue("cancel");
      }
      if (!err.response) {
        return rejectWithValue("network failed");
      }
      return rejectWithValue(err.response.data);
    }
  }
);

export const changeLogo = createAsyncThunk(
  "auth/changeLogo",
  async ({ data, token }, { rejectWithValue }) => {
    // try {
    //   CancelToken = axios.CancelToken;
    //   source = CancelToken.source();
    //   const response = await axios.post(`${BASEURL}/users/upload`, data, {
    //     cancelToken: source.token,
    //     headers: {
    //       "Content-Type": "multipart/form-data",
    //       Authorization: `Bearer ${token}`,
    //     },
    //   });
    //   resetCancelAndSource();
    //   return response.data;
    // } catch (err) {
    //   resetCancelAndSource();
    //   if (err.code === "ECONNABORTED" && err.message.startsWith("timeout")) {
    //     return rejectWithValue("timeout");
    //   }
    //   if (axios.isCancel(err)) {
    //     return rejectWithValue("cancel");
    //   }
    //   if (!err.response) {
    //     return rejectWithValue("network failed");
    //   }
    //   return rejectWithValue(err.response.data);
    // }
  }
);

export const addCompanyToOurCompanies = createAsyncThunk(
  "auth/addCompanyToOurs",
  async ({ companyId, token }, { rejectWithValue }) => {
    try {
      CancelToken = axios.CancelToken;
      source = CancelToken.source();

      const response = await axios.post(
        `${BASEURL}/users/add-company-to-ours?companyId=${companyId}`,
        {},
        {
          cancelToken: source.token,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      resetCancelAndSource();

      return response.data;
    } catch (err) {
      resetCancelAndSource();
      if (err.code === "ECONNABORTED" && err.message.startsWith("timeout")) {
        return rejectWithValue("timeout");
      }
      if (axios.isCancel(err)) {
        return rejectWithValue("cancel");
      }
      if (!err.response) {
        return rejectWithValue("network failed");
      }
      return rejectWithValue(err.response.data);
    }
  }
);

export const removeCompanyFromOurCompanies = createAsyncThunk(
  "auth/removeCompanyFromOurs",
  async ({ companyId, token }, { rejectWithValue }) => {
    try {
      CancelToken = axios.CancelToken;
      source = CancelToken.source();

      const response = await axios.post(
        `${BASEURL}/users/remove-company-from-ours?companyId=${companyId}`,
        {},
        {
          cancelToken: source.token,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      resetCancelAndSource();

      return response.data;
    } catch (err) {
      resetCancelAndSource();
      if (err.code === "ECONNABORTED" && err.message.startsWith("timeout")) {
        return rejectWithValue("timeout");
      }
      if (axios.isCancel(err)) {
        return rejectWithValue("cancel");
      }
      if (!err.response) {
        return rejectWithValue("network failed");
      }
      return rejectWithValue(err.response.data);
    }
  }
);

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    resetError: (state) => {
      state.status = "idle";
      state.error = "";
    },
    resetStatus: (state) => {
      state.status = "idle";
      state.error = "";
    },
    signOut: (state) => {
      state.status = "idle";
      state.updateStatus = "idle";
      state.user = null;
      state.token = "";
      state.error = "";
      state.passwordError = "";
      state.deleteError = "";
      state.changeLogoStatus = "idle";
      state.changeLogoError = "";
    },

    resetUpdateStatus: (state) => {
      state.updateStatus = "idle";
    },
    resetUpdateError: (state) => {
      state.updateStatus = "idle";
      state.updateError = "";
    },

    resetPasswordStatus: (state) => {
      state.changePasswordStatus = "idle";
    },
    resetPasswordError: (state) => {
      state.changePasswordStatus = "idle";
      state.passwordError = "";
    },

    resetDeleteStatus: (state) => {
      state.deleteStatus = "idle";
    },
    resetDeleteError: (state) => {
      state.deleteStatus = "idle";
      state.deleteError = "";
    },

    resetChangeLogoStatus: (state) => {
      state.changeLogoStatus = "idle";
      state.changeLogoError = "";
    },
    resetChangeLogoError: (state) => {
      state.changeLogoError = "";
    },
    changeLogoURL: (state, action) => {
      state.user = {
        ...state.user,
        logo_url: action.payload,
      };
    },
    authSliceSignOut: (state) => {
      state.status = "idle";
      state.updateStatus = "idle";
      state.changeLogoStatus = "idle";
      state.changePasswordStatus = "idle";
      state.deleteStatus = "idle";
      state.user = null;
      state.token = "";
      state.error = "";
      state.updateError = "";
      state.passwordError = "";
      state.deleteError = "";
      state.changeLogoError = "";
    },
  },
  extraReducers: {
    // use sign in lifecycle
    [authSign.pending]: (state, action) => {
      state.status = "loading";
      state.error = "";
    },
    [authSign.fulfilled]: (state, action) => {
      state.status = "succeeded";
      state.token = action.payload.token;
      state.user = action.payload.data.user;
      state.error = "";
    },
    [authSign.rejected]: (state, { error, meta, payload }) => {
      state.status = "failed";
      state.token = "";
      state.user = null;

      try {
        if (payload === "timeout") {
          state.error = "general-error";
        } else if (payload === "cancel") {
          state.error = "general-error";
        } else if (payload === "network failed") {
          state.error = "general-error";
        } else state.error = payload.message;
      } catch (err) {
        state.error = "general-error";
      }
    },

    [authSignWithToken.pending]: (state, action) => {
      state.status = "loading";
      state.error = "";
    },
    [authSignWithToken.fulfilled]: (state, action) => {
      state.status = "succeeded";
      state.token = action.payload.token;
      state.user = action.payload.data.user;
      state.error = "";
    },
    [authSignWithToken.rejected]: (state, { error, meta, payload }) => {
      state.status = "failed";
      state.user = null;

      try {
        if (payload === "timeout") {
          state.error = "general-error";
        } else if (payload === "cancel") {
          state.error = "general-error";
        } else if (payload === "network failed") {
          state.error = "general-error";
        } else state.error = payload.message;
      } catch (err) {
        state.error = "general-error";
      }
    },

    // user update info lifecycle
    [updateUserInfo.pending]: (state) => {
      state.updateStatus = "loading";
    },
    [updateUserInfo.fulfilled]: (state, action) => {
      state.updateStatus = "succeeded";
      state.user = action.payload.data.user;
    },
    [updateUserInfo.rejected]: (state, { payload }) => {
      state.updateStatus = "failed";

      try {
        if (payload === "timeout") {
          state.error = "general-error";
        } else if (payload === "cancel") {
          state.error = "general-error";
        } else if (payload === "network failed") {
          state.error = "general-error";
        } else state.error = payload.message;
      } catch (err) {
        state.error = "general-error";
      }
    },

    // change password lifecycle
    [changeMyPassword.pending]: (state) => {
      state.changePasswordStatus = "loading";
      state.passwordError = "";
    },
    [changeMyPassword.fulfilled]: (state, action) => {
      state.changePasswordStatus = "succeeded";
      // state.user = action.payload.data.user;
    },
    [changeMyPassword.rejected]: (state, { error, meta, payload }) => {
      state.changePasswordStatus = "failed";

      try {
        if (payload === "timeout") {
          state.error = "general-error";
        } else if (payload === "cancel") {
          state.error = "general-error";
        } else if (payload === "network failed") {
          state.error = "general-error";
        } else state.error = payload.message;
      } catch (err) {
        state.error = "general-error";
      }
    },

    // delete me lifecycle
    [deleteMe.pending]: (state) => {
      state.deleteStatus = "loading";
      state.deleteError = "";
    },
    [deleteMe.fulfilled]: (state) => {
      state.deleteStatus = "succeeded";
      state.user = null;
    },
    [deleteMe.rejected]: (state, { payload }) => {
      state.deleteStatus = "failed";

      try {
        if (payload === "timeout") {
          state.error = "general-error";
        } else if (payload === "cancel") {
          state.error = "general-error";
        } else if (payload === "network failed") {
          state.error = "general-error";
        } else state.error = payload.message;
      } catch (err) {
        state.error = "general-error";
      }
    },
    [addCompanyToOurCompanies.pending]: (state, action) => {
      state.status = "loading";
      state.error = "";
    },
    [addCompanyToOurCompanies.fulfilled]: (state, action) => {
      state.status = "succeeded";
      state.user = {
        ...state.user,
        ourCompanies: [
          ...state.user.ourCompanies,
          action.payload.data.companyId,
        ],
      };
      state.error = "";
    },
    [addCompanyToOurCompanies.rejected]: (state, { error, meta, payload }) => {
      state.status = "failed";
      try {
        if (payload === "timeout") {
          state.error = "general-error";
        } else if (payload === "cancel") {
          state.error = "general-error";
        } else if (payload === "network failed") {
          state.error = "general-error";
        } else state.error = payload.message;
      } catch (err) {
        state.error = "general-error";
      }
    },

    [removeCompanyFromOurCompanies.pending]: (state, action) => {
      state.status = "loading";
      state.error = "";
    },
    [removeCompanyFromOurCompanies.fulfilled]: (state, action) => {
      state.status = "succeeded";
      state.user = {
        ...state.user,
        ourCompanies: state.user.ourCompanies.filter(
          (c) => c !== action.payload.data.companyId
        ),
      };
      state.error = "";
    },
    [removeCompanyFromOurCompanies.rejected]: (
      state,
      { error, meta, payload }
    ) => {
      state.status = "failed";
      try {
        if (payload === "timeout") {
          state.error = "general-error";
        } else if (payload === "cancel") {
          state.error = "general-error";
        } else if (payload === "network failed") {
          state.error = "general-error";
        } else state.error = payload.message;
      } catch (err) {
        state.error = "general-error";
      }
    },
    // change the logo of a user lifecycle
    [saveExpoPushToken.pending]: (state) => {},
    [saveExpoPushToken.fulfilled]: (state, action) => {},
    [saveExpoPushToken.rejected]: (state, { payload }) => {},

    // // change the logo of a user lifecycle
    // [changeLogo.pending]: (state) => {
    //   state.changeLogoStatus = "loading";
    // },
    // [changeLogo.fulfilled]: (state, action) => {
    //   state.changeLogoStatus = "succeeded";
    //   state.user = action.payload.data.user;
    // },
    // [changeLogo.rejected]: (state, { payload }) => {
    //   state.changeLogoStatus = "failed";

    //   try {
    //     if (payload === "timeout") {
    //       state.error = "general-error";
    //     } else if (payload === "cancel") {
    //       state.error = "general-error";
    //     } else if (payload === "network failed") {
    //       state.error = "general-error";
    //     } else state.error = payload.message;
    //   } catch (err) {
    //     state.error = "general-error";
    //   }
    // },
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
  authSliceSignOut,
  changeLogoURL,
} = authSlice.actions;

export const selectToken = (state) => state.auth.token;
export const selectUser = (state) => state.auth.user;
export const selectError = (state) => state.auth.error;
export const selectStatus = (state) => state.auth.status;
export const selectUserData = (state) => state.auth;

export default authSlice.reducer;
