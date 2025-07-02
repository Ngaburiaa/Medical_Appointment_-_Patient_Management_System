import { z } from "zod";

export const PaymentValidator = z.object({
  paymentId: z.number().optional(),
  appointmentId: z.number().int().min(1, "Appointment ID is required"),
  amount: z.string().refine(val => /^\d+(\.\d{1,2})?$/.test(val), {
    message: "Amount must be a valid decimal with up to 2 decimal places",
  }),
  paymentStatus: z.string().trim().min(1, "Payment status is required"),
  transactionId: z.string().trim().min(1, "Transaction ID is required"),
  paymentDate: z.string().refine(val => !isNaN(Date.parse(val)), {
    message: "Payment date must be a valid date",
  }),
});
