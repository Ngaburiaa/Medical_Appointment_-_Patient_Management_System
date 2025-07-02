import { eq } from "drizzle-orm";
import { db } from "../drizzle/db";
import { TComplaintInsert, TComplaintSelect, complaintsTable } from "../drizzle/schema";

// Get all complaints
export const getComplaintsServices = async (): Promise<TComplaintSelect[] | null> => {
  return await db.query.complaintsTable.findMany({
    with: {
      user: true,
      appointment: true,
    },
  });
};

// Get complaint by ID
export const getComplaintByIdServices = async (complaintId: number): Promise<TComplaintSelect | undefined> => {
  return await db.query.complaintsTable.findFirst({
    where: eq(complaintsTable.complaintId, complaintId),
    with: {
      user: true,
      appointment: true,
    },
  });
};

// Create complaint
export const createComplaintServices = async (complaint: TComplaintInsert): Promise<string> => {
  await db.insert(complaintsTable).values(complaint);
  return "Complaint submitted successfully 📩";
};

// Update complaint
export const updateComplaintServices = async (complaintId: number, complaint: Partial<TComplaintInsert>): Promise<string> => {
  await db.update(complaintsTable).set(complaint).where(eq(complaintsTable.complaintId, complaintId));
  return "Complaint updated successfully 🛠️";
};

// Delete complaint
export const deleteComplaintServices = async (complaintId: number): Promise<string> => {
  await db.delete(complaintsTable).where(eq(complaintsTable.complaintId, complaintId));
  return "Complaint deleted successfully 🎉";
};
