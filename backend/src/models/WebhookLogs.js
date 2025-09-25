const mongoose = require('mongoose');

const webhookLogSchema = new mongoose.Schema({
  gateway: { type: String, required: true },
  event: { type: String },
  payload: { type: Object },
  headers: { type: Object },
  verified: { type: Boolean, default: false },
  receivedAt: { type: Date, default: Date.now }
});

const WebhookLogModel = mongoose.model('WebhookLog', webhookLogSchema);

module.exports = {WebhookLogModel}
