// app.js
import express from "express";
import bodyParser from "body-parser";

const app = express();

// Middleware
app.use(bodyParser.json());

// Default route
app.get("/", (req, res) => {
  res.send("🚖 VinCab Payments API is running!");
});

// Test route for rider payment
app.post("/pay", (req, res) => {
  const { phone, amount } = req.body;
  res.json({
    message: "STK Push request received",
    phone,
    amount,
  });
});

// Test route for driver payout
app.post("/payout", (req, res) => {
  const { driverPhone, amount } = req.body;
  res.json({
    message: "Driver payout request received",
    driverPhone,
    amount,
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
