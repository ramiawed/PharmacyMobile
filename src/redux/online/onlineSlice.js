import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  onlineStatus: null,
  onlineMsg: null,
};

export const onlineSlice = createSlice({
  name: "onlineSlice",
  initialState,
  reducers: {
    changeOnlineStatus: (state, action) => {
      state.onlineStatus = action.payload;
    },
    resetOnlineMsg: (state) => {
      state.onlineMsg = null;
    },
    changeOnlineMsg: (state) => {
      state.onlineMsg = "no-internet-connection";
    },
  },
});

export const { changeOnlineStatus, resetOnlineMsg, changeOnlineMsg } =
  onlineSlice.actions;

export const selectOnlineStatus = (state) => state.online.onlineStatus;
export const selectOnlineMsg = (state) => state.online.onlineMsg;

export default onlineSlice.reducer;
