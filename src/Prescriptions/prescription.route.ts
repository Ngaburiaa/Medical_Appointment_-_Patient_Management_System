import { Router } from "express";
import { createPrescription, deletePrescription, getPrescriptionById, getPrescriptions, updatePrescription } from "./prescription.controller";
import { allRolesAuth, bothRolesAuth,adminRoleAuth } from "../middleware/bearAuth";


export const prescriptionRouter = Router();


// Get all prescriptions
prescriptionRouter.get('/prescriptions',adminRoleAuth, getPrescriptions)

// Get prescription by ID
prescriptionRouter.get('/prescriptions/:id',allRolesAuth, getPrescriptionById);

// Create a new prescription
prescriptionRouter.post('/prescriptions',allRolesAuth, createPrescription);

// Update an existing prescription
prescriptionRouter.put('/prescriptions/:id',allRolesAuth,updatePrescription);

// Delete an existing prescription
prescriptionRouter.delete('/prescriptions/:id',bothRolesAuth,deletePrescription);