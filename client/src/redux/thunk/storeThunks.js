import { createAsyncThunk } from "@reduxjs/toolkit";
import { getStores } from "../../services/admin";

export const fetchStoresThunk = createAsyncThunk(
  "store/fetchStores",
  async ({
    search = "",
    sortBy = "name",
    order = "ASC",
    page = 1,
    limit = 10,
  }) => {
    try {
      const res = await getStores({ search, sortBy, order, page, limit });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Error fetching stores");
    }
  }
);
