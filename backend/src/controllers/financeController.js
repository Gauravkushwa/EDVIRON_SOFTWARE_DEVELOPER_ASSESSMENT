// controllers/financeController.js
const { TransactionModel } = require("../models/Transaction");

const createTransaction = async (req, res) => {
  try {
    const { orderId, paymentId, amount, paymentMethod, status, description } = req.body;

    if (!orderId || !amount) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const userId = req.user._id; // Get user from JWT
    const statuses = ["success", "failed", "pending"];
    const paymentStatus =  statuses[Math.floor(Math.random() * statuses.length)];

    const transaction = new TransactionModel({
      user: userId,
      orderId,
      paymentId,
      amount,
      paymentMethod: paymentMethod || "mock",
      status: paymentStatus,
      description: description || "School Fees Payment (Mock)",
    });

    await transaction.save();
    return res.status(201).json({ transaction });
  } catch (err) {
    console.error("CREATE TRANSACTION ERROR:", err);
    return res.status(500).json({ error: "Server error", details: err.message });
  }
};
const listTransactions = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = Math.min(parseInt(req.query.limit) || 20, 100);
    const skip = (page - 1) * limit;

    const { status, sort } = req.query;

    let query = {};
    if (status) {
      query.status = status; // filter by status
    }

    let sortOption = { createdAt: -1 }; 
    if (sort === "asc") sortOption = { createdAt: 1 };
    if (sort === "desc") sortOption = { createdAt: -1 };

    const transactions = await TransactionModel.find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await TransactionModel.countDocuments(query);

    return res.json({ transactions, total, page, limit });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error", details: err.message });
  }
};


const getTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const transaction = await TransactionModel.findById(id).lean();
    if (!transaction) return res.status(404).json({ error: "Transaction not found" });
    return res.json({ transaction });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error", details: err.message });
  }
};

module.exports = { createTransaction, listTransactions, getTransaction };
