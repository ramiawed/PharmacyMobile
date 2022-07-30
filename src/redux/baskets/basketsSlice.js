import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { BASEURL } from "../../utils/constants";

let CancelToken = null;
let source = null;

const initialState = {
  status: "idle",
  baskets: [],
  count: 0,
  error: "",
  pageState: {
    warehouseName: "",
    pharmacyName: "",
    page: 1,
  },
};

export const cancelOperation = () => {
  if (source !== null) {
    source.cancel("operation canceled by user");
  }
};

const resetCancelAndSource = () => {
  CancelToken = null;
  source = null;
};

export const getBaskets = createAsyncThunk(
  "baskets/getBaskets",
  async ({ token }, { rejectWithValue, getState }) => {
    const {
      baskets: { pageState },
    } = getState();

    try {
      CancelToken = axios.CancelToken;
      source = CancelToken.source();
      let buildUrl = `${BASEURL}/baskets?page=${pageState.page}&limit=15`;

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

export const addBasket = createAsyncThunk(
  "baskets/addBasket",
  async ({ data, token }, { rejectWithValue }) => {
    try {
      CancelToken = axios.CancelToken;
      source = CancelToken.source();
      const response = await axios.post(`${BASEURL}/baskets/add`, data, {
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

export const updateBasket = createAsyncThunk(
  "baskets/updateBasket",
  async ({ data, token }, { rejectWithValue }) => {
    try {
      CancelToken = axios.CancelToken;
      source = CancelToken.source();

      const response = await axios.post(`${BASEURL}/baskets/update`, data, {
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

export const removeBasket = createAsyncThunk(
  "baskets/removeBasket",
  async ({ basketId, token }, { rejectWithValue }) => {
    try {
      CancelToken = axios.CancelToken;
      source = CancelToken.source();
      console.log(basketId, token);

      const response = await axios.post(
        `${BASEURL}/baskets/remove`,
        { basketId },
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

export const basketsSlice = createSlice({
  name: "baskets",
  initialState,
  reducers: {
    resetBasketPageState: (state) => {
      state.pageState = {
        warehouseName: "",
        pharmacyName: "",
        page: 1,
      };
    },

    resetBasketsArray: (state) => {
      state.baskets = [];
      state.count = 0;
      state.pageState = {
        ...state.pageState,
        page: 1,
      };
    },

    resetError: (state) => {
      state.error = null;
    },

    resetStatus: (state) => {
      state.status = "idle";
      state.error = null;
    },

    removeBasketFromState: (state, action) => {
      const updatedBaskets = state.baskets.filter(
        (b) => b._id !== action.payload.basketId
      );
      state.baskets = updatedBaskets;
      state.count = state.count - 1;
    },

    resetBaskets: (state) => {
      state.status = "idle";
      state.baskets = [];
      state.count = 0;
      state.error = null;
      state.pageState = {
        ...state.pageState,
        page: 1,
      };
    },

    resetCount: (state) => {
      state.count = 0;
    },

    basketsSliceSignOut: (state) => {
      state.status = "idle";
      state.baskets = [];
      state.count = 0;
      state.error = "";
      state.pageState = {
        warehouseName: "",
        pharmacyName: "",
        page: 1,
      };
    },
  },
  extraReducers: {
    [getBaskets.pending]: (state) => {
      state.status = "loading";
      state.error = null;
    },
    [getBaskets.fulfilled]: (state, action) => {
      state.status = "success";
      state.baskets = [...state.baskets, ...action.payload.data.baskets];
      state.count = action.payload.count;
      state.error = null;
      state.pageState = {
        ...state.pageState,
        page: Math.ceil(state.baskets.length / 15) + 1,
      };
    },
    [getBaskets.rejected]: (state, { payload }) => {
      state.status = "failed";

      if (payload === "timeout") {
        state.error = "timeout";
      } else if (payload === "cancel") {
        state.error = "cancel-operation-msg";
      } else if (payload === "network failed") {
        state.error = "network failed";
      } else state.error = payload.message;
    },
    [addBasket.pending]: (state) => {
      state.status = "loading";
      state.error = null;
    },
    [addBasket.fulfilled]: (state, action) => {
      state.status = "success";
      state.baskets = [action.payload.data.basket, ...state.baskets];
      state.count = state.count + 1;
      state.error = null;
    },
    [addBasket.rejected]: (state, { payload }) => {
      state.status = "failed";

      if (payload === "timeout") {
        state.error = "timeout";
      } else if (payload === "cancel") {
        state.error = "cancel-operation-msg";
      } else if (payload === "network failed") {
        state.error = "network failed";
      } else state.error = payload.message;
    },

    [updateBasket.pending]: (state) => {
      state.status = "loading";
      state.error = null;
    },
    [updateBasket.fulfilled]: (state, action) => {
      state.status = "success";
      const updatedBaskets = state.baskets.map((b) => {
        if (b._id === action.payload.data.basket._id) {
          return action.payload.data.basket;
        }

        return b;
      });
      state.baskets = updatedBaskets;
      state.error = null;
    },
    [updateBasket.rejected]: (state, { payload }) => {
      state.status = "failed";

      if (payload === "timeout") {
        state.error = "timeout";
      } else if (payload === "cancel") {
        state.error = "cancel-operation-msg";
      } else if (payload === "network failed") {
        state.error = "network failed";
      } else state.error = payload.message;
    },
    [removeBasket.pending]: (state) => {
      state.status = "loading";
      state.error = null;
    },
    [removeBasket.fulfilled]: (state, action) => {
      state.status = "success";

      state.error = null;
    },
    [removeBasket.rejected]: (state, { payload }) => {
      state.status = "failed";

      if (payload === "timeout") {
        state.error = "timeout";
      } else if (payload === "cancel") {
        state.error = "cancel-operation-msg";
      } else if (payload === "network failed") {
        state.error = "network failed";
      } else state.error = payload.message;
    },
  },
});

export const selectBaskets = (state) => state.baskets;

export const {
  basketsSliceSignOut,
  resetBaskets,
  resetBasketPageState,
  resetBasketsArray,
  resetCount,
  resetError,
  resetStatus,
  removeBasketFromState,
} = basketsSlice.actions;

export default basketsSlice.reducer;
