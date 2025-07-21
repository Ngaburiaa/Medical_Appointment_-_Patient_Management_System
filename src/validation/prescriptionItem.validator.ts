import { z } from "zod";

export const PrescriptionItemValidator = z.object({itemId: z.number().optional(),
  prescriptionId: z.number().int().min(1, "Prescription ID is required"),
  drugName: z.string().trim().min(1, "Drug name is required"),
  dosage: z.string().trim().min(1, "Dosage is required"),         // e.g., "500mg"
  route: z.string().trim().min(1, "Route of administration is required"), // e.g., "oral"
  frequency: z.string().trim().min(1, "Frequency is required"),   // e.g., "Twice a day"
  duration: z.string().trim().min(1, "Duration is required"),     // e.g., "7 days"
  instructions: z.string().trim().optional(),
  substitutionAllowed: z
    .number()
    .refine((val) => val === 0 || val === 1, {
      message: "Substitution allowed must be 0 (false) or 1 (true)",
    })
    .default(0),
});
