import { createSlice } from "@reduxjs/toolkit";
import { getUserRatings } from "../services/user";
import { fetchStoresThunk } from "./thunk/storeThunks";

const storeSlice = createSlice({
  name: "store",
  initialState: {
    stores: [],
    userRatings: {},
    loading: false,
    error: "",
    page: 1,
    hasMore: true,
  },
  reducers: {
    resetStores(state) {
      state.stores = [];
      state.page = 1;
      state.hasMore = true;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchStoresThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchStoresThunk.fulfilled, (state, action) => {
        state.loading = false;
        console.log("action.payload fetch stores:", action.payload);
      })
      .addCase(fetchStoresThunk.rejected, (state, action) => {
        state.loading = false;
        console.log("fetch syore error");
      });
  },
});

export const storeActions = storeSlice.actions;
export default storeSlice.reducer;
