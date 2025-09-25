# School Payment & Transactions Dashboard

## Project Overview
This project is a **full-stack school payment and transaction management system**. It allows students to pay school fees and enables the finance/admin team to track, manage, and analyze transactions. The system supports **success, pending, and failed payments**, with **filtering, sorting, and pagination** for efficient finance management.

---

## Features

### Payment & Transactions
- Students can pay fees online (mock payment integration for testing).  
- Backend stores each transaction with details: amount, status, payment method, gateway, and timestamp.  
- Transactions can have **statuses**: `success`, `pending`, `failed`.  

### Admin / Finance Features
- View all transactions with **pagination**.  
- Filter transactions by **status**.  
- Sort transactions by **date** (ascending/descending) or by **status**.  
- Role-based access: only **finance/admin** can access transaction management.  

### UI / UX
- Responsive React frontend.  
- Clear status badges: **green** for success, **yellow** for pending, **red** for failed.  
- Forms with validation for payment amount.  
- Real-time updates of transaction list after payment.  

---

## Tech Stack

### Frontend
- **React.js** (Vite)  
- **Redux Toolkit** (state management)  
- **Axios** (HTTP client)  
- **Tailwind CSS** (styling)  

### Backend
- **Node.js & Express.js**  
- **MongoDB** (database)  
- **Mongoose** (ODM)  
- **JWT Authentication** for user sessions  
- **Role-based access control** (Finance/Admin/Student)

---


