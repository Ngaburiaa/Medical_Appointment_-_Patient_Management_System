import { prescriptionItemsRouter } from './../PrescriptionItems/prescriptionItems.route';
import { eq } from "drizzle-orm";
import  db  from "../drizzle/db";
import { TPrescriptionInsert, TPrescriptionSelect, prescriptionsTable } from "../drizzle/schema";

// Get all prescriptions
// export const getPrescriptionsServices = async (): Promise<TPrescriptionSelect[] | null> => {
//   return await db.query.prescriptionsTable.findMany({
//     with: {
//       appointment: true,
//       doctor: true,
//       patient: true,
//       items: true,
      
//     },
//   });
// };

export const getPrescriptionsServices = async (): Promise<TPrescriptionSelect[] | null> => {
  return await db.query.prescriptionsTable.findMany({
    with: {
      appointment: true,
      doctor: {
        with: {
          user: true, // Doctor Name
        },
      },
      patient: true, // Patient Name
      items: true,   // Medication List
    },
  });
};


export const getPrescriptionByIdServices = async (
  prescriptionId: number
): Promise<TPrescriptionSelect | undefined> => {
  return await db.query.prescriptionsTable.findFirst({
    where: eq(prescriptionsTable.prescriptionId, prescriptionId),

    with: {
      appointment: true,
      doctor: {
        with: {
          user: true, 
        },
      },
      patient: true,      // Full patient details
      items: true,        // List of medication items
    },
  });
};


// Create prescription
export const createPrescriptionServices = async (
  prescription: TPrescriptionInsert
): Promise<{ prescriptionId: number }> => {
  const [newPrescription] = await db
    .insert(prescriptionsTable)
    .values(prescription)
    .returning({ prescriptionId: prescriptionsTable.prescriptionId }); // specify what to return

  return newPrescription; // returns { prescriptionId: number }
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

export const getPrescriptionsByUserIdService = async (
  userId: number
): Promise<TPrescriptionSelect[]> => {
  return await db.query.prescriptionsTable.findMany({
    where: eq(prescriptionsTable.patientId, userId),
    with: {
      appointment: true,
      doctor: {
        with: {
          user: true,
        },
      },
      patient: true,
      items: true,
    },
  });
};
