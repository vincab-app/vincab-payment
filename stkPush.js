// stkPush.js
import dotenv from "dotenv";
dotenv.config();
import axios from "axios";
import { generateToken } from "./mpesa.js";
import moment from "moment";

export const stkPush = async (phone, amount, accountRef) => {
  const token = await generateToken();

  const timestamp = moment().format("YYYYMMDDHHmmss");
  const password = Buffer.from(
    process.env.SHORTCODE + process.env.PASSKEY + timestamp
  ).toString("base64");

  const payload = {
    BusinessShortCode: process.env.SHORTCODE,
    Password: password,
    Timestamp: timestamp,
    TransactionType: "CustomerPayBillOnline",
    Amount: amount,
    PartyA: phone, // rider’s phone
    PartyB: process.env.SHORTCODE,
    PhoneNumber: phone,
    CallBackURL: process.env.CALLBACK_URL, // your backend endpoint
    AccountReference: accountRef,
    TransactionDesc: "VinCab Fare Payment",
  };

  const { data } = await axios.post(
    "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
    payload,
    { headers: { Authorization: `Bearer ${token}` } }
  );

  return data;
};
