import axios from "axios";
import db from "../drizzle/db";
import { paymentsTable, TPaymentInsert } from "../drizzle/schema";

const MPESA_BASE_URL = "https://sandbox.safaricom.co.ke";
const { CONSUMER_KEY, CONSUMER_SECRET, SHORTCODE, PASSKEY } = process.env;

// Get OAuth token
export const getAccessToken = async (): Promise<string> => {
  const response = await axios.get(
    `${MPESA_BASE_URL}/oauth/v1/generate?grant_type=client_credentials`,
    {
      auth: { username: CONSUMER_KEY!, password: CONSUMER_SECRET! },
    }
  );
  return response.data.access_token;
};

// Generate password
export const generatePassword = (timestamp: string): string => {
  return Buffer.from(`${SHORTCODE}${PASSKEY}${timestamp}`).toString("base64");
};

// Initiate STK push
export const initiateSTKPush = async (
  phoneNumber: string,
  amount: number,
  accountReference: string = "GENERAL"
): Promise<any> => {
  const accessToken = await getAccessToken();
  const timestamp = new Date().toISOString().replace(/[^0-9]/g, "").slice(0, -3);
  const password = generatePassword(timestamp);

  const response = await axios.post(
    `${MPESA_BASE_URL}/mpesa/stkpush/v1/processrequest`,
    {
      BusinessShortCode: SHORTCODE,
      Password: password,
      Timestamp: timestamp,
      TransactionType: "CustomerPayBillOnline",
      Amount: amount,
      PartyA: phoneNumber,
      PartyB: SHORTCODE,
      PhoneNumber: phoneNumber,
      CallBackURL: "https://medical-appointment-patient-management.onrender.com/api/mpesa/callback",
      AccountReference: accountReference,
      TransactionDesc: "Payment for Service",
    },
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );

  return response.data;
};

// Generate QR Code
export const generateQRCode = async (
  amount: number,
  accountReference: string,
  transactionDesc: string
): Promise<any> => {
  const accessToken = await getAccessToken();
  const response = await axios.post(
    `${MPESA_BASE_URL}/mpesa/qrcode/v1/generate`,
    { ShortCode: SHORTCODE, Amount: amount, AccountReference: accountReference, TransactionDesc: transactionDesc },
    { headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" } }
  );
  console.log("Saving payment:", response.data);
  return response.data;
};


// Insert payment (used by callback)
export const createMpesaPaymentService = async (payment: TPaymentInsert): Promise<string> => {
  await db.insert(paymentsTable).values(payment);
  return "M-Pesa payment recorded successfully 💰";
};
