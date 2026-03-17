import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLogin: false,
  admin: null,
  loading: true
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      state.isLogin = true;
      state.admin = action.payload.admin;
      state.role = action.payload.role;
      state.loading = false;
    },
    logout: (state) => {
      state.isLogin = false;
      state.admin = null;
      state.loading = false;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    }
  }
});

export const { login, logout, setLoading } = authSlice.actions;
export default authSlice.reducer;