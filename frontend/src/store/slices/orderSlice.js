import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// API base
const API = "http://localhost:8765/api";

// 🔹 Pay Fees
export const payFees = createAsyncThunk(
  "order/payFees",
  async (amount, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `${API}/payments/pay`,
        { amount },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// 🔹 Fetch Transactions
export const fetchTransactions = createAsyncThunk(
  "order/fetchTransactions",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API}/finance/transactions`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

const orderSlice = createSlice({
  name: "order",
  initialState: {
    transactions: [],
    loading: false,
    error: null,
    success: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(payFees.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(payFees.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(payFees.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchTransactions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        state.loading = false;
        state.transactions = action.payload;
      })
      .addCase(fetchTransactions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default orderSlice.reducer;
