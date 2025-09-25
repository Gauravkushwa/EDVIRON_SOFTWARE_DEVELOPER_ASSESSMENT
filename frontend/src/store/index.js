import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import paymentReducer from "./slices/paymentSlice";
import transactionsReducer from "./slices/transactionsSlice";
import orderReducer from './slices/orderSlice'

 const store = configureStore({
  reducer: {
    auth: authReducer,
    payment: paymentReducer,
    transactions: transactionsReducer,
    order: orderReducer
  },
});

export default store
