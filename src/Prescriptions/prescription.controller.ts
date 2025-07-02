import { Request, Response } from "express";
import {
  createPrescriptionServices,
  deletePrescriptionServices,
  getPrescriptionByIdServices,
  getPrescriptionsServices,
  updatePrescriptionServices,
} from "../Prescriptions/prescriptions.service";
import { PrescriptionValidator } from "../validation/prescription.vaidator";

// Get all prescriptions
export const getPrescriptions = async (req: Request, res: Response) => {
  try {
    const prescriptions = await getPrescriptionsServices();
    if (!prescriptions || prescriptions.length === 0) {
       res.status(404).json({ message: "No prescriptions found" });
    }
    res.status(200).json(prescriptions);
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to fetch prescriptions" });
  }
};

// Get prescription by ID
export const getPrescriptionById = async (req: Request, res: Response) => {
  const prescriptionId = parseInt(req.params.id);
  if (isNaN(prescriptionId)) {
     res.status(400).json({ error: "Invalid prescription ID" });
  }

  try {
    const prescription = await getPrescriptionByIdServices(prescriptionId);
    if (!prescription) {
       res.status(404).json({ message: "Prescription not found" });
    }
    res.status(200).json(prescription);
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to fetch prescription" });
  }
};

// Create prescription
export const createPrescription = async (req: Request, res: Response) => {
  const { appointmentId, doctorId, patientId, notes } = req.body;

  if (!appointmentId || !doctorId || !patientId) {
     res.status(400).json({ error: "appointmentId, doctorId, and patientId are required" });
  }

  try {
     const parseResult=PrescriptionValidator.safeParse(req.body)
    
        if(!parseResult.success){
            res.status(400).json({error:parseResult.error.issues})   
            return
         }
    const message = await createPrescriptionServices({
      appointmentId,
      doctorId,
      patientId,
      notes,
    });
    res.status(201).json({ message });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to create prescription" });
  }
};

// Update prescription
export const updatePrescription = async (req: Request, res: Response) => {
  const prescriptionId = parseInt(req.params.id);
  if (isNaN(prescriptionId)) {
     res.status(400).json({ error: "Invalid prescription ID" });
  }

  const { appointmentId, doctorId, patientId, notes } = req.body;

  if (!appointmentId && !doctorId && !patientId && !notes) {
     res.status(400).json({ error: "At least one field must be provided to update" });
  }

  try {
    const message = await updatePrescriptionServices(prescriptionId, {
      ...(appointmentId && { appointmentId }),
      ...(doctorId && { doctorId }),
      ...(patientId && { patientId }),
      ...(notes && { notes }),
    });
    res.status(200).json({ message });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to update prescription" });
  }
};

// Delete prescription
export const deletePrescription = async (req: Request, res: Response) => {
  const prescriptionId = parseInt(req.params.id);
  if (isNaN(prescriptionId)) {
     res.status(400).json({ error: "Invalid prescription ID" });
  }

  try {
    const message = await deletePrescriptionServices(prescriptionId);
    res.status(200).json({ message });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to delete prescription" });
  }
};
