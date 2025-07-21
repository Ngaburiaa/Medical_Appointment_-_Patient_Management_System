import { eq } from "drizzle-orm";
import db from "../drizzle/db";
import {
  TPrescriptionItemInsert,
  TPrescriptionItemSelect,
  prescriptionItemsTable,
} from "../drizzle/schema";

// Get all prescription items
export const getPrescriptionItemsServices = async (): Promise<TPrescriptionItemSelect[] | null> => {
  return await db.query.prescriptionItemsTable.findMany({
    with: {
      prescription: true,
    },
  });
};

// Get items by prescription ID
export const getPrescriptionItemsByPrescriptionIdServices = async (
  prescriptionId: number
): Promise<TPrescriptionItemSelect[] | null> => {
  return await db.query.prescriptionItemsTable.findMany({
    where: eq(prescriptionItemsTable.prescriptionId, prescriptionId),
    with: {
      prescription: true,
    },
  });
};

// Get item by item ID
export const getPrescriptionItemByIdServices = async (
  itemId: number
): Promise<TPrescriptionItemSelect | undefined> => {
  return await db.query.prescriptionItemsTable.findFirst({
    where: eq(prescriptionItemsTable.itemId, itemId),
    with: {
      prescription: true,
    },
  });
};

// Create a prescription item
export const createPrescriptionItemServices = async (
  item: TPrescriptionItemInsert
): Promise<string> => {
  await db.insert(prescriptionItemsTable).values(item);
  return "Prescription item created successfully ✅";
};

// Update a prescription item
export const updatePrescriptionItemServices = async (
  itemId: number,
  item: Partial<TPrescriptionItemInsert>
): Promise<string> => {
  await db
    .update(prescriptionItemsTable)
    .set(item)
    .where(eq(prescriptionItemsTable.itemId, itemId));
  return "Prescription item updated successfully ✏️";
};

// Delete a prescription item
export const deletePrescriptionItemServices = async (
  itemId: number
): Promise<string> => {
  await db.delete(prescriptionItemsTable).where(eq(prescriptionItemsTable.itemId, itemId));
  return "Prescription item deleted successfully 🗑️";
};
