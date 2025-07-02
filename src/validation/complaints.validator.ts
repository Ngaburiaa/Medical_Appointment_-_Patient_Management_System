import { z } from "zod";

export const ComplaintStatusEnum = z.enum(["Open", "In Progress", "Resolved", "Closed"]);
export const ComplaintValidator = z.object({
  complaintId: z.number().optional(),
  userId: z.number().int().min(1, "User ID is required"),
  relatedAppointmentId: z.number().int().optional(),
  subject: z.string().trim().min(1, "Subject is required"),
  description: z.string().trim().min(1, "Description is required"),
  status: ComplaintStatusEnum.default("Open"),
  });
