import axios from "axios";
import db from "../drizzle/db";
import { appointmentsTable, paymentsTable, TPaymentInsert } from "../drizzle/schema";
import { eq } from "drizzle-orm";

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
  appointmentId: string
): Promise<any> => {
  if (!appointmentId) throw new Error("Appointment ID is required");

  const accessToken = await getAccessToken();
  const timestamp = new Date().toISOString().replace(/[^0-9]/g, "").slice(0, -3);
  const password = generatePassword(timestamp);

  // Encode appointmentId in CheckoutRequestID for fallback
  const checkoutRequestId = `ws_CO_${timestamp}_${appointmentId}`;

  const response = await axios.post(
    `${MPESA_BASE_URL}/mpesa/stkpush/v1/processrequest`,
    {
      BusinessShortCode: SHORTCODE,
      Password: password,
      Timestamp: timestamp,
      TransactionType: "CustomerPayBillOnline",
      Amount: Math.round(amount),
      PartyA: phoneNumber,
      PartyB: SHORTCODE,
      PhoneNumber: phoneNumber,
      CallBackURL: "https://yourdomain.com/api/mpesa/callback",
      AccountReference: appointmentId, // Primary reference
      TransactionDesc: `Payment for appointment ${appointmentId}`,
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
    { 
      ShortCode: SHORTCODE, 
      Amount: amount, 
      AccountReference: accountReference.toString(), // Ensure string value
      TransactionDesc: transactionDesc 
    },
    { headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" } }
  );
  return response.data;
};

export const createMpesaPaymentService = async (payment: TPaymentInsert): Promise<string> => {
  return await db.transaction(async (tx) => {
    const appointmentId = Number(payment.appointmentId);

    if (!appointmentId || isNaN(appointmentId) || appointmentId <= 0) {
      throw new Error(`Invalid appointmentId: ${payment.appointmentId}`);
    }

    console.log(`Recording payment for appointment ${appointmentId}:`, payment);

    // 1. Save payment
    await tx.insert(paymentsTable).values({ 
      ...payment, 
      appointmentId,
      amount: payment.amount.toString() // Ensure amount is stored as string
    });

    // 2. If successful payment, update appointment status
    if (payment.paymentStatus === "SUCCESS") {
      await tx
        .update(appointmentsTable)
        .set({ appointmentStatus: "Confirmed" })
        .where(eq(appointmentsTable.appointmentId, appointmentId));
      console.log(`Appointment ${appointmentId} marked as Confirmed`);
    }

    return "M-Pesa payment recorded successfully";
  });
};