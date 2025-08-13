import { configureStore } from "@reduxjs/toolkit";
import storeReducer from "./store";

const rootStore = configureStore({
  reducer: {
    store: storeReducer,
  },
});

export default rootStore;
