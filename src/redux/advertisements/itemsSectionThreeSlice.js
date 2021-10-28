import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import axios from "axios";
import { BASEURL } from "../../utils/constants";

const initialState = {
  itemsSectionThreeStatus: "idle",
  itemsSectionThreeError: "",
  addItemToSectionThreeStatus: "",
  addItemToSectionThreeError: "",
  removeItemFromSectionThreeStatus: "idle",
  removeItemFromSectionThreeError: "",
  itemsSectionThree: [],
  count: 0,
};

let CancelToken;
let source;

export const getItemsSectionThree = createAsyncThunk(
  "advertisement/itemsSectionThree",
  async ({ token }, { rejectWithValue }) => {
    try {
      CancelToken = axios.CancelToken;
      source = CancelToken.source();

      const response = await axios.get(
        `${BASEURL}/items?isActive=true&inSectionThree=true&page=1&limit=25`,
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

export const addItemToSectionThree = createAsyncThunk(
  "advertisement/addItemToSectionThree",
  async ({ token, id }, { rejectWithValue }) => {
    try {
      CancelToken = axios.CancelToken;
      source = CancelToken.source();

      const response = await axios.post(
        `${BASEURL}/items/item/${id}`,
        {
          inSectionThree: true,
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

export const removeItemFromSectionThree = createAsyncThunk(
  "advertisement/removeItemFromSectionThree",
  async ({ token, id }, { rejectWithValue }) => {
    try {
      CancelToken = axios.CancelToken;
      source = CancelToken.source();

      const response = await axios.post(
        `${BASEURL}/items/item/${id}`,
        {
          inSectionThree: false,
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

export const itemsSectionThreeSlice = createSlice({
  name: "itemsSectionThree",
  initialState,
  reducers: {
    resetItemsSectionThreeStatus: (state) => {
      state.itemsSectionThreeStatus = "idle";
      state.itemsSectionThreeError = "";
    },

    resetItemsSectionThreeError: (state) => {
      state.itemsSectionThreeError = "";
    },

    resetAddItemToSectionThreeStatus: (state) => {
      state.addItemToSectionThreeStatus = "idle";
      state.addItemToSectionThreeError = "";
    },

    resetAddItemToSectionThreeError: (state) => {
      state.addItemToSectionThreeError = "";
    },

    resetRemoveItemFromSectionThreeStatus: (state) => {
      state.removeItemFromSectionThreeStatus = "idle";
      state.removeItemFromSectionThreeError = "";
    },

    resetRemoveItemFromSectionThreeError: (state) => {
      state.removeItemFromSectionThreeError = "";
    },

    resetItemsSectionThree: (state) => {
      state.itemsSectionThreeStatus = "idle";
      state.itemsSectionThreeError = "";
      state.addItemToSectionThreeStatus = "idle";
      state.addItemToSectionThreeError = "";
      state.removeItemFromSectionThreeStatus = "idle";
      state.removeItemFromSectionThreeError = "";
      state.itemsSectionThree = [];
      state.count = 0;
    },
  },

  extraReducers: {
    [getItemsSectionThree.pending]: (state) => {
      state.itemsSectionThreeStatus = "loading";
    },
    [getItemsSectionThree.fulfilled]: (state, action) => {
      state.itemsSectionThreeStatus = "succeeded";
      state.itemsSectionThree = action.payload.data.items;
      state.itemsSectionThreeError = "";
    },
    [getItemsSectionThree.rejected]: (state, { payload }) => {
      state.itemsSectionThreeStatus = "failed";

      if (payload === "timeout") {
        state.itemsSectionThreeError = "timeout-msg";
      } else if (payload === "cancel") {
        state.itemsSectionThreeError = "cancel-operation-msg";
      } else if (payload === "network failed") {
        state.itemsSectionThreeError = "network failed";
      } else state.itemsSectionThreeError = payload.message;
    },

    [addItemToSectionThree.pending]: (state) => {
      state.addItemToSectionThreeStatus = "loading";
    },
    [addItemToSectionThree.fulfilled]: (state, action) => {
      state.addItemToSectionThreeStatus = "succeeded";
      state.addItemToSectionThreeError = "";
      state.itemsSectionThree = [
        ...state.itemsSectionThree,
        action.payload.data.item,
      ];
    },
    [addItemToSectionThree.rejected]: (state, { payload }) => {
      state.addItemToSectionThreeStatus = "failed";

      if (payload === "timeout") {
        state.addItemToSectionThreeError = "timeout-msg";
      } else if (payload === "cancel") {
        state.addItemToSectionThreeError = "cancel-operation-msg";
      } else if (payload === "network failed") {
        state.addItemToSectionThreeError = "network failed";
      } else state.addItemToSectionThreeError = payload.message;
    },

    [removeItemFromSectionThree.pending]: (state) => {
      state.removeItemFromSectionThreeStatus = "loading";
    },
    [removeItemFromSectionThree.fulfilled]: (state, action) => {
      state.removeItemFromSectionThreeStatus = "succeeded";
      state.removeItemFromSectionThreeError = "";
      state.itemsSectionThree = state.itemsSectionThree.filter(
        (company) => company._id !== action.payload.data.item._id
      );
    },
    [removeItemFromSectionThree.rejected]: (state, { payload }) => {
      state.removeItemFromSectionThreeStatus = "failed";

      if (payload === "timeout") {
        state.removeItemFromSectionThreeError = "timeout-msg";
      } else if (payload === "cancel") {
        state.removeItemFromSectionThreeError = "cancel-operation-msg";
      } else if (payload === "network failed") {
        state.removeItemFromSectionThreeError = "network failed";
      } else state.removeItemFromSectionThreeError = payload.message;
    },
  },
});

export const selectItemsSectionThree = (state) => state.itemsSectionThree;

export const {
  resetItemsSectionThreeStatus,
  resetItemsSectionThreeError,
  resetAddItemToSectionThreeStatus,
  resetAddItemToSectionThreeError,
  resetRemoveItemFromSectionThreeStatus,
  resetRemoveItemFromSectionThreeError,
  resetFavoritesItems,
} = itemsSectionThreeSlice.actions;

export default itemsSectionThreeSlice.reducer;
