const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const cors = require('cors')

dotenv.config();
const app = express();
// ✅ CORS middleware
app.use(cors({
  origin: "http://localhost:5173", // frontend origin
 methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));


// Routes
const authRoutes = require('./routes/authRoutes');
const ordersRoutes = require('./routes/ordersRoutes');
const webhookRoutes = require('./routes/webhookRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const financeRoutes = require('./routes/financeRoutes')


// ✅ JSON body parser with raw body capture (for webhooks)
app.use(bodyParser.json({
  verify: function (req, res, buf, encoding) {
    req.rawBody = buf.toString(encoding || 'utf8'); // store raw body for webhook signature verification
  }
}));
app.use(bodyParser.urlencoded({ extended: true }));

// ✅ Cookie parser (for refresh tokens if you’re using cookies)
app.use(cookieParser());


// Routes
app.use('/api/auth', authRoutes);
app.use('/api/orders', ordersRoutes);
app.use('/api/webhook', webhookRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/finance', financeRoutes)

// Basic health check
app.get('/', (req, res) => {
  res.json({ status: 'API is running 🚀' });
});

module.exports = { app };
