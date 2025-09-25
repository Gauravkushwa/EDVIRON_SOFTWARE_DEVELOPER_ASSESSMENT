
import axios from "../services/axios";

const createOrder = async (items) => {
  const { data } = await axios.post("/orders", { items });
  return data; // { orderId, amount, currency }
};

const verifyPayment = async (paymentData) => {
  const { data } = await axios.post("/payments/verify", paymentData);
  return data;
};

const getTransactions = async () => {
  const { data } = await axios.get("/transactions");
  return data; // Array of past payments
};

export default { createOrder, verifyPayment, getTransactions };
