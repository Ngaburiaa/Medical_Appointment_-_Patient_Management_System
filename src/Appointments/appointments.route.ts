import { Router } from "express";
import { createAppointment, deleteAppointment, getAppointmentById, getAppointments, updateAppointment } from "./appointments.controller";
import { allRolesAuth, bothRolesAuth,adminRoleAuth } from "../middleware/bearAuth";

export const appointmentRouter = Router();

// Get all appointments
appointmentRouter.get('/appointments', getAppointments);

// Get appointment by ID
appointmentRouter.get('/appointments/:id',allRolesAuth, getAppointmentById);

// Create a new appointment
appointmentRouter.post('/appointments',allRolesAuth, createAppointment);

// Update an existing appointment
appointmentRouter.put('/appointments/:id',allRolesAuth,updateAppointment);

// Delete an existing appointment
appointmentRouter.delete('/appointments/:id',bothRolesAuth,deleteAppointment);