import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import settingReducer from "./settingSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    setting: settingReducer
  }
});

export default store;