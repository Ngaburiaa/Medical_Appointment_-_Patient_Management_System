import { Router } from "express";
import { createPayment, deletePayment, getPaymentById, getPayments, updatePayment } from "./payment.controller";
import { allRolesAuth, bothRolesAuth,adminRoleAuth } from "../middleware/bearAuth";


export const paymentRouter = Router();


// Get all payments
paymentRouter.get('/payments',adminRoleAuth, getPayments);

// Get payment by ID
paymentRouter.get('/payments/:id',allRolesAuth, getPaymentById);

// Create a new payment
paymentRouter.post('/payments',allRolesAuth, createPayment);

// Update an existing payment
paymentRouter.put('/payments/:id',allRolesAuth,updatePayment);

// Delete an existing payment
paymentRouter.delete('/payments/:id',bothRolesAuth,deletePayment);