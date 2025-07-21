import { Router } from "express";
import {  getPrescriptionItems,  getPrescriptionItemById, getPrescriptionItemsById,  createPrescriptionItem,
  updatePrescriptionItem,
  deletePrescriptionItem,
} from "./prescriptionItems.controller";
import {allRolesAuth, bothRolesAuth, adminRoleAuth,} from "../middleware/bearAuth";

export const prescriptionItemsRouter = Router();

// Get all prescription items (admin only)
prescriptionItemsRouter.get("/prescription-items", adminRoleAuth, getPrescriptionItems);

// Get items by prescriptionId (any authenticated user)
prescriptionItemsRouter.get(  "/prescription-items/prescription/:prescriptionId",  allRolesAuth,  getPrescriptionItemsById);

// Get single item by itemId (any authenticated user)
prescriptionItemsRouter.get(  "/prescription-items/:itemId",  allRolesAuth,  getPrescriptionItemById);

// Create new prescription item (doctor or admin)
prescriptionItemsRouter.post("/prescription-items",allRolesAuth,  createPrescriptionItem);

// Update existing item (doctor or admin)
prescriptionItemsRouter.put(  "/prescription-items/:itemId",  bothRolesAuth,  updatePrescriptionItem
);

// Delete item (doctor or admin)
prescriptionItemsRouter.delete(  "/prescription-items/:itemId",  bothRolesAuth,  deletePrescriptionItem);
