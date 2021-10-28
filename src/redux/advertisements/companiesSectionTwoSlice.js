import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import axios from "axios";
import { BASEURL } from "../../utils/constants";

const initialState = {
  companiesSectionTwoStatus: "idle",
  companiesSectionTwoError: "",
  addCompanyToSectionTwoStatus: "",
  addCompanyToSectionTwoError: "",
  removeCompanyFromSectionTwoStatus: "idle",
  removeCompanyFromSectionTwoError: "",
  companiesSectionTwo: [],
  count: 0,
};

let CancelToken;
let source;

export const getCompaniesSectionTwo = createAsyncThunk(
  "advertisement/companiesSectionTwo",
  async ({ token }, { rejectWithValue }) => {
    try {
      CancelToken = axios.CancelToken;
      source = CancelToken.source();

      const response = await axios.get(
        `${BASEURL}/users?type=company&isActive=true&inSectionTwo=true&page=1&limit=25`,
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

export const addCompanyToSectionTwo = createAsyncThunk(
  "advertisement/addCompanyToSectionTwo",
  async ({ token, id }, { rejectWithValue }) => {
    try {
      CancelToken = axios.CancelToken;
      source = CancelToken.source();

      const response = await axios.post(
        `${BASEURL}/users/inSectionTwo/${id}`,
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

export const removeCompanyFromSectionTwo = createAsyncThunk(
  "advertisement/removeCompanyFromSectionTwo",
  async ({ token, id }, { rejectWithValue }) => {
    try {
      CancelToken = axios.CancelToken;
      source = CancelToken.source();

      const response = await axios.post(
        `${BASEURL}/users/inSectionTwo/${id}`,
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

export const companiesSectionTwoSlice = createSlice({
  name: "companiesSectionTwo",
  initialState,
  reducers: {
    resetCompaniesSectionTwoStatus: (state) => {
      state.companiesSectionTwoStatus = "idle";
      state.companiesSectionTwoError = "";
    },

    resetCompaniesSectionTwoError: (state) => {
      state.companiesSectionTwoError = "";
    },

    resetAddCompanyToSectionTwoStatus: (state) => {
      state.addCompanyToSectionTwoStatus = "idle";
      state.addCompanyToSectionTwoError = "";
    },

    resetAddCompanyToSectionTwoError: (state) => {
      state.addCompanyToSectionTwoError = "";
    },

    resetRemoveCompanyFromSectionTwoStatus: (state) => {
      state.removeCompanyFromSectionTwoStatus = "idle";
      state.removeCompanyFromSectionTwoError = "";
    },

    resetRemoveCompanyFromSectionTwoError: (state) => {
      state.removeCompanyFromSectionTwoError = "";
    },

    resetCompaniesSectionTwo: (state) => {
      state.companiesSectionTwoStatus = "idle";
      state.companiesSectionTwoError = "";
      state.addCompanyToSectionTwoStatus = "idle";
      state.addCompanyToSectionTwoError = "";
      state.removeCompanyFromSectionTwoStatus = "idle";
      state.removeCompanyFromSectionTwoError = "";
      state.companiesSectionTwo = [];
      state.count = 0;
    },
  },

  extraReducers: {
    [getCompaniesSectionTwo.pending]: (state) => {
      state.companiesSectionTwoStatus = "loading";
    },
    [getCompaniesSectionTwo.fulfilled]: (state, action) => {
      state.companiesSectionTwoStatus = "succeeded";
      state.companiesSectionTwo = action.payload.data.users;
      state.companiesSectionTwoError = "";
    },
    [getCompaniesSectionTwo.rejected]: (state, { payload }) => {
      state.companiesSectionTwoStatus = "failed";

      if (payload === "timeout") {
        state.companiesSectionTwoError = "timeout-msg";
      } else if (payload === "cancel") {
        state.companiesSectionTwoError = "cancel-operation-msg";
      } else if (payload === "network failed") {
        state.companiesSectionTwoError = "network failed";
      } else state.companiesSectionTwoError = payload.message;
    },

    [addCompanyToSectionTwo.pending]: (state) => {
      state.addCompanyToSectionTwoStatus = "loading";
    },
    [addCompanyToSectionTwo.fulfilled]: (state, action) => {
      state.addCompanyToSectionTwoStatus = "succeeded";
      state.addCompanyToSectionTwoError = "";
      state.companiesSectionTwo = [
        ...state.companiesSectionTwo,
        action.payload.data.user,
      ];
    },
    [addCompanyToSectionTwo.rejected]: (state, { payload }) => {
      state.addCompanyToSectionTwoStatus = "failed";

      if (payload === "timeout") {
        state.addCompanyToSectionTwoError = "timeout-msg";
      } else if (payload === "cancel") {
        state.addCompanyToSectionTwoError = "cancel-operation-msg";
      } else if (payload === "network failed") {
        state.addCompanyToSectionTwoError = "network failed";
      } else state.addCompanyToSectionTwoError = payload.message;
    },

    [removeCompanyFromSectionTwo.pending]: (state) => {
      state.removeCompanyFromSectionTwoStatus = "loading";
    },
    [removeCompanyFromSectionTwo.fulfilled]: (state, action) => {
      state.removeCompanyFromSectionTwoStatus = "succeeded";
      state.removeCompanyFromSectionTwoError = "";
      state.companiesSectionTwo = state.companiesSectionTwo.filter(
        (company) => company._id !== action.payload.data.user._id
      );
    },
    [removeCompanyFromSectionTwo.rejected]: (state, { payload }) => {
      state.removeCompanyFromSectionTwoStatus = "failed";

      if (payload === "timeout") {
        state.removeCompanyFromSectionTwoError = "timeout-msg";
      } else if (payload === "cancel") {
        state.removeCompanyFromSectionTwoError = "cancel-operation-msg";
      } else if (payload === "network failed") {
        state.removeCompanyFromSectionTwoError = "network failed";
      } else state.removeCompanyFromSectionTwoError = payload.message;
    },
  },
});

export const selectCompaniesSectionTwo = (state) => state.companiesSectionTwo;

export const {
  resetCompaniesSectionTwoStatus,
  resetCompaniesSectionTwoError,
  resetAddCompanyToSectionTwoStatus,
  resetAddCompanyToSectionTwoError,
  resetRemoveCompanyFromSectionTwoStatus,
  resetRemoveCompanyFromSectionTwoError,
  resetFavoritesCompanies,
} = companiesSectionTwoSlice.actions;

export default companiesSectionTwoSlice.reducer;
