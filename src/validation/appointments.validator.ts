import { z } from "zod";


export const AppointmentStatusEnum = z.enum(["Pending", "Confirmed", "Completed", "Cancelled"]);

export const AppointmentValidator = z.object({
  appointmentId: z.number().optional(),

  userId: z.number({required_error: "User ID is required" }).int().positive(),
  doctorId: z.number({required_error: "Doctor ID is required"}).int().positive(),
  appointmentDate: z.string().refine((val) => !isNaN(Date.parse(val)), { message: "Appointment date must be a valid date",
  }),
  timeSlot: z.string().trim().min(1, "Time slot is required"),  totalAmount: z.string().refine(val => /^\d+(\.\d{1,2})?$/.test(val), {
      message: "Total amount must be a valid decimal number with up to 2 decimal places"
    })
    .optional(),
  appointmentStatus: AppointmentStatusEnum.default("Pending"),
 
});
