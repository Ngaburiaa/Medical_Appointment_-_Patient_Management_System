import { Router } from "express";
import { createComplaint, deleteComplaint, getComplaintById, getComplaints, updateComplaint } from "./complaints.controller";
import { allRolesAuth, bothRolesAuth,adminRoleAuth } from "../middleware/bearAuth";


export const complaintRouter = Router();


// Get all complaints
complaintRouter.get('/complaints',adminRoleAuth, getComplaints);

// Get complaint by ID
complaintRouter.get('/complaints/:id',allRolesAuth, getComplaintById);

// Create a new complaint
complaintRouter.post('/complaints',allRolesAuth, createComplaint);

// Update an existing complaint
complaintRouter.put('/complaints/:id',allRolesAuth,updateComplaint);

// Delete an existing complaint
complaintRouter.delete('/complaints/:id',bothRolesAuth,deleteComplaint);