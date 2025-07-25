import { Request, Response } from "express";
import { initiateSTKPush, generateQRCode, createMpesaPaymentService } from "./mpesa.service";

// Initiate Payment (STK Push)
export const initiatePayment = async (req: Request, res: Response) => {
  try {
    const { phoneNumber, amount, appointmentId } = req.body;
    if (!phoneNumber || !amount) {
       res.status(400).json({ error: "Phone number and amount are required" });
       return;
    }
    const result = await initiateSTKPush(phoneNumber, amount, appointmentId?.toString() || "GENERAL");
    res.status(200).json(result);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({
      error: "Failed to initiate payment",
      details: error.response?.data || error.message,
    });
  }
};

// Generate QR Code
export const createQRCode = async (req: Request, res: Response) => {
  try {
    const { amount, accountReference, transactionDesc } = req.body;
    if (!amount || !accountReference || !transactionDesc) {
     res.status(400).json({ error: "All fields are required" });
     return;
    }
    const result = await generateQRCode(amount, accountReference, transactionDesc);
    res.status(200).json(result);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({
      error: "Failed to generate QR code",
      details: error.response?.data || error.message,
    });
  }
};

// M-Pesa Callback
export const mpesaCallback = async (req: Request, res: Response) => {
  try {
    console.log("M-Pesa Callback Received:", JSON.stringify(req.body, null, 2));
    const callback = req.body.Body.stkCallback;
    const { MerchantRequestID, CheckoutRequestID, ResultCode, ResultDesc, CallbackMetadata } = callback;

    // Extract metadata
    const metadata: Record<string, any> = {};
    CallbackMetadata?.Item?.forEach((item: any) => {
      metadata[item.Name] = item.Value;
    });

    const amount = metadata.Amount || 0;
    const mpesaReceipt = metadata.MpesaReceiptNumber || "";
    const phone = metadata.PhoneNumber?.toString() || "";
    const accountRef = metadata.AccountReference || null;
    const transactionDate = metadata.TransactionDate
      ? new Date(
          `${metadata.TransactionDate.toString().slice(0, 4)}-${metadata.TransactionDate
            .toString()
            .slice(4, 6)}-${metadata.TransactionDate.toString().slice(6, 8)}T${metadata.TransactionDate
            .toString()
            .slice(8, 10)}:${metadata.TransactionDate.toString().slice(10, 12)}:${metadata.TransactionDate
            .toString()
            .slice(12, 14)}`
        )
      : new Date();

    // Save payment
    await createMpesaPaymentService({
      appointmentId: accountRef ? parseInt(accountRef) : 5, 
      amount,
      paymentStatus: ResultCode === 0 ? "SUCCESS" : "FAILED",
      transactionId: mpesaReceipt,
      checkoutRequestId: CheckoutRequestID,
      merchantRequestId: MerchantRequestID,
      payerPhone: phone,
      resultCode: ResultCode,
      resultDesc: ResultDesc,
      paymentDate: transactionDate.toISOString().split("T")[0],
    });

    res.json({ message: "Callback processed successfully" });
  } catch (error: any) {
    console.error("M-Pesa callback error:", error);
    res.status(500).json({ error: "Failed to process callback" });
  }
};
