
import { Request, Response } from "express";
import { initiateSTKPush, generateQRCode, createMpesaPaymentService } from "./mpesa.service";

// Initiate Payment (STK Push)
export const initiatePayment = async (req: Request, res: Response) => {
  try {
    const { phoneNumber, amount, appointmentId } = req.body;

    if (!phoneNumber || !amount || !appointmentId) {
     res.status(400).json({ error: "Phone number, amount, and appointmentId are required" });
    }

    const result = await initiateSTKPush(phoneNumber, amount, appointmentId.toString());
    res.status(200).json(result);
  } catch (error: any) {
    console.error("STK Push Error:", error);
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
     res.status(400).json({ error: "Amount, accountReference, and transactionDesc are required" });
    }

    const result = await generateQRCode(amount, accountReference, transactionDesc);
     res.status(200).json(result);
  } catch (error: any) {
    console.error("QR Code Error:", error);
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

    // Validate callback structure
    if (!req.body.Body?.stkCallback) {
      console.error("Invalid callback structure");
      res.status(400).json({ error: "Invalid callback structure" });
    }

    const callback = req.body.Body.stkCallback;
    const { MerchantRequestID, CheckoutRequestID, ResultCode, ResultDesc, CallbackMetadata } = callback;

    // Validate required fields
    if (!CallbackMetadata?.Item) {
      console.error("Missing callback metadata");
     res.status(400).json({ error: "Missing payment details in callback" });
    }

    // Extract metadata
    const metadata: Record<string, any> = {};
    CallbackMetadata.Item.forEach((item: any) => {
      metadata[item.Name] = item.Value;
    });

    // Check for minimum required fields
    if (!metadata.Amount || !metadata.MpesaReceiptNumber) {
      console.error("Missing required payment details:", metadata);
      res.status(400).json({ error: "Missing required payment details" });
    }

    // Try to get appointmentId from different possible sources
    let appointmentId: number | null = null;
    
    // 1. First try AccountReference from metadata
    if (metadata.AccountReference) {
      appointmentId = Number(metadata.AccountReference);
    }
    // 2. Fallback to CheckoutRequestID (extract appointmentId if encoded)
    else if (CheckoutRequestID) {
      // Example: CheckoutRequestID format "ws_CO_290720251305258769846063_123" where 123 is appointmentId
      const parts = CheckoutRequestID.split('_');
      if (parts.length > 2) {
        const possibleId = parts[parts.length - 1];
        appointmentId = Number(possibleId);
      }
    }

    if (!appointmentId || isNaN(appointmentId)) {
      console.error("Could not determine appointmentId from callback");
      res.status(400).json({ 
        error: "Could not determine appointment reference",
        details: {
          metadata,
          CheckoutRequestID
        }
      });
    }

    const amount = metadata.Amount;
    const mpesaReceipt = metadata.MpesaReceiptNumber;
    const phone = metadata.PhoneNumber?.toString() || "";

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
      appointmentId,
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
    if (!res.headersSent) {
     res.status(500).json({ error: "Failed to process callback" });
    }
  }
};