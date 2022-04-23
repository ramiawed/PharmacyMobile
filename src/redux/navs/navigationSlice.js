import { createSlice } from "@reduxjs/toolkit";
import { TopNavLinks } from "../../utils/constants";

const initialState = {
  setting: {
    selectedTopNavOption: TopNavLinks.HOME,
    collapsedSideNavOption: true,
    selectedSideNavOption: "",
    showTopNav: false,
    searchNavShow: false,
    showSearchBar: false,
  },
};

export const navigationSlice = createSlice({
  name: "navigationSlice",
  initialState,
  reducers: {
    changeNavSettings: (state, action) => {
      state.setting = {
        ...state.setting,
        ...action.payload,
      };
    },
  },
});

export const { changeNavSettings } = navigationSlice.actions;

export const selectNavigationSlice = (state) => state.navigationSlice;

export default navigationSlice.reducer;
