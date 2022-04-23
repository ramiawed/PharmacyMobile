import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import axios from "axios";
import { BASEURL } from "../../utils/constants";

const initialState = {
  status: "idle",
  userNotifications: [],
  count: 0,
  unReadNotificationCount: 0,
  refresh: true,
  forceRefresh: false,
  error: "",
  page: 1,
};

let CancelToken = null;
let source = null;

export const getAllNotifications = createAsyncThunk(
  "userNotifications/getAllNotifications",
  async ({ token }, { rejectWithValue, getState }) => {
    const {
      userNotifications: { page },
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

export const getUnreadNotification = createAsyncThunk(
  "notification/getUnreadNotification",
  async ({ token }, { rejectWithValue }) => {
    try {
      CancelToken = axios.CancelToken;
      source = CancelToken.source();

      const response = await axios.get(`${BASEURL}/notifications/unread`, {
        // timeout: 10000,
        cancelToken: source.token,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

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

export const setNotificationRead = createAsyncThunk(
  "userNotifications/setNotificationRead",
  async ({ token, notificationId }, { rejectWithValue, getState }) => {
    try {
      CancelToken = axios.CancelToken;
      source = CancelToken.source();

      const response = await axios.post(
        `${BASEURL}/notifications/setread?notificationId=${notificationId}`,
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

export const UserNotificationsSlice = createSlice({
  name: "userNotifications",
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
    resetNotificationsData: (state) => {
      state.userNotifications = [];
    },
    setForceRefresh: (state, action) => {
      state.forceRefresh = action.payload;
    },
    resetNotifications: (state) => {
      state.status = "idle";
      state.error = "";
      state.userNotifications = [];
      state.unReadNotificationCount = 0;
      state.forceRefresh = false;
      state.count = 0;
      state.page = 1;
    },
    usersNotificationsSignOut: (state) => {
      state.status = "idle";
      state.error = "";
      state.userNotifications = [];
      state.refresh = true;
      state.forceRefresh = false;
      state.unReadNotificationCount = 0;
      state.count = 0;
      state.page = 1;
    },
    setRefresh: (state, action) => {
      state.refresh = action.payload;
    },
    decreaseUnreadNotificationsCount: (state) => {
      state.unReadNotificationCount = state.unReadNotificationCount - 1;
    },
  },
  extraReducers: {
    [getAllNotifications.pending]: (state) => {
      state.status = "loading";
    },
    [getAllNotifications.fulfilled]: (state, action) => {
      state.status = "succeeded";
      state.userNotifications = [
        ...state.userNotifications,
        ...action.payload.data.notifications,
      ];
      state.count = action.payload.count;
      state.error = "";
      state.refresh = false;
      state.forceRefresh = false;
    },
    [getAllNotifications.rejected]: (state, { payload }) => {
      state.status = "failed";

      if (payload === "timeout") {
        state.error = "timeout-msg";
      } else if (payload === "cancel") {
        state.error = "cancel-operation-msg";
      } else if (payload === "network failed") {
        state.error = "network failed";
      } else state.error = payload.message;
    },
    [setNotificationRead.pending]: (state) => {
      state.status = "loading";
    },
    [setNotificationRead.fulfilled]: (state, action) => {
      const { updatedNotification } = action.payload.data;
      state.status = "succeeded";
      const notifications = state.userNotifications.map((note) => {
        if (note._id === updatedNotification._id) return updatedNotification;
        else return note;
      });

      state.userNotifications = notifications;
      state.error = "";
    },
    [setNotificationRead.rejected]: (state, { payload }) => {
      state.status = "failed";

      if (payload === "timeout") {
        state.error = "timeout-msg";
      } else if (payload === "cancel") {
        state.error = "cancel-operation-msg";
      } else if (payload === "network failed") {
        state.error = "network failed";
      } else state.error = payload.message;
    },

    [getUnreadNotification.fulfilled]: (state, action) => {
      state.unReadNotificationCount = action.payload.data.count;
      // if (action.payload.data.count !== state.unReadNotificationCount) {
      //   state.userNotifications = [];
      //   state.refresh = true;
      // }
    },
    [getUnreadNotification.rejected]: () => {},
  },
});

export const {
  resetError,
  resetStatus,
  resetNotifications,
  setPage,
  decreaseUnreadNotificationsCount,
  setRefresh,
  usersNotificationsSignOut,
  resetNotificationsData,
  setForceRefresh,
} = UserNotificationsSlice.actions;

export const selectUserNotifications = (state) => state.userNotifications;

export default UserNotificationsSlice.reducer;
