import { Request, Response } from "express";
import {
  createPaymentServices,
  deletePaymentServices,
  getPaymentByIdServices,
  getPaymentsServices,
  updatePaymentServices,
} from "../Payments/payment.service";
import { PaymentValidator } from "../validation/payment.validator";

// Get all payments
export const getPayments = async (req: Request, res: Response) => {
  try {
    const payments = await getPaymentsServices();
    if (!payments || payments.length === 0) {
       res.status(404).json({ message: "No payments found" });
    }
    res.status(200).json(payments);
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to fetch payments" });
  }
};

// Get payment by ID
export const getPaymentById = async (req: Request, res: Response) => {
  const paymentId = parseInt(req.params.id);
  if (isNaN(paymentId)) {
     res.status(400).json({ error: "Invalid payment ID" });
  }

  try {
    const payment = await getPaymentByIdServices(paymentId);
    if (!payment) {
       res.status(404).json({ message: "Payment not found" });
    }
    res.status(200).json(payment);
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to fetch payment" });
  }
};

// Create payment
export const createPayment = async (req: Request, res: Response) => {
  const { appointmentId, amount, paymentStatus, transactionId, paymentDate } = req.body;

  if (!appointmentId || !amount || !paymentStatus || !transactionId || !paymentDate) {
     res.status(400).json({ error: "All fields are required" });
  }

  try {
     const parseResult=PaymentValidator.safeParse(req.body)
    
        if(!parseResult.success){
            res.status(400).json({error:parseResult.error.issues})   
            return
         }
    const message = await createPaymentServices({
      appointmentId,
      amount,
      paymentStatus,
      transactionId,
      paymentDate:  new Date(paymentDate).toISOString(),
    });
    res.status(201).json({ message });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to create payment" });
  }
};

// Update payment
export const updatePayment = async (req: Request, res: Response) => {
  const paymentId = parseInt(req.params.id);
  if (isNaN(paymentId)) {
     res.status(400).json({ error: "Invalid payment ID" });
  }

  const { appointmentId, amount, paymentStatus, transactionId, paymentDate } = req.body;

  if (!appointmentId && !amount && !paymentStatus && !transactionId && !paymentDate) {
     res.status(400).json({ error: "At least one field must be provided to update" });
  }

  try {
    const message = await updatePaymentServices(paymentId, {
      ...(appointmentId && { appointmentId }),
      ...(amount && { amount }),
      ...(paymentStatus && { paymentStatus }),
      ...(transactionId && { transactionId }),
      ...(paymentDate && { paymentDate: new Date(paymentDate) }),
    });
    res.status(200).json({ message });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to update payment" });
  }
};

// Delete payment
export const deletePayment = async (req: Request, res: Response) => {
  const paymentId = parseInt(req.params.id);
  if (isNaN(paymentId)) {
     res.status(400).json({ error: "Invalid payment ID" });
  }

  try {
    const message = await deletePaymentServices(paymentId);
    res.status(200).json({ message });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to delete payment" });
  }
};
