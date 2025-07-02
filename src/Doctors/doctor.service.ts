
import { eq } from "drizzle-orm";
import {db} from "../drizzle/db";
import { TDoctorInsert, TDoctorSelect, doctorsTable } from "../drizzle/schema";

//Get all doctors
export const getDoctorsServices = async():Promise<TDoctorSelect[] | null> => {
    return await db.query.doctorsTable.findMany({
    with: {
      appointments: true,
      prescriptions: true,
    },
  });
}

//Get doctor by ID
export const getDoctorByIdServices = async(doctorId: number):Promise<TDoctorSelect | undefined> => {
    return await db.query.doctorsTable.findFirst({
    where: eq(doctorsTable.doctorId, doctorId),
    with: {
      appointments: true,
      prescriptions: true,
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