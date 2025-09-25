// // src/pages/PaymentPage.jsx
// import React from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { createOrder } from "../store/slices/orderSlice";
// import orderService from "../services/orderService";

// const PaymentPage = () => {
//   const dispatch = useDispatch();
//   const { currentOrder, loading } = useSelector((state) => state.order);

//   const handlePayment = async () => {
//     const items = [{ name: "Tuition Fee", price: 5000, quantity: 1 }];
//     const order = await dispatch(createOrder(items)).unwrap();

//     if (!order) return alert("Order creation failed");

//     const options = {
//       key: "rzp_test_123456789", // Razorpay test key
//       amount: order.amount,
//       currency: order.currency,
//       name: "School Fees Payment",
//       description: "Payment for tuition",
//       order_id: order.orderId,
//       handler: async function (response) {
//         try {
//           await orderService.verifyPayment(response);
//           alert("✅ Payment Successful");
//         } catch (err) {
//           alert("❌ Payment verification failed");
//         }
//       },
//       prefill: {
//         name: "Student Name",
//         email: "student@example.com",
//       },
//       theme: {
//         color: "#3399cc",
//       },
//     };

//     const rzp = new window.Razorpay(options);
//     rzp.open();
//   };

//   return (
//     <div className="p-6">
//       <h1 className="text-xl font-bold mb-4">Pay Fees</h1>
//       <button
//         onClick={handlePayment}
//         disabled={loading}
//         className="bg-blue-600 text-white px-4 py-2 rounded"
//       >
//         {loading ? "Creating Order..." : "Pay Now"}
//       </button>
//     </div>
//   );
// };

// // export default PaymentPage;
