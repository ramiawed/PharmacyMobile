import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import {
  AdminOrderStatus,
  BASEURL,
  DateOptions,
  PharmacyOrderStatus,
  UserTypeConstants,
  WarehouseOrderStatus,
} from "../../utils/constants";

const initialState = {
  status: "idle",
  orders: [],
  count: 0,
  error: "",
  forceRefresh: false,
  refresh: true,
  pageState: {
    searchPharmacyName: "",
    searchWarehouseName: "",
    date: "",
    dateOption: "",
    warehouseOrderStatus: WarehouseOrderStatus.ALL,
    pharmacyOrderStatus: PharmacyOrderStatus.ALL,
    adminOrderStatus: AdminOrderStatus.ALL,
    page: 1,
  },
};

let CancelToken;
let source;

export const cancelOperation = () => {
  if (source !== null) {
    source.cancel("operation canceled by user");
  }
};

const resetCancelAndSource = () => {
  CancelToken = null;
  source = null;
};

export const getOrders = createAsyncThunk(
  "basketOrders/getOrders",
  async ({ obj, token }, { rejectWithValue, getState }) => {
    const {
      basketOrders: { pageState },
    } = getState();

    try {
      CancelToken = axios.CancelToken;
      source = CancelToken.source();

      // const { page } = obj;

      let buildUrl = `${BASEURL}/ordered-baskets?page=${pageState.page}&limit=15`;

      if (pageState.searchPharmacyName.length > 0) {
        buildUrl = buildUrl + `&pharmacyName=${pageState.searchPharmacyName}`;
      }

      if (pageState.searchWarehouseName.length > 0) {
        buildUrl = buildUrl + `&warehouseName=${pageState.searchWarehouseName}`;
      }

      if (pageState.pharmacyOrderStatus !== PharmacyOrderStatus.ALL) {
        buildUrl =
          buildUrl + `&pharmacyStatus=${pageState.pharmacyOrderStatus}`;
      }

      if (pageState.warehouseOrderStatus !== WarehouseOrderStatus.ALL) {
        buildUrl =
          buildUrl + `&warehouseStatus=${pageState.warehouseOrderStatus}`;
      }

      if (pageState.adminOrderStatus !== AdminOrderStatus.ALL) {
        buildUrl = buildUrl + `&adminOrderStatus=${pageState.adminOrderStatus}`;
      }

      // One Day
      if (
        pageState.dateOption === DateOptions.ONE_DAY &&
        pageState.date !== ""
      ) {
        let nextDay = new Date(JSON.parse(pageState.date).split('T')[0]);
        nextDay.setDate(nextDay.getDate() + 1);
        let date = JSON.parse(pageState.date).split('T')[0];
        buildUrl = buildUrl + `&date=${date}&date1=${nextDay}`;
      }

      // Three Days
      if (
        pageState.dateOption === DateOptions.THREE_DAY &&
        pageState.date !== ""
      ) {
        let nextThreeDays = new Date(JSON.parse(pageState.date).split('T')[0]);
        nextThreeDays.setDate(nextThreeDays.getDate() + 3);
        let date = JSON.parse(pageState.date).split('T')[0];
        buildUrl = buildUrl + `&date=${date}&date1=${nextThreeDays}`;
      }

      // One Week
      if (
        pageState.dateOption === DateOptions.ONE_WEEK &&
        pageState.date !== ""
      ) {
        let nextWeek = new Date(JSON.parse(pageState.date).split('T')[0]);
        nextWeek.setDate(nextWeek.getDate() + 7);
        let date = JSON.parse(pageState.date).split('T')[0];
        buildUrl = buildUrl + `&date=${date}&date1=${nextWeek}`;
      }

      // Two Week
      if (
        pageState.dateOption === DateOptions.TWO_WEEK &&
        pageState.date !== ""
      ) {
        let nextTwoWeek = new Date(JSON.parse(pageState.date).split('T')[0]);
        nextTwoWeek.setDate(nextTwoWeek.getDate() + 14);
        let date = JSON.parse(pageState.date).split('T')[0];
        buildUrl = buildUrl + `&date=${date}&date1=${nextTwoWeek}`;
      }

      // One Month
      if (
        pageState.dateOption === DateOptions.ONE_MONTH &&
        pageState.date !== ""
      ) {
        let nextMonth = new Date(JSON.parse(pageState.date).split('T')[0]);
        nextMonth.setMonth(nextMonth.getMonth() + 1);
        let date = JSON.parse(pageState.date).split('T')[0];
        buildUrl = buildUrl + `&date=${date}&date1=${nextMonth}`;
      }

      // Two Month
      if (
        pageState.dateOption === DateOptions.TWO_MONTH &&
        pageState.date !== ""
      ) {
        let nextTwoMonth = new Date(JSON.parse(pageState.date).split('T')[0]);
        nextTwoMonth.setMonth(nextTwoMonth.getMonth() + 2);
        let date = JSON.parse(pageState.date).split('T')[0];
        buildUrl = buildUrl + `&date=${date}&date1=${nextTwoMonth}`;
      }

      // Six Month
      if (
        pageState.dateOption === DateOptions.SIX_MONTH &&
        pageState.date !== ""
      ) {
        let nextSixMonth = new Date(JSON.parse(pageState.date).split('T')[0]);
        nextSixMonth.setMonth(nextSixMonth.getMonth() + 6);
        let date = JSON.parse(pageState.date).split('T')[0];
        buildUrl = buildUrl + `&date=${date}&date1=${nextSixMonth}`;
      }

      // One Year
      if (
        pageState.dateOption === DateOptions.ONE_YEAR &&
        pageState.date !== ""
      ) {
        let nextYear = new Date(JSON.parse(pageState.date).split('T')[0]);
        nextYear.setFullYear(nextYear.getFullYear() + 1);
        let date = JSON.parse(pageState.date).split('T')[0];
        buildUrl = buildUrl + `&date=${date}&date1=${nextYear}`;
      }

      const response = await axios.get(buildUrl, {
        // timeout: 10000,
        cancelToken: source.token,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      resetCancelAndSource();

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

      resetCancelAndSource();
      return rejectWithValue(err.response.data);
    }
  }
);

export const updateOrders = createAsyncThunk(
  "basketOrders/updatesOrders",
  async ({ obj, token }, { rejectWithValue }) => {
    try {
      CancelToken = axios.CancelToken;
      source = CancelToken.source();

      const response = await axios.post(
        `${BASEURL}/ordered-baskets/updates`,
        obj,
        {
          // timeout: 10000,
          cancelToken: source.token,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      resetCancelAndSource();

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

      resetCancelAndSource();

      return rejectWithValue(err.response.data);
    }
  }
);

export const saveOrder = createAsyncThunk(
  "basketOrders/saveOrder",
  async ({ obj, token }, { rejectWithValue }) => {
    try {
      CancelToken = axios.CancelToken;
      source = CancelToken.source();

      const response = await axios.post(`${BASEURL}/ordered-baskets`, obj, {
        cancelToken: source.token,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      resetCancelAndSource();

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

      resetCancelAndSource();

      return rejectWithValue(err.response.data);
    }
  }
);

export const updateOrder = createAsyncThunk(
  "basketOrders/updateOrder",
  async ({ obj, id, token }, { rejectWithValue }) => {
    try {
      CancelToken = axios.CancelToken;
      source = CancelToken.source();

      const response = await axios.post(
        `${BASEURL}/ordered-baskets/update?id=${id}`,
        obj,
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

export const getUnreadOrders = createAsyncThunk(
  "basketOrders/getUnreadOrders",
  async ({ token }, { rejectWithValue }) => {
    try {
      CancelToken = axios.CancelToken;
      source = CancelToken.source();

      const response = await axios.get(`${BASEURL}/ordered-baskets/unread`, {
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

export const deleteOrder = createAsyncThunk(
  "basketOrders/deleteOrder",
  async ({ token, orderId }, { rejectWithValue }) => {
    try {
      CancelToken = axios.CancelToken;
      source = CancelToken.source();

      const response = await axios.post(
        `${BASEURL}/ordered-baskets/delete`,
        {
          basketOrderId: orderId,
        },
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
      if (err.code === "ECONNABORTED" && err.message.startsWith("timeout")) {
        return rejectWithValue("timeout");
      }
      if (axios.isCancel(err)) {
        return rejectWithValue("cancel");
      }

      if (!err.response) {
        return rejectWithValue("network failed");
      }

      resetCancelAndSource();

      return rejectWithValue(err.response.data);
    }
  }
);

export const basketOrdersSlice = createSlice({
  name: "basketOrders",
  initialState,
  reducers: {
    setRefresh: (state, action) => {
      state.refresh = action.payload;
    },
    resetStatus: (state) => {
      state.status = "idle";
      state.error = "";
    },
    resetOrders: (state) => {
      state.status = "idle";
      state.orders = [];
      state.error = "";
      state.count = 0;
    },
    resetError: (state) => {
      state.status = "idle";
      state.error = "";
    },
    setSearchDate: (state, action) => {
      state.pageState = {
        ...state.pageState,
        date: action.payload,
      };
    },

    setForceRefresh: (state, action) => {
      state.forceRefresh = action.payload;
    },

    setDateOption: (state, action) => {
      state.pageState = {
        ...state.pageState,
        dateOption: action.payload,
      };
    },
    setWarehouseOrderStatus: (state, action) => {
      state.pageState = {
        ...state.pageState,
        warehouseOrderStatus: action.payload,
      };
    },
    setPharmacyOrderStatus: (state, action) => {
      state.pageState = {
        ...state.pageState,
        pharmacyOrderStatus: action.payload,
      };
    },
    setAdminOrderStatus: (state, action) => {
      state.pageState = {
        ...state.pageState,
        adminOrderStatus: action.payload,
      };
    },
    setSearchPharmacyName: (state, action) => {
      state.pageState = {
        ...state.pageState,
        searchPharmacyName: action.payload,
      };
    },
    setSearchWarehouseName: (state, action) => {
      state.pageState = {
        ...state.pageState,
        searchWarehouseName: action.payload,
      };
    },
    setPage: (state, action) => {
      state.pageState = {
        ...state.pageState,
        page: action.payload,
      };
    },

    decrementUnreadOrder: (state) => {
      state.unreadCount = state.unreadCount - 1;
    },

    resetPageState: (state) => {
      state.pageState = {
        searchPharmacyName: "",
        searchWarehouseName: "",
        date: "",
        dateOption: "",
        warehouseOrderStatus: WarehouseOrderStatus.ALL,
        pharmacyOrderStatus: PharmacyOrderStatus.ALL,
        adminOrderStatus: AdminOrderStatus.ALL,
        page: 1,
      };
    },

    selectedChange: (state, action) => {
      state.orders = state.orders.map((o) => {
        if (o._id === action.payload) {
          return {
            ...o,
            selected: !o.selected,
          };
        } else {
          return o;
        }
      });
    },

    changeAllOrdersSelection: (state, action) => {
      state.orders = state.orders.map((o) => {
        return {
          ...o,
          selected: action.payload,
        };
      });
    },

    updateOrderStatus: (state, action) => {
      const { id, fields } = action.payload;
      const updatedOrders = state.orders.map((o) => {
        if (o._id === id) {
          return {
            ...o,
            ...fields,
          };
        } else {
          return o;
        }
      });
      state.orders = updatedOrders;
    },

    deleteOrderSocket: (state, action) => {
      const { id } = action.payload;
      const filteredOrders = state.orders.filter((o) => o._id !== id);
      state.orders = filteredOrders;
      state.count = filteredOrders.length;
    },

    getOrderById: (state, action) => {
      const { orderId, userType } = action.payload;

      if (userType === UserTypeConstants.ADMIN) {
        state.unreadCount = state.unreadCount - 1;
        state.orders = state.orders.map((o) => {
          if (o._id === orderId) {
            return { ...o, seenByAdmin: true };
          } else {
            return o;
          }
        });
      }

      if (userType === UserTypeConstants.WAREHOUSE) {
        state.unreadCount = state.unreadCount - 1;
        state.orders = state.orders.map((o) => {
          if (o._id === orderId) {
            return { ...o, seenByWarehouse: true };
          } else {
            return o;
          }
        });
      }
    },
    basketOrderSliceSignOut: (state) => {
      state.status = "idle";
      state.orders = [];
      state.count = 0;
      state.error = "";
      state.unreadCount = 0;
      state.forceRefresh = false;
      state.refresh = true;
      state.pageState = {
        searchPharmacyName: "",
        searchWarehouseName: "",
        warehouseOrderStatus: WarehouseOrderStatus.ALL,
        pharmacyOrderStatus: PharmacyOrderStatus.ALL,
        adminOrderStatus: AdminOrderStatus.ALL,
        date: "",
        dateOption: "",
        page: 1,
      };
    },
  },

  extraReducers: {
    [getOrders.pending]: (state) => {
      state.status = "loading";
    },
    [getOrders.fulfilled]: (state, action) => {
      state.status = "succeeded";
      state.orders = [
        ...state.orders,
        ...action.payload.data.basketOrders.map(o => {
          return {
            ...o,
            selected: false,
          };
        })
      ];
      state.count = action.payload.count;
      state.error = "";
      state.pageState = {
        ...state.pageState,
        page: state.pageState.page + 1,
      };
      state.forceRefresh = false;
      state.refresh = false;
    },
    [getOrders.rejected]: (state, { payload }) => {
      state.status = "failed";

      if (payload === "timeout") {
        state.error = "timeout-msg";
      } else if (payload === "cancel") {
        state.error = "cancel-operation-msg";
      } else if (payload === "network failed") {
        state.error = "network failed";
      } else state.error = payload.message;
    },

    [updateOrders.pending]: (state) => {
      state.status = "loading";
    },
    [updateOrders.fulfilled]: (state, action) => {
      state.status = "succeeded";
    },
    [updateOrders.rejected]: (state, { payload }) => {
      state.status = "failed";
    },

    [deleteOrder.pending]: (state) => {
      state.status = "loading";
    },
    [deleteOrder.fulfilled]: (state, action) => {
      state.status = "succeeded";
      state.orders = state.orders.filter(
        (o) => o._id !== action.payload.data.basketOrderId
      );
      state.error = "";
    },
    [deleteOrder.rejected]: (state, { payload }) => {
      state.status = "failed";

      if (payload === "timeout") {
        state.error = "timeout-msg";
      } else if (payload === "cancel") {
        state.error = "cancel-operation-msg";
      } else if (payload === "network failed") {
        state.error = "network failed";
      } else state.error = payload.message;
    },
    [updateOrder.fulfilled]: (state, action) => {
      const updatedOrders = state.orders.map((o) => {
        if (o._id === action.payload.data.basketOrder._id) {
          return action.payload.data.basketOrder;
        } else {
          return o;
        }
      });

      state.orders = updatedOrders;
    },
    [getUnreadOrders.fulfilled]: (state, action) => {
      state.unreadCount = action.payload.data.count;
    },
  },
});

export const selectBasketOrders = (state) => state.basketOrders;

export const {
  resetStatus,
  resetOrders,
  resetError,
  setSearchPharmacyName,
  setSearchWarehouseName,
  setPage,
  resetPageState,
  setRefresh,
  setDateOption,
  setWarehouseOrderStatus,
  setPharmacyOrderStatus,
  setAdminOrderStatus,
  setSearchDate,
  basketOrderSliceSignOut,
  getOrderById,
  setForceRefresh,
  selectedChange,
  changeAllOrdersSelection,
  updateOrderStatus,
  deleteOrderSocket,
  decrementUnreadOrder,
} = basketOrdersSlice.actions;

export default basketOrdersSlice.reducer;
