const express = require("express");
const cors = require("cors");
const env = require("dotenv");
const { DB_Connection } = require("./src/config/db");
const { app } = require("./src/app"); 

env.config();

// Enable CORS
app.use(cors());
app.use(express.json()); // parse JSON

// Example health route
app.get("/", (req, res) => {
  res.send("Server is running!");
});

// Catch-all 404 (after all routes)
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Start server after DB connection
const startServer = async () => {
  await DB_Connection();
  const PORT = process.env.PORT || 8765;
  app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
  });
};

startServer();
