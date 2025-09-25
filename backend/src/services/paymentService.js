// services/paymentService.js
const ordersDB = {};
const paymentsDB = {};

/**
 * Create a mock Razorpay order
 * @param {number} amount - in paise
 * @returns {object} mock order
 */
async function createOrder(amount) {
  const orderId = "order_test_" + Math.floor(Math.random() * 1000000);
  const order = {
    id: orderId,
    amount,
    currency: "INR",
    status: "created",
  };
  ordersDB[orderId] = order;
  return order;
}

/**
 * Alias to match controller function
 */
const createRazorpayOrder = createOrder;

/**
 * Simulate a payment capture
 * @param {string} orderId 
 * @returns {object} payment info
 */
async function capturePayment(orderId) {
  if (!ordersDB[orderId]) throw new Error("Order not found");
  const paymentId = "pay_test_" + Math.floor(Math.random() * 1000000);
  const payment = {
    id: paymentId,
    order_id: orderId,
    status: "captured",
    amount: ordersDB[orderId].amount,
  };
  paymentsDB[paymentId] = payment;
  ordersDB[orderId].status = "paid";
  return payment;
}

/**
 * Simulate verifying webhook signature (always true in mock)
 */
function verifyWebhook(payload, signature) {
  return true;
}

module.exports = {
  createOrder,
  createRazorpayOrder,
  capturePayment,
  verifyRazorpayWebhook : verifyWebhook
};
