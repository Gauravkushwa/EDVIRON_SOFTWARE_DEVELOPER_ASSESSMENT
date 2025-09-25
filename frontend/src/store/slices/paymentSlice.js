import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../services/axios";

export const createOrder = createAsyncThunk(
  "payment/createOrder",
  async (orderData, { rejectWithValue }) => {
    try {
      const res = await axios.post("/payments/create-order", orderData);

      // If Razorpay checkout is required:
      if (res.data && res.data.order) {
        const { order } = res.data;

        const options = {
          key: "rzp_test_dummyid123", // replace with your Razorpay test key
          amount: order.amount,
          currency: order.currency,
          name: "School Fees",
          description: "Tuition Payment",
          order_id: order.id,
          handler: async function (response) {
            await axios.post("/payment/verify", response);
            alert("Payment Successful");
          },
          prefill: {
            email: "student@example.com",
            contact: "9999999999",
          },
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      }

      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

const paymentSlice = createSlice({
  name: "payment",
  initialState: { loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default paymentSlice.reducer;
