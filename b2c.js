// b2c.js
import dotenv from "dotenv";
dotenv.config();
import axios from "axios";
import { generateToken } from "./mpesa.js";

export const payDriver = async (driverPhone, amount) => {
  const token = await generateToken();

  const payload = {
    InitiatorName: process.env.INITIATOR_NAME,
    SecurityCredential: process.env.SECURITY_CREDENTIAL, // encrypted password
    CommandID: "BusinessPayment",
    Amount: amount,
    PartyA: process.env.SHORTCODE2, // your paybill/till
    PartyB: driverPhone,
    Remarks: "VinCab Driver Payout",
    QueueTimeOutURL: process.env.TIMEOUT_URL,
    ResultURL: process.env.RESULT_URL,
    Occasion: "Trip Completed",
  };

  const { data } = await axios.post(
    "https://sandbox.safaricom.co.ke/mpesa/b2c/v1/paymentrequest",
    payload,
    { headers: { Authorization: `Bearer ${token}` } }
  );

  return data;
};
