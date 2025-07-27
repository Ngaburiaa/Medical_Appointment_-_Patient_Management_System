import { eq } from "drizzle-orm";
import db from "../drizzle/db";
import { TAppointmentInsert, TAppointmentSelect, appointmentsTable } from "../drizzle/schema";
import { CustomError } from "./utils/error";

export const getAppointmentsServices = async (): Promise<TAppointmentSelect[]> => {
  try {
    const appointments = await db.query.appointmentsTable.findMany({
      with: {
        doctor: { with: { user: true } },
        user: true,
        payments: true,
        prescription: { 
          with: { 
            items: true,
            patient: true,
            doctor: { with: { user: true } },
            appointment: true,
          } 
        },
      },
    });
    return appointments || [];
  } catch (error) {
    throw new CustomError('Failed to fetch appointments', 500);
  }
};

export const getAppointmentByIdServices = async (appointmentId: number): Promise<TAppointmentSelect> => {
  try {
    const appointment = await db.query.appointmentsTable.findFirst({
      where: eq(appointmentsTable.appointmentId, appointmentId),
      with: {
        doctor: { with: { user: true } },
        user: true,
        payments: true,
        prescription: { 
          with: { 
            items: true,
            patient: true,
            doctor: { with: { user: true } },
            appointment: true,
          } 
        },
      },
    });
    if (!appointment) throw new CustomError('Appointment not found', 404);
    return appointment;
  } catch (error) {
    throw error instanceof CustomError ? error : new CustomError('Failed to fetch appointment', 500);
  }
};

export const createAppointmentServices = async (data: {
  userId: number;
  doctorId: number;
  timeSlot: string;
  totalAmount: string;
  appointmentDate: string;
}): Promise<{ appointmentId: number; totalAmount: string }> => {
  const [newAppointment] = await db
    .insert(appointmentsTable)
    .values(data)
    .returning({
      appointmentId: appointmentsTable.appointmentId,
      totalAmount: appointmentsTable.totalAmount,
    });

    console.log(newAppointment)

  return {
    appointmentId: newAppointment.appointmentId,
    totalAmount: newAppointment.totalAmount ?? "0.00",
  };
};




export const updateAppointmentServices = async (
  appointmentId: number, 
  appointment: Partial<TAppointmentInsert>
): Promise<string> => {
  try {
    await db.update(appointmentsTable)
      .set(appointment)
      .where(eq(appointmentsTable.appointmentId, appointmentId));
    return 'Appointment updated successfully';
  } catch (error) {
    throw new CustomError('Failed to update appointment', 500);
  }
};

export const deleteAppointmentServices = async (appointmentId: number): Promise<string> => {
  try {
    await db.delete(appointmentsTable)
      .where(eq(appointmentsTable.appointmentId, appointmentId));
    return 'Appointment deleted successfully';
  } catch (error) {
    throw new CustomError('Failed to delete appointment', 500);
  }
};