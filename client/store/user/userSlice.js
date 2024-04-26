import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentUser: null,
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    requestStart(state) {
      state.loading = true;
    },
    requestSuccess(state, action) {
      state.currentUser = action.payload;
      state.loading = false;
      state.error = null;
    },
    requestFailure(state, action) {
      state.error = action.payload;
      state.loading = false;
    },
    clearError(state) {
      state.error = null;
    },
    clearLoading(state) {
      state.loading = false;
    },
    clearState(state) {
      state.currentUser = null;
      state.loading = false;
      state.error = null;
    },
  },
});

export const {
  requestStart,
  requestSuccess,
  requestFailure,
  clearError,
  clearLoading,
  clearState,
} = userSlice.actions;

export default userSlice.reducer;
