const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  orderId: { type: String, required: true }, // changed to String for mock
  gateway: { type: String, required: true, default: "mock" }, 
  gatewayPaymentId: { type: String },
  amount: { type: Number, required: true },
  currency: { type: String, default: 'INR' },
  status: { type: String, enum: ['created','success','failed','pending'], required: true },
  rawResponse: { type: Object },
  description: { type: String },
  createdAt: { type: Date, default: Date.now }
});

const TransactionModel = mongoose.model("Transaction", transactionSchema);

module.exports = {TransactionModel};
