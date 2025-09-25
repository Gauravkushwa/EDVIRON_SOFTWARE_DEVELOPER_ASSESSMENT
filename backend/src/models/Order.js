const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  schoolId: { type: mongoose.Schema.Types.ObjectId, ref: 'School', required: true },
  items: [
    {
      name: String,
      qty: { type: Number, default: 1 },
      price: { type: Number, required: true }
    }
  ],
  amount: { type: Number, required: true }, 
  currency: { type: String, default: 'INR' },
  status: { type: String, enum: ['pending','paid','failed','cancelled'], default: 'pending' },
  paymentMethod: { type: String }, 
  gatewayOrderId: { type: String }, 
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, { versionKey: false, timestamps: true });


const OrderModel = mongoose.model("Order", orderSchema);

module.exports = {OrderModel}

