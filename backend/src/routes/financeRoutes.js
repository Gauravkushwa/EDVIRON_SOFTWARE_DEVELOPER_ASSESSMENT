const express = require("express");
const financeController = require("../controllers/financeController");
const {authMiddleware} = require("../middlewares/authMiddleware");
const {authorizedRole} = require("../middlewares/authMiddleware");

const router = express.Router();

// Only finance role can access these routes
router.get("/transactions", authMiddleware, authorizedRole(["finance", "admin"]), financeController.listTransactions);

router.get("/transactions/:id", authMiddleware, authorizedRole(["finance", "admin"]), financeController.getTransaction);

router.post('/transactions', authMiddleware, authorizedRole(["finance", "admin"]), financeController.createTransaction);

module.exports = router;
