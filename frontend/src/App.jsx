import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import TransactionsPage from "./pages/TransactionsPage";
import Navbar from "./components/Navbar";
import PayFeesPage from "./pages/PayFeesPage";
import PrivateRoute from "./components/PrivateComponent";
import UnauthorizedPage from "./pages/UnauthorizedPage";
// console.log("Razorpay Key:", import.meta.env.VITE_RAZORPAY_KEY0);
function App() {
  return (
    <>
      <Navbar />
      <Routes>
        {/* Default redirect */}
        {/* <Route path="/" element={<Navigate to="/login" />} />
         */}
         <Route path="/" element = {<DashboardPage />} />

        {/* Public routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* user-only routes */}
        <Route element={<PrivateRoute allowedRoles={["user", "admin"]} />}>
          <Route path="/pay" element={<PayFeesPage />} />
        </Route>

        {/* user + Admin can see transactions */}
        <Route element={<PrivateRoute allowedRoles={["user", "admin"]} />}>
          <Route path="/transactions" element={<TransactionsPage />} />
        </Route>

        {/* Admin-only routes */}
        <Route element={<PrivateRoute allowedRoles={["admin"]} />}>
          <Route path="/dashboard" element={<DashboardPage />} />
        </Route>

        {/* Finance-only routes */}
        <Route element={<PrivateRoute allowedRoles={["finance", "admin"]} />}>
          <Route path="/reports" element={<h1>Finance Reports</h1>} />
        </Route>

        {/* School Staff-only routes */}
        <Route element={<PrivateRoute allowedRoles={["school_staff"]} />}>
          <Route path="/school-dashboard" element={<h1>School Staff Dashboard</h1>} />
        </Route>

        {/* Unauthorized page */}
        <Route path="/unauthorized" element={<UnauthorizedPage />} />

        {/* Catch-all for invalid routes */}
        <Route path="*" element={<h1>404 - Page Not Found</h1>} />
      </Routes>
    </>
  );
}

export default App;
