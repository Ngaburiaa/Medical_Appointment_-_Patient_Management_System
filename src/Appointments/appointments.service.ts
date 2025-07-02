import { eq } from "drizzle-orm";
import { db } from "../drizzle/db";
import { TAppointmentInsert, TAppointmentSelect, appointmentsTable } from "../drizzle/schema";

// Get all appointments
export const getAppointmentsServices = async (): Promise<TAppointmentSelect[] | null> => {
  return await db.query.appointmentsTable.findMany({
    with: {
      user: true,
      doctor: true,
      prescription: true,
      payments: true,
      complaints: true,
    },
  });
};

// Get appointment by ID
export const getAppointmentByIdServices = async (appointmentId: number): Promise<TAppointmentSelect | undefined> => {
  return await db.query.appointmentsTable.findFirst({
    where: eq(appointmentsTable.appointmentId, appointmentId),
    with: {
      user: true,
      doctor: true,
      prescription: true,
      payments: true,
      complaints: true,
    },
  });
};

// Create appointment
export const createAppointmentServices = async (appointment: TAppointmentInsert): Promise<string> => {
  await db.insert(appointmentsTable).values(appointment).returning();
  return "Appointment created successfully 🎉";
};

// Update appointment
export const updateAppointmentServices = async (appointmentId: number, appointment: Partial<TAppointmentInsert>): Promise<string> => {
  await db.update(appointmentsTable).set(appointment).where(eq(appointmentsTable.appointmentId, appointmentId));
  return "Appointment updated successfully 😎";
};

// Delete appointment
export const deleteAppointmentServices = async (appointmentId: number): Promise<string> => {
  await db.delete(appointmentsTable).where(eq(appointmentsTable.appointmentId, appointmentId));
  return "Appointment deleted successfully 🎉";
};
