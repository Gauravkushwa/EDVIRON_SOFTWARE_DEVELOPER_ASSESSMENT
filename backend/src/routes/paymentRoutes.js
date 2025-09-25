const express = require("express");
const router = express.Router();
const paymentService = require("../services/paymentService");
const { authMiddleware } = require("../middlewares/authMiddleware");

router.post("/create-order",authMiddleware, async (req, res) => {
  const amount = req.body.amount || 50000; // default 500 INR
  const order = await paymentService.createOrder(amount);
  res.json(order);
});

router.post("/capture-payment/:orderId",authMiddleware, async (req, res) => {
  try {
    const payment = await paymentService.capturePayment(req.params.orderId);
    res.json(payment);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.post("/webhook", authMiddleware, (req, res) => {
  const isValid = paymentService.verifyWebhook(req.body, req.headers["x-razorpay-signature"]);
  if (isValid) {
    console.log("Webhook received:", req.body);
    res.status(200).send("OK");
  } else {
    res.status(400).send("Invalid signature");
  }
});

module.exports = router;
