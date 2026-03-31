import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLogin: false,
  user: null,
  role: "client",
  loading: true
};

const clientSlice = createSlice({
  name: "clientAuth",
  initialState,
  reducers: {
    loginClient: (state, action) => {
      state.isLogin = true;
      state.user = action.payload.user;
      state.role = action.payload.role || "client";
      state.loading = false;
    },
    logoutClient: (state) => {
      state.isLogin = false;
      state.user = null;
      state.role = "client";
      state.loading = false;
    },
    setLoadingClient: (state, action) => {
      state.loading = action.payload;
    }
  }
});

export const { loginClient, logoutClient, setLoadingClient } = clientSlice.actions;
export default clientSlice.reducer;