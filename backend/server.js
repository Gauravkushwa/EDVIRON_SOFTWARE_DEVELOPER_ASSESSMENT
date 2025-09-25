const express = require("express");
const cors = require("cors");
const env = require("dotenv");
const { DB_Connection } = require("./src/config/db");
const { app } = require("./src/app"); 

env.config();
DB_Connection();

app.use(express.json()); // parse JSON





// Catch-all 404
app.use( (req, res) => {
  res.status(404).json({ error: "Route not found" });
});

const PORT = process.env.PORT || 8765;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
