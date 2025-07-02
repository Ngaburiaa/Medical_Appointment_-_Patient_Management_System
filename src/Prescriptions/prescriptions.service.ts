import { eq } from "drizzle-orm";
import { db } from "../drizzle/db";
import { TPrescriptionInsert, TPrescriptionSelect, prescriptionsTable } from "../drizzle/schema";

// Get all prescriptions
export const getPrescriptionsServices = async (): Promise<TPrescriptionSelect[] | null> => {
  return await db.query.prescriptionsTable.findMany({
    with: {
      appointment: true,
      doctor: true,
      patient: true,
    },
  });
};

// Get prescription by ID
export const getPrescriptionByIdServices = async (prescriptionId: number): Promise<TPrescriptionSelect | undefined> => {
  return await db.query.prescriptionsTable.findFirst({
    where: eq(prescriptionsTable.prescriptionId, prescriptionId),
    with: {
      appointment: true,
      doctor: true,
      patient: true,
    },
  });
};

// Create prescription
export const createPrescriptionServices = async (prescription: TPrescriptionInsert): Promise<string> => {
  await db.insert(prescriptionsTable).values(prescription);
  return "Prescription created successfully 🎉";
};

// Update prescription
export const updatePrescriptionServices = async (prescriptionId: number, prescription: Partial<TPrescriptionInsert>): Promise<string> => {
  await db.update(prescriptionsTable).set(prescription).where(eq(prescriptionsTable.prescriptionId, prescriptionId));
  return "Prescription updated successfully 😎";
};

// Delete prescription
export const deletePrescriptionServices = async (prescriptionId: number): Promise<string> => {
  await db.delete(prescriptionsTable).where(eq(prescriptionsTable.prescriptionId, prescriptionId));
  return "Prescription deleted successfully 🎉";
};
