import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import {
  BASEURL,
  DateOptions,
  OrdersStatusOptions,
  UserTypeConstants,
} from "../../utils/constants";

const initialState = {
  status: "idle",
  orders: [],
  basketOrders: [],
  count: 0,
  basketOrdersCount: 0,
  unreadCount: 0,
  error: "",
  forceRefresh: false,
  refresh: true,
  pageState: {
    type: "normal",
    searchPharmacyName: "",
    searchWarehouseName: "",
    date: "",
    dateOption: "",
    orderStatus: OrdersStatusOptions.ALL,
    page: 1,
    basketOrdersPage: 1,
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
  "orders/getOrders",
  async ({ token }, { rejectWithValue, getState }) => {
    const {
      orders: { pageState },
    } = getState();

    try {
      CancelToken = axios.CancelToken;
      source = CancelToken.source();

      let buildUrl = `${BASEURL}/orders?page=${pageState.page}&limit=15`;

      if (pageState.searchPharmacyName.length > 0) {
        buildUrl = buildUrl + `&pharmacyName=${pageState.searchPharmacyName}`;
      }

      if (pageState.searchWarehouseName.length > 0) {
        buildUrl = buildUrl + `&warehouseName=${pageState.searchWarehouseName}`;
      }

      if (pageState.orderStatus !== OrdersStatusOptions.ALL) {
        buildUrl = buildUrl + `&orderStatus=${pageState.orderStatus}`;
      }

      // One Day
      if (
        pageState.dateOption === DateOptions.ONE_DAY &&
        pageState.date !== ""
      ) {
        let nextDay = new Date(pageState.date);
        nextDay.setDate(nextDay.getDate() + 1);
        buildUrl =
          buildUrl + `&date=${new Date(pageState.date)}&date1=${nextDay}`;
      }

      // Three Days
      if (
        pageState.dateOption === DateOptions.THREE_DAY &&
        pageState.date !== ""
      ) {
        let nextThreeDays = new Date(pageState.date);
        nextThreeDays.setDate(nextThreeDays.getDate() + 3);
        buildUrl =
          buildUrl + `&date=${new Date(pageState.date)}&date1=${nextThreeDays}`;
      }

      // One Week
      if (
        pageState.dateOption === DateOptions.ONE_WEEK &&
        pageState.date !== ""
      ) {
        let nextWeek = new Date(pageState.date);
        nextWeek.setDate(nextWeek.getDate() + 7);
        buildUrl =
          buildUrl + `&date=${new Date(pageState.date)}&date1=${nextWeek}`;
      }

      // Two Week
      if (
        pageState.dateOption === DateOptions.TWO_WEEK &&
        pageState.date !== ""
      ) {
        let nextTwoWeek = new Date(pageState.date);
        nextTwoWeek.setDate(nextTwoWeek.getDate() + 14);
        buildUrl =
          buildUrl + `&date=${new Date(pageState.date)}&date1=${nextTwoWeek}`;
      }

      // One Month
      if (
        pageState.dateOption === DateOptions.ONE_MONTH &&
        pageState.date !== ""
      ) {
        let nextMonth = new Date(pageState.date);
        nextMonth.setMonth(nextMonth.getMonth() + 1);

        buildUrl =
          buildUrl + `&date=${new Date(pageState.date)}&date1=${nextMonth}`;
      }

      // Two Month
      if (
        pageState.dateOption === DateOptions.TWO_MONTH &&
        pageState.date !== ""
      ) {
        let nextTwoMonth = new Date(pageState.date);
        nextTwoMonth.setMonth(nextTwoMonth.getMonth() + 2);

        buildUrl =
          buildUrl + `&date=${new Date(pageState.date)}&date1=${nextTwoMonth}`;
      }

      // Six Month
      if (
        pageState.dateOption === DateOptions.SIX_MONTH &&
        pageState.date !== ""
      ) {
        let nextSixMonth = new Date(pageState.date);
        nextSixMonth.setMonth(nextSixMonth.getMonth() + 6);

        buildUrl =
          buildUrl + `&date=${new Date(pageState.date)}&date1=${nextSixMonth}`;
      }

      // One Year
      if (
        pageState.dateOption === DateOptions.ONE_YEAR &&
        pageState.date !== ""
      ) {
        let nextYear = new Date(pageState.date);
        nextYear.setFullYear(nextYear.getFullYear() + 1);

        buildUrl =
          buildUrl + `&date=${new Date(pageState.date)}&date1=${nextYear}`;
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

      return rejectWithValue(err.response.data);
    }
  }
);

export const getBasketsOrders = createAsyncThunk(
  "orders/getBasketOrders",
  async ({ token }, { rejectWithValue, getState }) => {
    const {
      orders: { pageState },
    } = getState();

    try {
      CancelToken = axios.CancelToken;
      source = CancelToken.source();

      let buildUrl = `${BASEURL}/ordered-baskets?page=${pageState.basketOrdersPage}&limit=15`;

      if (pageState.searchPharmacyName.length > 0) {
        buildUrl = buildUrl + `&pharmacyName=${pageState.searchPharmacyName}`;
      }

      if (pageState.searchWarehouseName.length > 0) {
        buildUrl = buildUrl + `&warehouseName=${pageState.searchWarehouseName}`;
      }

      if (pageState.orderStatus !== OrdersStatusOptions.ALL) {
        buildUrl = buildUrl + `&orderStatus=${pageState.orderStatus}`;
      }

      // One Day
      if (
        pageState.dateOption === DateOptions.ONE_DAY &&
        pageState.date !== ""
      ) {
        let nextDay = new Date(pageState.date);
        nextDay.setDate(nextDay.getDate() + 1);
        buildUrl =
          buildUrl + `&date=${new Date(pageState.date)}&date1=${nextDay}`;
      }

      // Three Days
      if (
        pageState.dateOption === DateOptions.THREE_DAY &&
        pageState.date !== ""
      ) {
        let nextThreeDays = new Date(pageState.date);
        nextThreeDays.setDate(nextThreeDays.getDate() + 3);
        buildUrl =
          buildUrl + `&date=${new Date(pageState.date)}&date1=${nextThreeDays}`;
      }

      // One Week
      if (
        pageState.dateOption === DateOptions.ONE_WEEK &&
        pageState.date !== ""
      ) {
        let nextWeek = new Date(pageState.date);
        nextWeek.setDate(nextWeek.getDate() + 7);
        buildUrl =
          buildUrl + `&date=${new Date(pageState.date)}&date1=${nextWeek}`;
      }

      // Two Week
      if (
        pageState.dateOption === DateOptions.TWO_WEEK &&
        pageState.date !== ""
      ) {
        let nextTwoWeek = new Date(pageState.date);
        nextTwoWeek.setDate(nextTwoWeek.getDate() + 14);
        buildUrl =
          buildUrl + `&date=${new Date(pageState.date)}&date1=${nextTwoWeek}`;
      }

      // One Month
      if (
        pageState.dateOption === DateOptions.ONE_MONTH &&
        pageState.date !== ""
      ) {
        let nextMonth = new Date(pageState.date);
        nextMonth.setMonth(nextMonth.getMonth() + 1);

        buildUrl =
          buildUrl + `&date=${new Date(pageState.date)}&date1=${nextMonth}`;
      }

      // Two Month
      if (
        pageState.dateOption === DateOptions.TWO_MONTH &&
        pageState.date !== ""
      ) {
        let nextTwoMonth = new Date(pageState.date);
        nextTwoMonth.setMonth(nextTwoMonth.getMonth() + 2);

        buildUrl =
          buildUrl + `&date=${new Date(pageState.date)}&date1=${nextTwoMonth}`;
      }

      // Six Month
      if (
        pageState.dateOption === DateOptions.SIX_MONTH &&
        pageState.date !== ""
      ) {
        let nextSixMonth = new Date(pageState.date);
        nextSixMonth.setMonth(nextSixMonth.getMonth() + 6);

        buildUrl =
          buildUrl + `&date=${new Date(pageState.date)}&date1=${nextSixMonth}`;
      }

      // One Year
      if (
        pageState.dateOption === DateOptions.ONE_YEAR &&
        pageState.date !== ""
      ) {
        let nextYear = new Date(pageState.date);
        nextYear.setFullYear(nextYear.getFullYear() + 1);

        buildUrl =
          buildUrl + `&date=${new Date(pageState.date)}&date1=${nextYear}`;
      }

      const response = await axios.get(buildUrl, {
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

export const saveOrder = createAsyncThunk(
  "orders/saveOrder",
  async ({ obj, token }, { rejectWithValue }) => {
    try {
      CancelToken = axios.CancelToken;
      source = CancelToken.source();

      const response = await axios.post(`${BASEURL}/orders`, obj, {
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

export const saveBasketOrder = createAsyncThunk(
  "orders/saveBasketOrder",
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
  "orders/updateOrder",
  async ({ obj, id, token }, { rejectWithValue }) => {
    try {
      CancelToken = axios.CancelToken;
      source = CancelToken.source();

      const response = await axios.post(
        `${BASEURL}/orders/update?id=${id}`,
        obj,
        {
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

export const updateBasketOrder = createAsyncThunk(
  "orders/updateBasketOrder",
  async ({ obj, id, token }, { rejectWithValue }) => {
    try {
      CancelToken = axios.CancelToken;
      source = CancelToken.source();

      const response = await axios.post(
        `${BASEURL}/ordered-baskets/update?id=${id}`,
        obj,
        {
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

export const deleteOrder = createAsyncThunk(
  "orders/deleteOrder",
  async ({ token, orderId }, { rejectWithValue }) => {
    try {
      CancelToken = axios.CancelToken;
      source = CancelToken.source();

      const response = await axios.post(
        `${BASEURL}/orders/delete`,
        {
          orderId,
        },
        {
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

export const deleteBasketOrder = createAsyncThunk(
  "orders/deleteBasketOrder",
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

export const ordersSlice = createSlice({
  name: "orders",
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
      state.pageState = {
        ...state.pageState,
        page: 1,
      };
    },
    resetBasketOrders: (state) => {
      state.status = "idle";
      state.basketOrders = [];
      state.error = "";
      state.basketOrdersCount = 0;
      state.pageState = {
        ...state.pageState,
        basketOrdersPage: 1,
      };
    },
    resetError: (state) => {
      state.status = "idle";
      state.error = "";
    },
    setSearchDate: (state, action) => {
      state.pageState = {
        ...state.pageState,
        date: action.payload.split("T")[0].slice(1),
      };
    },
    setOrderType: (state, action) => {
      state.pageState = {
        ...state.pageState,
        type: action.payload,
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
    setOrderStatus: (state, action) => {
      state.pageState = {
        ...state.pageState,
        orderStatus: action.payload,
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

    setBasketOrdersPage: (state, action) => {
      state.pageState = {
        ...state.pageState,
        basketOrdersPage: action.payload,
      };
    },

    decrementUnreadOrder: (state) => {
      state.unreadCount = state.unreadCount - 1;
    },

    resetPageState: (state) => {
      state.pageState = {
        type: "nomral",
        searchPharmacyName: "",
        searchWarehouseName: "",
        date: "",
        dateOption: "",
        page: 1,
        basketOrdersPage: 1,
        orderStatus: OrdersStatusOptions.ALL,
      };
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

    orderSliceSignOut: (state) => {
      state.status = "idle";
      state.orders = [];
      state.basketOrders = [];
      state.count = 0;
      state.basketOrdersCount = 0;
      state.error = "";
      state.unreadCount = 0;
      state.forceRefresh = false;
      state.refresh = true;
      state.pageState = {
        type: "normal",
        searchPharmacyName: "",
        searchWarehouseName: "",
        date: "",
        dateOption: "",
        page: 1,
        basketOrdersPage: 1,
        orderStatus: OrdersStatusOptions.ALL,
      };
    },
  },

  extraReducers: {
    [getOrders.pending]: (state) => {
      state.status = "loading";
    },
    [getOrders.fulfilled]: (state, action) => {
      state.status = "succeeded";
      state.orders = [...state.orders, ...action.payload.data.orders];
      state.count = action.payload.count;
      state.error = "";
      state.forceRefresh = false;
      state.refresh = false;
      state.pageState = {
        ...state.pageState,
        page: Math.ceil(state.orders.length / 15) + 1,
      };
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

    [getBasketsOrders.pending]: (state) => {
      state.status = "loading";
    },
    [getBasketsOrders.fulfilled]: (state, action) => {
      state.status = "succeeded";
      state.basketOrders = [
        ...state.basketOrders,
        ...action.payload.data.basketOrders,
      ];
      state.basketOrdersCount = action.payload.count;
      state.pageState = {
        ...state.pageState,
        basketOrdersPage: Math.ceil(state.basketOrders.length / 15) + 1,
      };
      state.error = "";
      state.forceRefresh = false;
      state.refresh = false;
    },
    [getBasketsOrders.rejected]: (state, { payload }) => {
      state.status = "failed";

      if (payload === "timeout") {
        state.error = "timeout-msg";
      } else if (payload === "cancel") {
        state.error = "cancel-operation-msg";
      } else if (payload === "network failed") {
        state.error = "network failed";
      } else state.error = payload.message;
    },

    [deleteOrder.pending]: (state) => {
      state.status = "loading";
    },
    [deleteOrder.fulfilled]: (state, action) => {
      state.status = "succeeded";
      state.orders = state.orders.filter(
        (o) => o._id !== action.payload.data.orderId
      );
      state.count = state.count - 1;
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
    [deleteBasketOrder.pending]: (state) => {
      state.status = "loading";
    },
    [deleteBasketOrder.fulfilled]: (state, action) => {
      state.status = "succeeded";
      state.basketOrders = state.basketOrders.filter(
        (o) => o._id !== action.payload.data.basketOrderId
      );
      state.basketOrdersCount = state.basketOrdersCount - 1;
      state.error = "";
    },
    [deleteBasketOrder.rejected]: (state, { payload }) => {
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
        if (o._id === action.payload.data.order._id) {
          return action.payload.data.order;
        } else {
          return o;
        }
      });

      state.orders = updatedOrders;
    },
    [updateBasketOrder.fulfilled]: (state, action) => {
      const updatedBasketOrders = state.basketOrders.map((o) => {
        if (o._id === action.payload.data.basketOrder._id) {
          return action.payload.data.basketOrder;
        } else {
          return o;
        }
      });

      state.basketOrders = updatedBasketOrders;
    },
  },
});

export const selectOrders = (state) => state.orders;

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
  setOrderStatus,
  setSearchDate,
  orderSliceSignOut,
  // getOrderById,
  setForceRefresh,
  selectedChange,
  updateOrderStatus,
  deleteOrderSocket,
  decrementUnreadOrder,
  setOrderType,
  setBasketOrdersPage,
  resetBasketOrders,
} = ordersSlice.actions;

export default ordersSlice.reducer;
