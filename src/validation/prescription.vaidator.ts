import { z } from "zod";

export const PrescriptionValidator = z.object({
  prescriptionId: z.number().optional(),
  appointmentId: z.number().int().min(1, "Appointment ID is required"),
  doctorId: z.number().int().min(1, "Doctor ID is required"),
  patientId: z.number().int().min(1, "Patient ID is required"),
  notes: z.string().trim().optional(),
 });
