import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import axios from "../../api/pharmacy";
import axios from "axios";

let CancelToken;
let source;

const initialState = {
  status: "idle",
  users: null,
  error: "",
  count: 0,
  // field holds the activation or deleting status
  activationDeleteStatus: "idle",
  // field holds the activation or deleting message
  activationDeleteStatusMsg: "",
  resetUserPasswordStatus: "idle",
  resetUserPasswordError: "",
};

export const cancelOperation = () => {
  source.cancel("operation canceled by user");
};

// get the users
export const getUsers = createAsyncThunk(
  "users/get",
  async ({ queryString, token }, { rejectWithValue }) => {
    try {
      CancelToken = axios.CancelToken;
      source = CancelToken.source();

      let buildUrl = `/users?page=${queryString.page}&limit=9`;

      if (queryString.name) {
        buildUrl = buildUrl + `&name=${queryString.name}`;
      }

      if (queryString.type) {
        buildUrl = buildUrl + `&type=${queryString.type}`;
      }

      if (queryString.city) {
        buildUrl = buildUrl + `&city=${queryString.city}`;
      }

      if (queryString.district) {
        buildUrl = buildUrl + `&district=${queryString.district}`;
      }

      if (queryString.street) {
        buildUrl = buildUrl + `&street=${queryString.street}`;
      }

      if (queryString.employeeName) {
        buildUrl = buildUrl + `&employeeName=${queryString.employeeName}`;
      }

      if (queryString.certificateName) {
        buildUrl = buildUrl + `&certificateName=${queryString.certificateName}`;
      }

      if (queryString.companyName) {
        buildUrl = buildUrl + `&companyName=${queryString.companyName}`;
      }

      if (queryString.jobTitle) {
        buildUrl = buildUrl + `&jobTitle=${queryString.jobTitle}`;
      }

      if (queryString.job) {
        buildUrl = buildUrl + `&job=${queryString.job}`;
      }

      if (queryString.approve !== undefined) {
        buildUrl = buildUrl + `&isApproved=${queryString.approve}`;
      }

      if (queryString.active !== undefined) {
        buildUrl = buildUrl + `&isActive=${queryString.active}`;
      }

      if (queryString.sort) {
        buildUrl = buildUrl + `&sort=${queryString.sort.replace(/,/g, " ")}`;
      }

      const response = await axios.get(
        `http://localhost:8000/api/v1${buildUrl}`,
        {
          timeout: 10000,
          cancelToken: source.token,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data;
    } catch (err) {
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

// change the approve state for a specific user
export const userApproveChange = createAsyncThunk(
  "users/approve",
  async ({ status, userId, token }, { rejectWithValue }) => {
    try {
      CancelToken = axios.CancelToken;
      source = CancelToken.source();

      const response = await axios.post(
        `http://localhost:8000/api/v1/users/approve/${userId}`,
        {
          action: status,
        },
        {
          timeout: 10000,
          cancelToken: source.token,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (err) {
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

// delete a user
export const deleteUser = createAsyncThunk(
  "users/delete",
  async ({ userId, token }, { rejectWithValue }) => {
    try {
      CancelToken = axios.CancelToken;
      source = CancelToken.source();

      const response = await axios.post(
        `http://localhost:8000/api/v1/users/delete/${userId}`,
        {},
        {
          timeout: 10000,
          cancelToken: source.token,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data;
    } catch (err) {
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

// undo delete a user
export const undoDeleteUser = createAsyncThunk(
  "users/undoDelete",
  async ({ userId, token }, { rejectWithValue }) => {
    try {
      CancelToken = axios.CancelToken;
      source = CancelToken.source();

      const response = await axios.post(
        `http://localhost:8000/api/v1/users/reactivate/${userId}`,
        {},
        {
          timeout: 10000,
          cancelToken: source.token,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data;
    } catch (err) {
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

export const resetUserPassword = createAsyncThunk(
  "users/resetPassword",
  async (
    { userId, newPassword, newPasswordConfirm, token },
    { rejectWithValue }
  ) => {
    try {
      CancelToken = axios.CancelToken;
      source = CancelToken.source();

      const response = await axios.post(
        `http://localhost:8000/api/v1/users/resetUserPassword`,
        {
          userId,
          newPassword,
          newPasswordConfirm,
        },
        {
          timeout: 10000,
          cancelToken: source.token,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data;
    } catch (err) {
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

export const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    resetUsers: (state) => {
      state.status = "idle";
      state.users = null;
      state.error = "";
      state.count = 0;
      state.activationDeleteStatus = "idle";
      state.activationDeleteStatusMsg = "";
      state.resetUserPasswordStatus = "idle";
      state.resetUserPasswordError = "";
    },
    resetError: (state) => {
      state.status = "idle";
      state.error = "";
    },
    resetActivationDeleteStatus: (state) => {
      state.activationDeleteStatus = "idle";
      state.activationDeleteStatusMsg = "";
    },
    resetUserChangePasswordStatus: (state) => {
      state.resetUserPasswordStatus = "idle";
    },
    resetUserChangePasswordError: (state) => {
      state.resetUserPasswordError = "";
    },
  },
  extraReducers: {
    [getUsers.pending]: (state) => {
      state.status = "loading";
    },
    [getUsers.fulfilled]: (state, action) => {
      state.status = "succeeded";
      state.users = action.payload.data.users;
      state.count = action.payload.count;
      state.error = "";
    },
    [getUsers.rejected]: (state, { payload }) => {
      state.status = "failed";

      if (payload === "timeout") {
        state.error = "timeout-msg";
      } else if (payload === "cancel") {
        state.error = "cancel-operation-msg";
      } else if (payload === "network failed") {
        state.error = "network failed";
      } else state.error = payload.message;
    },
    [userApproveChange.pending]: (state) => {
      state.activationDeleteStatus = "loading";
      state.activationDeleteStatusMsg = "";
    },
    [userApproveChange.fulfilled]: (state, action) => {
      state.activationDeleteStatus = "succeeded";
      const newUsers = state.users.map((user) => {
        if (user._id === action.payload.data.user._id) {
          return action.payload.data.user;
        } else return user;
      });

      state.users = newUsers;
      if (action.payload.status === "activation success") {
        state.activationDeleteStatusMsg = "user-approved-success";
      } else {
        state.activationDeleteStatusMsg = "user-disapproved-success";
      }
    },
    [userApproveChange.rejected]: (state, { payload }) => {
      state.activationDeleteStatus = "failed";

      if (payload === "timeout") {
        state.activationDeleteStatusMsg = "timeout-msg";
      } else if (payload === "cancel") {
        state.activationDeleteStatusMsg = "cancel-operation-msg";
      } else if (payload === "network failed") {
        state.activationDeleteStatusMsg = "network failed";
      } else state.activationDeleteStatusMsg = payload.message;
    },
    [deleteUser.pending]: (state) => {
      state.activationDeleteStatus = "loading";
      state.activationDeleteStatusMsg = "";
    },
    [deleteUser.fulfilled]: (state, action) => {
      state.activationDeleteStatus = "succeeded";
      const newUsers = state.users.map((user) => {
        if (user._id === action.payload.data.user._id) {
          return action.payload.data.user;
        } else return user;
      });
      state.users = newUsers;
      state.activationDeleteStatusMsg = "user-delete-success";
    },
    [deleteUser.rejected]: (state, { payload }) => {
      state.activationDeleteStatus = "failed";

      if (payload === "timeout") {
        state.activationDeleteStatusMsg = "timeout-msg";
      } else if (payload === "cancel") {
        state.activationDeleteStatusMsg = "cancel-operation-msg";
      } else if (payload === "network failed") {
        state.activationDeleteStatusMsg = "network failed";
      } else state.activationDeleteStatusMsg = payload.message;
    },
    [undoDeleteUser.pending]: (state, action) => {
      state.activationDeleteStatus = "loading";
      state.activationDeleteStatusMsg = "";
    },
    [undoDeleteUser.fulfilled]: (state, action) => {
      state.activationDeleteStatus = "succeeded";
      const newUsers = state.users.map((user) => {
        if (user._id === action.payload.data.user._id) {
          return action.payload.data.user;
        } else return user;
      });
      state.users = newUsers;
      state.activationDeleteStatusMsg = "user-undo-delete-success";
    },
    [undoDeleteUser.rejected]: (state, { payload }) => {
      state.activationDeleteStatus = "failed";

      if (payload === "timeout") {
        state.activationDeleteStatusMsg = "timeout-msg";
      } else if (payload === "cancel") {
        state.activationDeleteStatusMsg = "cancel-operation-msg";
      } else if (payload === "network failed") {
        state.activationDeleteStatusMsg = "network failed";
      } else state.activationDeleteStatusMsg = payload.message;
    },
    [resetUserPassword.pending]: (state) => {
      state.resetUserPasswordStatus = "loading";
    },
    [resetUserPassword.fulfilled]: (state) => {
      state.resetUserPasswordStatus = "succeeded";
      state.resetUserPasswordError = "";
    },
    [resetUserPassword.rejected]: (state, { payload }) => {
      state.resetUserPasswordStatus = "failed";

      if (payload === "timeout") {
        state.resetUserPasswordError = "timeout-msg";
      } else if (payload === "cancel") {
        state.resetUserPasswordError = "cancel-operation-msg";
      } else if (payload === "network failed") {
        state.resetUserPasswordError = "network failed";
      } else state.resetUserPasswordError = payload.message;
    },
  },
});

export const selectUsers = (state) => state.users;
export const selectActivationDeleteStatus = (state) =>
  state.users.activationDeleteStatus;
export const selectActivationDeleteMsg = (state) =>
  state.users.activationDeleteStatusMsg;

export const {
  resetActivationDeleteStatus,
  resetUsers,
  resetUserChangePasswordStatus,
  resetUserChangePasswordError,
  resetError,
} = usersSlice.actions;

export default usersSlice.reducer;
