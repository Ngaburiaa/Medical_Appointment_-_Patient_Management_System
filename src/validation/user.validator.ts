import { z } from "zod/v4";

export const UserValidator = z.object({
  userId: z.number().optional(),
  email: z.email().trim().nonempty(),
  firstName: z.string().min(5).max(100).trim(),
  address:z.string().nonempty().min(1).trim(),
    lastName: z.string().min(5).max(100).trim(),
  password: z.string().min(4).max(100).trim(),
  contactPhone: z.string().nonempty("Phone number is required"),
    userType: z.enum(["admin", "user", "doctor"]).optional()
});

export const UserLoginValidator = z.object({
  email: z.email().trim(),
  password: z.string().min(4).max(100).trim(),
});
