import { z } from "zod";

export const DoctorValidator = z.object({
  doctorId: z.number().optional(),
  specialization: z.string().trim().min(2, "Specialization is required"),
  bio: z.string().optional(),
  availableDays:z.string().nonempty("Include your available days"),
  userId: z.number().nonnegative("UserId should be positive")
});
