import { z } from "zod";

export const DoctorValidator = z.object({
  doctorId: z.number().optional(),
  firstName: z.string().trim().min(2, "First name is required"),
  lastName: z.string().trim().min(2, "Last name is required"),
  email: z.string().email().trim().nonempty("Email is required"),
  specialization: z.string().trim().min(2, "Specialization is required"),
  contactPhone: z.string().trim().min(1, "Phone number is required"),
  address: z.string().trim().min(1, "Address is required"),
  bio: z.string().optional(),
});
