import { createSlice } from "@reduxjs/toolkit";

const initialState = { // state ban đầu
  isLogin: false,
  admin: null
};

const authSlice = createSlice({ 
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      state.isLogin = true;
      state.admin = action.payload;
    },
    logout: (state) => {
      state.isLogin = false;
      state.admin = null;
    }
  }
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;