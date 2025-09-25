import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchTransactions } from "../store/slices/transactionsSlice";

const TransactionsPage = () => {
  const dispatch = useDispatch();
  const { transactions, total, page: currentPage, limit, loading, error } = useSelector(
    (state) => state.transactions
  );

  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState(""); // "", "success", "failed", "pending"
  const [sortOrder, setSortOrder] = useState("desc"); // "asc" or "desc" .

  useEffect(() => {
    dispatch(fetchTransactions({ page, limit: 10, status: statusFilter, sort: sortOrder }));
  }, [dispatch, page, statusFilter, sortOrder]);

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Transaction History</h1>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-4 items-center">
        <div>
          <label className="mr-2 font-semibold">Status:</label>
          <select
            value={statusFilter}
            onChange={(e) => { setPage(1); setStatusFilter(e.target.value); }}
            className="border p-1 rounded"
          >
            <option value="">All</option>
            <option value="success">Success</option>
            <option value="failed">Failed</option>
            <option value="pending">Pending</option>
          </select>
        </div>

        <div>
          <label className="mr-2 font-semibold">Sort by Date:</label>
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="border p-1 rounded"
          >
            <option value="desc">Newest First</option>
            <option value="asc">Oldest First</option>
          </select>
        </div>
      </div>

      {loading && <p>Loading transactions...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}

      {!loading && transactions.length === 0 && <p>No transactions found.</p>}

      {!loading && transactions.length > 0 && (
        <>
          <ul className="space-y-3">
            {transactions.map((tx) => (
              <li
                key={tx._id}
                className="border p-3 rounded shadow bg-white flex justify-between"
              >
                <span>{tx.description || "Payment"}</span>
                <span className="font-semibold">₹{tx.amount}</span>
                <span>{new Date(tx.createdAt).toLocaleDateString()}</span>
                <span
                  className={`px-2 py-1 rounded text-sm ${
                    tx.status === "success"
                      ? "bg-green-100 text-green-700"
                      : tx.status === "failed"
                      ? "bg-red-100 text-red-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {tx.status}
                </span>
              </li>
            ))}
          </ul>

          {/* Pagination Controls */}
          <div className="flex justify-center mt-4 space-x-2">
            <button
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
              className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
            >
              Prev
            </button>
            <span className="px-3 py-1">
              {page} / {totalPages || 1}
            </span>
            <button
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default TransactionsPage;
