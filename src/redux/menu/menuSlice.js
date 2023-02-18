import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
  open: false,
};

export const menuSettingsSlice = createSlice({
  name: "menuSettingsSlice",
  initialState,
  reducers: {
    toggleOpenMenu: (state) => {
      state.open = !state.open;
    },
  },
});

export const selectMenuSettings = (state) => state.menuSettings;

export const { toggleOpenMenu } = menuSettingsSlice.actions;

export default menuSettingsSlice.reducer;
