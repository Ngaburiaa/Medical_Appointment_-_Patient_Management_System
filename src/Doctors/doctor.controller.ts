import { Request, Response } from "express";
import {
  createDoctorServices,
  deleteDoctorServices,
  getDoctorByIdServices,
  getDoctorsServices,
  updateDoctorServices,
} from "../Doctors/doctor.service";
import { DoctorValidator } from "../validation/doctors.validator";
import { doctorsTable } from "../drizzle/schema";
import { db } from "../drizzle/db";
import { eq } from "drizzle-orm";

// Get all doctors
export const getDoctors = async (req: Request, res: Response) => {
  try {
    const allDoctors = await getDoctorsServices();
    if (!allDoctors || allDoctors.length === 0) {
       res.status(404).json({ message: "No doctors found" });
    }
     res.status(200).json(allDoctors);
  } catch (error: any) {
     res.status(500).json({ error: error.message || "Failed to fetch doctors" });
  }
};

// Get doctor by ID
export const getDoctorById = async (req: Request, res: Response) => {
  const doctorId = parseInt(req.params.id);
  if (isNaN(doctorId)) {
     res.status(400).json({ error: "Invalid doctor ID" });
  }
  try {
    const doctor = await getDoctorByIdServices(doctorId);
    if (!doctor) {
       res.status(404).json({ message: "Doctor not found" });
    }
     res.status(200).json(doctor);
  } catch (error: any) {
     res.status(500).json({ error: error.message || "Failed to fetch doctor" });
  }
};

// Create new doctor
export const createDoctor = async (req: Request, res: Response) => {
  const {specialization,bio, availableDays, userId } = req.body;
  if (!specialization || !availableDays || !userId || !bio) {
     res.status(400).json({ error: "All fields are required" });
  }

  try {
    const parseResult=DoctorValidator.safeParse(req.body)
   
       if(!parseResult.success){
           res.status(400).json({error:parseResult.error.issues})   
           return
        }
    const message = await createDoctorServices({ specialization,bio, availableDays, userId, });
     res.status(201).json({ message });
  } catch (error: any) {
     res.status(500).json({ error: error.message || "Failed to create doctor" });
  }
};

// Update doctor with partial update support
export const updateDoctor = async (req: Request, res: Response) => {
  const doctorId = parseInt(req.params.id);
  if (isNaN(doctorId)) {
     res.status(400).json({ error: "Invalid doctor ID" });
  }

  const {bio, specialization, availableDays } = req.body;

  if (
    
    !bio &&
    !specialization &&
    !availableDays
  ) {
     res.status(400).json({ error: "At least one field must be provided to update" });
  }

  try {
    const message = await updateDoctorServices(doctorId, {
     
      ...(bio && { bio }),
      ...(specialization && { specialization }),
      ...(availableDays && { availableDays }),
    });
     res.status(200).json({ message });
  } catch (error: any) {
     res.status(500).json({ error: error.message || "Failed to update doctor" });
  }
};

// Delete doctor
export const deleteDoctor = async (req: Request, res: Response) => {
  const doctorId = parseInt(req.params.id);
  if (isNaN(doctorId)) {
     res.status(400).json({ error: "Invalid doctor ID" });
  }

  try {
    const message = await deleteDoctorServices(doctorId);
     res.status(200).json({ message });
  } catch (error: any) {
     res.status(500).json({ error: error.message || "Failed to delete doctor" });
  }
};
