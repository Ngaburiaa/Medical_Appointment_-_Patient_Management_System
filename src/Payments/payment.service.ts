import { eq } from "drizzle-orm";
import { db } from "../drizzle/db";
import { TPaymentInsert, TPaymentSelect, paymentsTable } from "../drizzle/schema";

// Get all payments
export const getPaymentsServices = async (): Promise<TPaymentSelect[] | null> => {
  return await db.query.paymentsTable.findMany({
    with: {
      appointment: true,
    },
  });
};

// Get payment by ID
export const getPaymentByIdServices = async (paymentId: number): Promise<TPaymentSelect | undefined> => {
  return await db.query.paymentsTable.findFirst({
    where: eq(paymentsTable.paymentId, paymentId),
    with: {
      appointment: true,
    },
  });
};

// Create payment
export const createPaymentServices = async (payment: TPaymentInsert): Promise<string> => {
  await db.insert(paymentsTable).values(payment);
  return "Payment recorded successfully 💰";
};

// Update payment
export const updatePaymentServices = async (paymentId: number, payment: Partial<TPaymentInsert>): Promise<string> => {
  await db.update(paymentsTable).set(payment).where(eq(paymentsTable.paymentId, paymentId));
  return "Payment updated successfully 😎";
};

// Delete payment
export const deletePaymentServices = async (paymentId: number): Promise<string> => {
  await db.delete(paymentsTable).where(eq(paymentsTable.paymentId, paymentId));
  return "Payment deleted successfully 🎉";
};
