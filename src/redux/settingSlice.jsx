import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  settings: null,
  loading: false
};

const settingSlice = createSlice({
  name: "setting",
  initialState,
  reducers: {
    setSettings: (state, action) => {
      state.settings = action.payload;
      state.loading = false;
    },

    setSettingLoading: (state, action) => {
      state.loading = action.payload;
    },

    updateSettings: (state, action) => {
      state.settings = {
        ...state.settings,
        ...action.payload
      };
    },

    clearSettings: (state) => {
      state.settings = null;
      state.loading = false;
    }
  }
});

export const {
  setSettings,
  setSettingLoading,
  updateSettings,
  clearSettings
} = settingSlice.actions;

export default settingSlice.reducer;