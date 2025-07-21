
import { eq } from "drizzle-orm";
import db from "../drizzle/db";
import { TDoctorInsert, TDoctorSelect, doctorsTable } from "../drizzle/schema";

export const getDoctorsServices = async (): Promise<TDoctorSelect[] | null> => {
  return await db.query.doctorsTable.findMany({
    with: {
      user: true, // doctor → user info

      appointments: {
        with: {
          user: true,              // patient info
          payments: true,          // payment status/amount
        },
      },

      prescriptions: {
        with: {
          patient: true,           // patient info
          doctor: {
            with: {
              user: true,          // doctor user info
            },
          },
          appointment: true,       // appointment details
          items: true,             // drugs prescribed
        },
      },
    },
  });
};


//Get doctor by ID
export const getDoctorByIdServices = async(doctorId: number):Promise<TDoctorSelect | undefined> => {
    return await db.query.doctorsTable.findFirst({
    where: eq(doctorsTable.doctorId, doctorId),
    with: {
      user: true, // doctor → user info

      appointments: {
        with: {
          user: true,              // patient info
          payments: true,          // payment status/amount
        },
      },

      prescriptions: {
        with: {
          patient: true,           // patient info
          doctor: {
            with: {
              user: true,          // doctor user info
            },
          },
          appointment: true,       // appointment details
          items: true,             // drugs prescribed
        },
      },
    },
  });
}

// Create a new doctor
export const createDoctorServices = async(doctor: TDoctorInsert):Promise<string> => {
    await db.insert(doctorsTable).values(doctor).returning();
    return "Doctor created successfully 🎉";
}

// Update an existing doctor
export const updateDoctorServices = async(doctorId: number, doctor: Partial<TDoctorInsert>):Promise<string> => {
    await db.update(doctorsTable).set(doctor).where(eq(doctorsTable.doctorId, doctorId));
    return "Doctor updated successfully 😎";
}


// Delete a doctor

export const deleteDoctorServices = async(doctorId: number):Promise<string> => {
  await db.delete(doctorsTable).where(eq(doctorsTable.doctorId, doctorId));
  return "Doctor deleted successfully 🎉"
}