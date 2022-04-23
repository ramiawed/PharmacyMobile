import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { BASEURL } from "../../utils/constants";

let CancelToken;
let source;

const initialState = {
  status: "idle",
  warehouseItems: [],
  count: 0,
  error: "",
  removeFromWarehouseStatus: "idle",
  removeFromWarehouseError: "",
  changeMaxQtyStatus: "idle",
  changeMaxQtyError: "",
  changeOfferStatus: "idle",
  changeOfferError: "",
};

export const getWarehouseItems = createAsyncThunk(
  "warehouseItems/getItems",
  async ({ queryString, token }, { rejectWithValue }) => {
    try {
      CancelToken = axios.CancelToken;
      source = CancelToken.source();

      let buildUrl = `${BASEURL}/items/warehouseItems?page=${queryString.page}&limit=15`;

      if (queryString.name) {
        buildUrl = buildUrl + `&name=${queryString.name}`;
      }

      if (queryString.companyName) {
        buildUrl = buildUrl + `&companyName=${queryString.companyName}`;
      }

      const response = await axios.get(buildUrl, {
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

export const removeItemFromWarehouse = createAsyncThunk(
  "warehouseItems/removeFromWarehouse",
  async ({ obj, token }, { rejectWithValue }) => {
    try {
      CancelToken = axios.CancelToken;
      source = CancelToken.source();

      const response = await axios.post(
        `${BASEURL}/items/warehouse/remove-item/${obj.itemId}/${obj.city}`,
        { warehouseId: obj.warehouseId },
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

export const changeItemWarehouseMaxQty = createAsyncThunk(
  "warehouseItems/changeItemsMaxQty",
  async ({ obj, token }, { rejectWithValue }) => {
    try {
      CancelToken = axios.CancelToken;
      source = CancelToken.source();

      const response = await axios.post(
        `${BASEURL}/items/warehouse/change-max-qty/${obj.itemId}`,
        { warehouseId: obj.warehouseId, qty: obj.qty },
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

export const changeItemWarehouseOffer = createAsyncThunk(
  "warehouseItems/changeItemsOffer",
  async ({ obj, token }, { rejectWithValue }) => {
    try {
      CancelToken = axios.CancelToken;
      source = CancelToken.source();

      const response = await axios.post(
        `${BASEURL}/items/warehouse/change-offer/${obj.itemId}`,
        { warehouseId: obj.warehouseId, offer: obj.offer },
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

export const warehouseItemsSlice = createSlice({
  name: "warehouseItemsSlice",
  initialState,
  reducers: {
    resetStatus: (state) => {
      state.status = "idle";
      state.error = "";
    },
    resetError: (state) => {
      state.error = "";
    },
    resetAddToWarehouseError: (state) => {
      state.addToWarehouseError = "";
    },
    resetRemoveFromWarehouseStatus: (state) => {
      state.removeFromWarehouseStatus = "idle";
      state.removeFromWarehouseError = "";
    },
    resetRemoveFromWarehouseError: (state) => {
      state.RemoveFromWarehouseError = "";
    },
    resetChangeMaxQtyStatus: (state) => {
      state.changeMaxQtyStatus = "idle";
      state.changeMaxQtyError = "";
    },
    resetChangeMaxQtyError: (state) => {
      state.changeMaxQtyError = "";
    },
    resetChangeOfferStatus: (state) => {
      state.changeOfferStatus = "idle";
      state.changeOfferError = "";
    },
    resetChangeOfferError: (state) => {
      state.changeOfferError = "";
    },
    resetWarehouseItems: (state) => {
      state.status = "idle";
      state.warehouseItems = [];
      state.count = 0;
      state.error = "";
      state.removeFromWarehouseStatus = "idle";
      state.removeFromWarehouseError = "";
      state.changeMaxQtyStatus = "idle";
      state.changeMaxQtyError = "";
      state.changeOfferStatus = "idle";
      state.changeOfferError = "";
    },
    warehouseItemsSliceSignOut: (state) => {
      state.status = "idle";
      state.warehouseItems = [];
      state.count = 0;
      state.error = "";
      state.removeFromWarehouseStatus = "idle";
      state.removeFromWarehouseError = "";
      state.changeMaxQtyStatus = "idle";
      state.changeMaxQtyError = "";
      state.changeOfferStatus = "idle";
      state.changeOfferError = "";
    },
  },
  extraReducers: {
    [getWarehouseItems.pending]: (state) => {
      state.status = "loading";
    },
    [getWarehouseItems.fulfilled]: (state, action) => {
      state.status = "succeeded";
      state.warehouseItems = action.payload.data.items;
      state.count = action.payload.count;
      state.error = "";
    },
    [getWarehouseItems.rejected]: (state, { payload }) => {
      state.status = "failed";

      if (payload === "timeout") {
        state.error = "timeout-msg";
      } else if (payload === "cancel") {
        state.error = "cancel-operation-msg";
      } else if (payload === "network failed") {
        state.error = "network failed";
      } else state.error = payload.message;
    },
    [removeItemFromWarehouse.pending]: (state) => {
      state.removeFromWarehouseStatus = "loading";
    },
    [removeItemFromWarehouse.fulfilled]: (state) => {
      state.removeFromWarehouseStatus = "succeeded";
      // const newItems = state.warehouseItems.map((item) => {
      //   if (item._id === action.payload.data.item._id) {
      //     return action.payload.data.item;
      //   } else return item;
      // });

      // state.warehouseItems = newItems;
      // state.count = state.count - 1;
    },
    [removeItemFromWarehouse.rejected]: (state, { payload }) => {
      state.removeFromWarehouseStatus = "failed";

      if (payload === "timeout") {
        state.removeFromWarehouseError = "timeout-msg";
      } else if (payload === "cancel") {
        state.removeFromWarehouseError = "cancel-operation-msg";
      } else if (payload === "network failed") {
        state.removeFromWarehouseError = "network failed";
      } else state.removeFromWarehouseError = payload.message;
    },
    [changeItemWarehouseMaxQty.pending]: (state) => {
      state.changeMaxQtyStatus = "loading";
    },
    [changeItemWarehouseMaxQty.fulfilled]: (state) => {
      state.changeMaxQtyStatus = "succeeded";
    },
    [changeItemWarehouseMaxQty.rejected]: (state, { payload }) => {
      state.changeMaxQtyStatus = "failed";

      if (payload === "timeout") {
        state.changeMaxQtyError = "timeout-msg";
      } else if (payload === "cancel") {
        state.changeMaxQtyError = "cancel-operation-msg";
      } else if (payload === "network failed") {
        state.changeMaxQtyError = "network failed";
      } else state.changeMaxQtyError = payload.message;
    },
    [changeItemWarehouseOffer.pending]: (state, action) => {
      state.changeOfferStatus = "loading";
    },
    [changeItemWarehouseOffer.fulfilled]: (state, action) => {
      state.changeOfferStatus = "succeeded";
      state.warehouseItems = state.warehouseItems.map((item) => {
        if (item._id === action.payload.data.item._id) {
          return action.payload.data.item;
        } else return item;
      });
    },
    [changeItemWarehouseOffer.rejected]: (state, { payload }) => {
      state.changeOfferStatus = "failed";

      if (payload === "timeout") {
        state.changeOfferError = "timeout-msg";
      } else if (payload === "cancel") {
        state.changeOfferError = "cancel-operation-msg";
      } else if (payload === "network failed") {
        state.changeOfferError = "network failed";
      } else state.changeOfferError = payload.message;
    },
  },
});

export const {
  resetStatus,
  resetError,
  resetWarehouseItems,
  resetRemoveFromWarehouseStatus,
  resetChangeMaxQtyStatus,
  resetChangeMaxQtyError,
  resetChangeOfferStatus,
  resetChangeOfferError,
  warehouseItemsSliceSignOut,
} = warehouseItemsSlice.actions;

export const selectWarehouseItems = (state) => state.warehouseItems;

export default warehouseItemsSlice.reducer;
