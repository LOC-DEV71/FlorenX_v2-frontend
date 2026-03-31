import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import authClientReducer from "./auth.client";
import settingReducer from "./settingSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    setting: settingReducer,
    authClient: authClientReducer
  }
});

export default store;