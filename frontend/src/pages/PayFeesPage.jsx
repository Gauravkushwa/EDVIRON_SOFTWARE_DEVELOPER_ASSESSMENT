import React, { useState } from "react";
import api from "../services/axios";
import { useDispatch } from "react-redux";
import { fetchTransactions } from "../store/slices/transactionsSlice";

const PayFeesPage = () => {
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null); // success/fail/pending message
  const dispatch = useDispatch();

  const handlePay = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      // --- Mock payment response ---
      const mockPaymentId = "mock_payment_" + Date.now();
      const mockOrderId = "mock_order_" + Date.now();

      // Randomly assign payment status
      const statuses = ["success", "failed", "pending"];
      const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];

      // Save transaction to backend
      await api.post(
        "/finance/transactions",
        {
          orderId: mockOrderId,
          gateway: "mock",
          gatewayPaymentId: mockPaymentId,
          amount: Number(amount),
          status: randomStatus,
          description: "School Fees Payment (Mock)"
        },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );

      // Show message according to status
      if (randomStatus === "success") {
        setMessage({ text: `Payment successful! Transaction ID: ${mockPaymentId}`, type: "success" });
      } else if (randomStatus === "failed") {
        setMessage({ text: `Payment failed! Transaction ID: ${mockPaymentId}`, type: "error" });
      } else {
        setMessage({ text: `Payment pending. Transaction ID: ${mockPaymentId}`, type: "pending" });
      }

      // Refresh transactions in Redux
      dispatch(fetchTransactions());

    } catch (err) {
      console.error(err);
      setMessage({ text: err.response?.data?.error || "Payment failed. Please try again.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-4">Pay Fees</h1>

      <form onSubmit={handlePay} className="space-y-4">
        <input
          type="number"
          placeholder="Enter amount (INR)"
          className="w-full border p-2 rounded"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Processing..." : "Pay Now"}
        </button>
      </form>

      {message && (
        <p
          className={`mt-4 ${
            message.type === "success" ? "text-green-600" :
            message.type === "error" ? "text-red-600" :
            "text-yellow-600"
          }`}
        >
          {message.text}
        </p>
      )}
    </div>
  );
};

export default PayFeesPage;
