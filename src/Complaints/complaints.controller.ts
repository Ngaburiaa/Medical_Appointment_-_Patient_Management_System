import { Request, Response } from "express";
import {
  createComplaintServices,
  deleteComplaintServices,
  getComplaintByIdServices,
  getComplaintsServices,
  updateComplaintServices,
} from "./complaints.service";
import { ComplaintValidator } from "../validation/complaints.validator";

// Get all complaints
export const getComplaints = async (req: Request, res: Response) => {
  try {
    const allComplaints = await getComplaintsServices();
    if (!allComplaints || allComplaints.length === 0) {
       res.status(404).json({ message: "No complaints found" });
    }
     res.status(200).json(allComplaints);
  } catch (error: any) {
     res.status(500).json({ error: error.message || "Failed to fetch complaints" });
  }
};

// Get complaint by ID
export const getComplaintById = async (req: Request, res: Response) => {
  const complaintId = parseInt(req.params.id);
  if (isNaN(complaintId)) {
     res.status(400).json({ error: "Invalid complaint ID" });
  }
  try {
    const complaint = await getComplaintByIdServices(complaintId);
    if (!complaint) {
       res.status(404).json({ message: "Complaint not found" });
    }
     res.status(200).json(complaint);
  } catch (error: any) {
     res.status(500).json({ error: error.message || "Failed to fetch complaint" });
  }
};

// Create new complaint
export const createComplaint = async (req: Request, res: Response) => {
  const { userId, relatedAppointmentId, subject, description, status } = req.body;
  if (!userId || !subject || !description) {
     res.status(400).json({ error: "User ID, subject and description are required" });
  }

  try {
    const parseResult=ComplaintValidator.safeParse(req.body)
   
       if(!parseResult.success){
           res.status(400).json({error:parseResult.error.issues})   
           return
        }
    const message = await createComplaintServices({
      userId,
      relatedAppointmentId,
      subject,
      description,
      status,
    });
     res.status(201).json({ message });
  } catch (error: any) {
     res.status(500).json({ error: error.message || "Failed to create complaint" });
  }
};

// Update complaint (Partial update allowed)
export const updateComplaint = async (req: Request, res: Response) => {
  const complaintId = parseInt(req.params.id);
  if (isNaN(complaintId)) {
     res.status(400).json({ error: "Invalid complaint ID" });
  }

  const { subject, description, status } = req.body;
  if (!subject && !description && !status) {
     res.status(400).json({ error: "At least one field must be provided to update" });
  }

  try {
    const message = await updateComplaintServices(complaintId, {
      ...(subject && { subject }),
      ...(description && { description }),
      ...(status && { status }),
    });
     res.status(200).json({ message });
  } catch (error: any) {
     res.status(500).json({ error: error.message || "Failed to update complaint" });
  }
};

// Delete complaint
export const deleteComplaint = async (req: Request, res: Response) => {
  const complaintId = parseInt(req.params.id);
  if (isNaN(complaintId)) {
     res.status(400).json({ error: "Invalid complaint ID" });
  }

  try {
    const message = await deleteComplaintServices(complaintId);
     res.status(200).json({ message });
  } catch (error: any) {
     res.status(500).json({ error: error.message || "Failed to delete complaint" });
  }
};
