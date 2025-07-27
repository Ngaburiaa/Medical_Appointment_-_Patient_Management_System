import { Request, Response } from "express";
import {
  createAppointmentServices,
  deleteAppointmentServices,
  getAppointmentByIdServices,
  getAppointmentsServices,
  updateAppointmentServices,
} from "../Appointments/appointments.service";
import { AppointmentValidator } from "../validation/appointments.validator";

// Get all appointments
export const getAppointments = async (req: Request, res: Response) => {
  try {
    const appointments = await getAppointmentsServices();
    if (!appointments || appointments.length === 0) {
       res.status(404).json({ message: "No appointments found" });
    }
    res.status(200).json(appointments);
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to fetch appointments" });
  }
};

// Get appointment by ID
export const getAppointmentById = async (req: Request, res: Response) => {
  const appointmentId = parseInt(req.params.id);
  if (isNaN(appointmentId)) {
     res.status(400).json({ error: "Invalid appointment ID" });
  }

  try {
    const appointment = await getAppointmentByIdServices(appointmentId);
    if (!appointment) {
       res.status(404).json({ message: "Appointment not found" });
    }
    res.status(200).json(appointment);
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to fetch appointment" });
  }
};

// Create appointment
export const createAppointment = async (req: Request, res: Response) => {
  const { userId, doctorId, timeSlot, totalAmount, appointmentDate } = req.body;

  if (!userId || !doctorId || !timeSlot || !totalAmount || !appointmentDate) {
    res.status(400).json({ error: "Required fields are missing" });
  }

  try {
    const parseResult = AppointmentValidator.safeParse(req.body);
    if (!parseResult.success) {
      res.status(400).json({ error: parseResult.error.issues });
    }

    // Create appointment (only returns appointmentId & totalAmount)
    const newAppointment = await createAppointmentServices({
      userId,
      doctorId,
      timeSlot,
      totalAmount,
      appointmentDate,
    });

   
    res.status(201).json({
      message: "Appointment created successfully 🎉",
      appointment: {
        appointmentId: newAppointment.appointmentId,
        totalAmount: newAppointment.totalAmount ?? "0.00",
      },
    });
  } catch (error: any) {
     res.status(500).json({
      error: error.message || "Failed to create appointment",
    });
  }
};



// Update appointment
export const updateAppointment = async (req: Request, res: Response) => {
  const appointmentId = parseInt(req.params.id);
  if (isNaN(appointmentId)) {
     res.status(400).json({ error: "Invalid appointment ID" });
  }

  const { userId, doctorId, appointmentDate, timeSlot, totalAmount, appointmentStatus } = req.body;

  if (!userId && !doctorId && !appointmentDate && !timeSlot && !totalAmount && !appointmentStatus) {
     res.status(400).json({ error: "At least one field must be provided to update" });
  }

  try {
    const message = await updateAppointmentServices(appointmentId, {
      ...(userId && { userId }),
      ...(doctorId && { doctorId }),
      ...(appointmentDate && { appointmentDate }),
      ...(timeSlot && { timeSlot }),
      ...(totalAmount && { totalAmount }),
      ...(appointmentStatus && { appointmentStatus }),
    });
    res.status(200).json({ message });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to update appointment" });
  }
};

// Delete appointment
export const deleteAppointment = async (req: Request, res: Response) => {
  const appointmentId = parseInt(req.params.id);
  if (isNaN(appointmentId)) {
     res.status(400).json({ error: "Invalid appointment ID" });
  }

  try {
    const message = await deleteAppointmentServices(appointmentId);
    res.status(200).json({ message });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to delete appointment" });
  }
};
