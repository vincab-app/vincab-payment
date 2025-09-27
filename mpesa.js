// mpesa.js
import dotenv from "dotenv";
dotenv.config();
import axios from "axios";

export const generateToken = async () => {
  const url = "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials";

  const consumerKey = process.env.DARAJA_CONSUMER_KEY;
  const consumerSecret = process.env.DARAJA_CONSUMER_SECRET;

  if (!consumerKey || !consumerSecret) {
    throw new Error("❌ Missing DARAJA_CONSUMER_KEY or DARAJA_CONSUMER_SECRET in .env");
  }

  const auth = Buffer.from(
    process.env.DARAJA_CONSUMER_KEY + ":" + process.env.DARAJA_CONSUMER_SECRET
  ).toString("base64");

  const { data } = await axios.get(url, {
    headers: { Authorization: `Basic ${auth}` },
  });

  return data.access_token;
};
