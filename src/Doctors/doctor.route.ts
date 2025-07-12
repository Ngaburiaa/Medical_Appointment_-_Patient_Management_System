import { Router } from "express";
import { createDoctor, deleteDoctor, getDoctorById, getDoctors, updateDoctor} from "./doctor.controller";
import { allRolesAuth, bothRolesAuth,adminRoleAuth } from "../middleware/bearAuth";


export const doctorRouter = Router();


// Get all doctors
doctorRouter.get('/doctors', getDoctors);


// Get doctor by ID
doctorRouter.get('/doctors/:id', getDoctorById);

// Create a new doctor
doctorRouter.post('/doctors',allRolesAuth, createDoctor);

// Update an existing doctor
doctorRouter.put('/doctors/:id',allRolesAuth,updateDoctor);

// Delete an existing doctor
doctorRouter.delete('/doctors/:id',bothRolesAuth,deleteDoctor);