import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import axios from "axios";
import { BASEURL } from "../../utils/constants";

const initialState = {
  companiesSectionOneStatus: "idle",
  companiesSectionOneError: "",
  addCompanyToSectionOneStatus: "",
  addCompanyToSectionOneError: "",
  removeCompanyFromSectionOneStatus: "idle",
  removeCompanyFromSectionOneError: "",
  companiesSectionOne: [],
  count: 0,
};

let CancelToken;
let source;

export const getCompaniesSectionOne = createAsyncThunk(
  "advertisement/companiesSectionOne",
  async ({ token }, { rejectWithValue }) => {
    try {
      CancelToken = axios.CancelToken;
      source = CancelToken.source();

      const response = await axios.get(
        `${BASEURL}/users?type=company&isActive=true&inSectionOne=true&page=1&limit=25`,
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

export const addCompanyToSectionOne = createAsyncThunk(
  "advertisement/addCompanyToSectionOne",
  async ({ token, id }, { rejectWithValue }) => {
    try {
      CancelToken = axios.CancelToken;
      source = CancelToken.source();

      const response = await axios.post(
        `${BASEURL}/users/inSectionOne/${id}`,
        {
          option: true,
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

export const removeCompanyFromSectionOne = createAsyncThunk(
  "advertisement/removeCompanyFromSectionOne",
  async ({ token, id }, { rejectWithValue }) => {
    try {
      CancelToken = axios.CancelToken;
      source = CancelToken.source();

      const response = await axios.post(
        `${BASEURL}/users/inSectionOne/${id}`,
        {
          option: false,
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

export const companiesSectionOneSlice = createSlice({
  name: "companiesSectionOne",
  initialState,
  reducers: {
    resetCompaniesSectionOneStatus: (state) => {
      state.companiesSectionOneStatus = "idle";
      state.companiesSectionOneError = "";
    },

    resetCompaniesSectionOneError: (state) => {
      state.companiesSectionOneError = "";
    },

    resetAddCompanyToSectionOneStatus: (state) => {
      state.addCompanyToSectionOneStatus = "idle";
      state.addCompanyToSectionOneError = "";
    },

    resetAddCompanyToSectionOneError: (state) => {
      state.addCompanyToSectionOneError = "";
    },

    resetRemoveCompanyFromSectionOneStatus: (state) => {
      state.removeCompanyFromSectionOneStatus = "idle";
      state.removeCompanyFromSectionOneError = "";
    },

    resetRemoveCompanyFromSectionOneError: (state) => {
      state.removeCompanyFromSectionOneError = "";
    },

    resetCompaniesSectionOne: (state) => {
      state.companiesSectionOneStatus = "idle";
      state.companiesSectionOneError = "";
      state.addCompanyToSectionOneStatus = "idle";
      state.addCompanyToSectionOneError = "";
      state.removeCompanyFromSectionOneStatus = "idle";
      state.removeCompanyFromSectionOneError = "";
      state.companiesSectionOne = [];
      state.count = 0;
    },
  },

  extraReducers: {
    [getCompaniesSectionOne.pending]: (state) => {
      state.companiesSectionOneStatus = "loading";
    },
    [getCompaniesSectionOne.fulfilled]: (state, action) => {
      state.companiesSectionOneStatus = "succeeded";
      state.companiesSectionOne = action.payload.data.users;
      state.companiesSectionOneError = "";
    },
    [getCompaniesSectionOne.rejected]: (state, { payload }) => {
      state.companiesSectionOneStatus = "failed";

      if (payload === "timeout") {
        state.companiesSectionOneError = "timeout-msg";
      } else if (payload === "cancel") {
        state.companiesSectionOneError = "cancel-operation-msg";
      } else if (payload === "network failed") {
        state.companiesSectionOneError = "network failed";
      } else state.companiesSectionOneError = payload.message;
    },

    [addCompanyToSectionOne.pending]: (state) => {
      state.addCompanyToSectionOneStatus = "loading";
    },
    [addCompanyToSectionOne.fulfilled]: (state, action) => {
      state.addCompanyToSectionOneStatus = "succeeded";
      state.addCompanyToSectionOneError = "";
      state.companiesSectionOne = [
        ...state.companiesSectionOne,
        action.payload.data.user,
      ];
    },
    [addCompanyToSectionOne.rejected]: (state, { payload }) => {
      state.addCompanyToSectionOneStatus = "failed";

      if (payload === "timeout") {
        state.addCompanyToSectionOneError = "timeout-msg";
      } else if (payload === "cancel") {
        state.addCompanyToSectionOneError = "cancel-operation-msg";
      } else if (payload === "network failed") {
        state.addCompanyToSectionOneError = "network failed";
      } else state.addCompanyToSectionOneError = payload.message;
    },

    [removeCompanyFromSectionOne.pending]: (state) => {
      state.removeCompanyFromSectionOneStatus = "loading";
    },
    [removeCompanyFromSectionOne.fulfilled]: (state, action) => {
      state.removeCompanyFromSectionOneStatus = "succeeded";
      state.removeCompanyFromSectionOneError = "";
      state.companiesSectionOne = state.companiesSectionOne.filter(
        (company) => company._id !== action.payload.data.user._id
      );
    },
    [removeCompanyFromSectionOne.rejected]: (state, { payload }) => {
      state.removeCompanyFromSectionOneStatus = "failed";

      if (payload === "timeout") {
        state.removeCompanyFromSectionOneError = "timeout-msg";
      } else if (payload === "cancel") {
        state.removeCompanyFromSectionOneError = "cancel-operation-msg";
      } else if (payload === "network failed") {
        state.removeCompanyFromSectionOneError = "network failed";
      } else state.removeCompanyFromSectionOneError = payload.message;
    },
  },
});

export const selectCompaniesSectionOne = (state) => state.companiesSectionOne;

export const {
  resetCompaniesSectionOneStatus,
  resetCompaniesSectionOneError,
  resetAddCompanyToSectionOneStatus,
  resetAddCompanyToSectionOneError,
  resetRemoveCompanyFromSectionOneStatus,
  resetRemoveCompanyFromSectionOneError,
  resetFavoritesCompanies,
} = companiesSectionOneSlice.actions;

export default companiesSectionOneSlice.reducer;
