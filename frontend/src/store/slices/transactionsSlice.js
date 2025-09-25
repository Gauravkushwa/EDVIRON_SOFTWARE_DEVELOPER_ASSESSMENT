import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../services/axios";

// fetchTransactions now accepts page, limit, status filter, and sort order
export const fetchTransactions = createAsyncThunk(
  "transactions/fetchTransactions",
  async (
    { page = 1, limit = 10, status = "", sort = "desc" } = {},
    { rejectWithValue }
  ) => {
    try {
      const res = await axios.get("/finance/transactions", {
        params: { page, limit, status, sort },
      });

      return {
        transactions: res.data.transactions || [],
        total: res.data.total || 0,
        page: res.data.page || 1,
        limit: res.data.limit || limit,
      };
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || err.message);
    }
  }
);

const transactionsSlice = createSlice({
  name: "transactions",
  initialState: {
    transactions: [],
    total: 0,
    page: 1,
    limit: 10,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTransactions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        state.loading = false;
        state.transactions = action.payload.transactions;
        state.total = action.payload.total;
        state.page = action.payload.page;
        state.limit = action.payload.limit;
      })
      .addCase(fetchTransactions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default transactionsSlice.reducer;
