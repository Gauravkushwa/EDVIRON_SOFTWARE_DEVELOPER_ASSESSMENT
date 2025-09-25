// src/components/Navbar.jsx
import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {clearCredentials} from "../store/slices/authSlice"
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    dispatch(clearCredentials());
    navigate("/login");
    setIsOpen(false);
  };

  // Utility: styles for active link
  const getLinkClass = ({ isActive }) =>
    `hover:text-gray-200 transition ${
      isActive ? "font-bold underline text-yellow-300" : ""
    }`;

  const navLinks = (
    <>
      <NavLink to="/pay" className={getLinkClass} onClick={() => setIsOpen(false)}>
        Pay Fees
      </NavLink>
      <NavLink to="/transactions" className={getLinkClass} onClick={() => setIsOpen(false)}>
        Transactions
      </NavLink>

      {user ? (
        <>
          <span className="font-medium">{user.username}</span>
          <button
            onClick={handleLogout}
            className="bg-red-500 px-3 py-1 rounded hover:bg-red-600"
          >
            Logout
          </button>
        </>
      ) : (
        <>
          <NavLink to="/login" className={getLinkClass} onClick={() => setIsOpen(false)}>
            Login
          </NavLink>
          <NavLink to="/register" className={getLinkClass} onClick={() => setIsOpen(false)}>
            Register
          </NavLink>
        </>
      )}
    </>
  );

  return (
    <nav className="bg-blue-600 text-white fixed w-full top-0 left-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center">
        {/* Logo */}
        <NavLink to="/" className="font-bold text-lg" onClick={() => setIsOpen(false)}>
          SchoolPay
        </NavLink>

        {/* Desktop Menu */}
        <div className="hidden md:flex gap-6 items-center">{navLinks}</div>

        {/* Mobile Menu Button */}
        <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Dropdown */}
      {isOpen && (
        <div className="md:hidden flex flex-col gap-4 px-6 py-4 bg-blue-700">
          {navLinks}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
