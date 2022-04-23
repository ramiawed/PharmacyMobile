import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import axios from "axios";
import { BASEURL } from "../../utils/constants";

const initialState = {
  status: "idle",
  notifications: [],
  count: 0,
  error: "",
  page: 1,
};

let CancelToken = null;
let source = null;

export const getAllNotifications = createAsyncThunk(
  "notification/getAllNotifications",
  async ({ token }, { rejectWithValue, getState }) => {
    const {
      notifications: { page },
    } = getState();
    try {
      CancelToken = axios.CancelToken;
      source = CancelToken.source();

      const response = await axios.get(
        `${BASEURL}/notifications?page=${page}&limit=15`,
        {
          // timeout: 10000,
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

export const deleteNotification = createAsyncThunk(
  "notification/deleteNotification",
  async ({ id, token }, { rejectWithValue }) => {
    try {
      CancelToken = axios.CancelToken;
      source = CancelToken.source();

      const response = await axios.post(
        `${BASEURL}/notifications/delete/${id}`,
        {},
        {
          // timeout: 10000,
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

export const addNotification = createAsyncThunk(
  "notification/addNotification",
  async ({ data, token }, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          "content-type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await axios.post(
        `${BASEURL}/notifications/add`,
        data,
        config
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

export const NotificationsSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    resetStatus: (state) => {
      state.status = "idle";
      state.error = "";
    },
    resetError: (state) => {
      state.status = "idle";
      state.error = "";
    },
    setPage: (state, action) => {
      state.page = action.payload;
    },
    resetNotifications: (state) => {
      state.status = "idle";
      state.error = "";
      state.notifications = [];
      state.count = 0;
      state.page = 1;
    },
    notificationsSignOut: (state) => {
      state.status = "idle";
      state.error = "";
      state.notifications = [];
      state.count = 0;
      state.page = 1;
    },
  },
  extraReducers: {
    [addNotification.pending]: (state) => {
      state.status = "loading";
    },
    [addNotification.fulfilled]: (state, action) => {
      state.status = "succeeded";
      state.notifications = [
        action.payload.data.notification,
        ...state.notifications,
      ];
    },
    [addNotification.rejected]: (state, { payload }) => {
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
    [deleteNotification.pending]: (state) => {
      state.status = "loading";
    },
    [deleteNotification.fulfilled]: (state, action) => {
      state.status = "succeeded";
      state.notifications = state.notifications.filter(
        (note) => note._id !== action.payload.data.notification._id
      );
    },
    [deleteNotification.rejected]: (state) => {
      state.status = "failed";
    },
    [getAllNotifications.pending]: (state) => {
      state.status = "loading";
    },
    [getAllNotifications.fulfilled]: (state, action) => {
      state.status = "succeeded";
      state.notifications = action.payload.data.notifications;
      state.count = action.payload.count;
      state.error = "";
    },
  },
});

export const {
  resetError,
  resetStatus,
  resetNotifications,
  setPage,
  notificationsSignOut,
  // addNotification,
} = NotificationsSlice.actions;

export const selectNotifications = (state) => state.notifications;

export default NotificationsSlice.reducer;
