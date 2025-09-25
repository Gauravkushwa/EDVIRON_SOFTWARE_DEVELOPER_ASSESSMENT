const { WebhookLogModel } = require("../models/WebhookLogs")
const { OrderModel } = require("../models/Order")
const { TransactionModel } = require('../models/Transaction');
const paymentService = require('../services/paymentService');

const razorpayWebhook = async (req, res) => {
  try {
    // req.rawBody must be set by express middleware (we show this in app.js)
    const rawBody = req.rawBody || JSON.stringify(req.body);
    const signature = req.headers['x-razorpay-signature'];
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

    // log incoming
    const log = await WebhookLogModel.create({
      gateway: 'razorpay',
      event: req.body.event,
      payload: req.body,
      headers: req.headers
    });

    const verified = paymentService.verifyRazorpayWebhook(rawBody, signature, webhookSecret);
    log.verified = verified;
    await log.save();

    if (!verified) {
      // respond 400 or 401 for invalid signature
      return res.status(400).json({ error: 'Invalid signature' });
    }

    const event = req.body.event;
    const payload = req.body.payload || {};

    // Example: payment.captured or payment.failed
    if (event === 'payment.captured' || event === 'payment.failed') {
      const paymentEntity = payload.payment && payload.payment.entity ? payload.payment.entity : null;
      if (paymentEntity) {
        const gatewayPaymentId = paymentEntity.id;
        const amount = (paymentEntity.amount || 0) / 100; // convert paise to rupees
        const gatewayOrderId = paymentEntity.order_id;

        // Find matching local order (by gatewayOrderId)
        const order = await OrderModel.findOne({ gatewayOrderId });
        if (!order) {
          // optionally create a record or ignore
          console.warn('Order not found for gatewayOrderId', gatewayOrderId);
        } else {
          await TransactionModel.create({
            orderId: order._id,
            gateway: 'razorpay',
            gatewayPaymentId,
            amount,
            currency: paymentEntity.currency || 'INR',
            status: event === 'payment.captured' ? 'success' : 'failed',
            rawResponse: paymentEntity
          });

          order.status = (event === 'payment.captured') ? 'paid' : 'failed';
          await order.save();
        }
      }
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('Webhook handler error:', err);
    return res.status(500).json({ error: 'internal error' });
  }
};

module.exports = {razorpayWebhook}
