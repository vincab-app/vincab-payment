// server.js
import dotenv from "dotenv";
dotenv.config()

import express from "express";
import bodyParser from "body-parser";
import { stkPush } from "./stkPush.js";
import { payDriver } from "./b2c.js";

const app = express();
app.use(bodyParser.json());

// Rider starts trip (send STK)
app.post("/pay", async (req, res) => {
  const { phone, amount, tripId } = req.body;
  const response = await stkPush(phone, amount, `TRIP-${tripId}`);
  res.json(response);
});

// Driver marks trip completed → payout
app.post("/payout", async (req, res) => {
  const { driverPhone, amount } = req.body;
  const response = await payDriver(driverPhone, amount);
  res.json(response);
});

// Callback endpoint (from Safaricom after payment)
app.post("/callback", (req, res) => {
  console.log("Callback from M-Pesa:", req.body);
  // ✅ Verify + update trip status in DB
  res.sendStatus(200);
});


// ✅ B2C Result URL (Daraja will POST here with transaction results)
app.post("/b2c/result", (req, res) => {
  console.log("📩 B2C Result received:", JSON.stringify(req.body, null, 2));

  // You can save this to your DB or trigger business logic here
  // Example:
  const { Result } = req.body;
  if (Result.ResultCode === 0) { // success
    console.log("Payment successful:", Result);
  } else {
    console.log("Payment failed:", Result);
  }

  res.status(200).send({ message: "B2C Result received successfully" });
});

// ✅ B2C Timeout URL (Daraja will call this if request times out)
app.post("/b2c/timeout", (req, res) => {
  console.log("⚠️ B2C Timeout received:", JSON.stringify(req.body, null, 2));

  // Log or save timeout data for debugging
  res.status(200).send({ message: "B2C Timeout received successfully" });
});

app.listen(5000, () => console.log("Server running on port 5000"));
