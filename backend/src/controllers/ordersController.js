const { OrderModel } = require('../models/Order');
const { TransactionModel } = require('../models/Transaction');
const paymentService = require('../services/paymentService');

/**
 * Create an order (user or school_staff)
 */
const createOrder = async (req, res) => {
  try {
    const userId = req.user._id;
    const { items = [], paymentMethod = 'razorpay', schoolId: bodySchoolId } = req.body;

    if (!items.length) {
      return res.status(400).json({ error: 'No items provided' });
    }

    // ✅ Decide schoolId based on role
    let schoolId;
    if (req.user.role === 'school_staff') {
      schoolId = req.user.schoolId; // must be saved in User model
    } else {
      schoolId = bodySchoolId;
    }

    if (!schoolId) {
      return res.status(400).json({ error: 'schoolId is required' });
    }

    const amount = items.reduce((sum, it) => sum + (it.price * (it.qty || 1)), 0);

    // Create Order in DB
    const order = await OrderModel.create({
      userId,
      schoolId,
      items,
      amount,
      currency: 'INR',
      status: 'pending',
      paymentMethod
    });

    if (paymentMethod === 'razorpay') {
      const gwOrder = await paymentService.createRazorpayOrder(amount * 100); // convert to paise
      order.gatewayOrderId = gwOrder.id;
      await order.save();

      await TransactionModel.create({
        orderId: order._id,
        gateway: 'razorpay',
        gatewayPaymentId: null,
        amount,
        currency: 'INR',
        status: 'created',
        rawResponse: gwOrder
      });

      return res.json({
        success: true,
        order: {
          id: order._id,
          schoolId: order.schoolId,
          amount: order.amount,
          currency: order.currency,
          gatewayOrderId: gwOrder.id,
          gateway: 'razorpay',
          razorpayKeyId: process.env.RAZORPAY_KEY_ID || 'test_key'
        }
      });
    } else {
      return res.status(400).json({ error: 'Unsupported payment method' });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error', details: err.message });
  }
};


/**
 * Get single order with RBAC
 */
const getOrder = async (req, res) => {
  try {
    const user = req.user;
    const { id } = req.params;

    let query = { _id: id };

    if (user.role === 'user') {
      query.userId = user._id;
    } else if (user.role === 'school_staff') {
      query.schoolId = user.schoolId;
    } else if (user.role === 'finance') {
      return res.status(403).json({ error: 'Finance role cannot access orders' });
    }

    const order = await OrderModel.findOne(query).lean();
    if (!order) return res.status(404).json({ error: 'Order not found' });

    return res.json({ order });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

/**
 * List orders with RBAC
 */
const listOrders = async (req, res) => {
  try {
    const user = req.user;
    const page = parseInt(req.query.page) || 1;
    const limit = Math.min(parseInt(req.query.limit) || 20, 100);
    const skip = (page - 1) * limit;

    let query = {};

    if (user.role === 'user') {
      query.userId = user._id;
    } else if (user.role === 'school_staff') {
      query.schoolId = user.schoolId;
    } else if (user.role === 'finance') {
      return res.status(403).json({ error: 'Finance role cannot access orders' });
    }
    // admin sees all orders

    const orders = await OrderModel.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await OrderModel.countDocuments(query);

    return res.json({ orders, total, page, limit });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = {
    createOrder,
    getOrder,
    listOrders
}