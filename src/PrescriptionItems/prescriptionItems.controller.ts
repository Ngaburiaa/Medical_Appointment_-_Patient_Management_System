import { Request, Response } from "express";
import {
  createPrescriptionItemServices,
  deletePrescriptionItemServices,
  getPrescriptionItemByIdServices,
  getPrescriptionItemsByPrescriptionIdServices,
  getPrescriptionItemsServices,
  updatePrescriptionItemServices,
} from "./prescriptionItems.service";
import { PrescriptionItemValidator } from "../validation/prescriptionItem.validator";

// Get all prescription items
export const getPrescriptionItems = async (req: Request, res: Response) => {
  try {
    const items = await getPrescriptionItemsServices();
    if (!items || items.length === 0) {
       res.status(404).json({ message: "No prescription items found" });
    }
    res.status(200).json(items);
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to fetch prescription items" });
  }
};

// Get all items for a specific prescription
export const getPrescriptionItemsById = async (req: Request, res: Response) => {
  const prescriptionId = parseInt(req.params.prescriptionId);
  if (isNaN(prescriptionId)) {
     res.status(400).json({ error: "Invalid prescription ID" });
  }

  try {
    const items = await getPrescriptionItemsByPrescriptionIdServices(prescriptionId);
    if (!items || items.length === 0) {
       res.status(404).json({ message: "No items found for this prescription" });
    }
    res.status(200).json(items);
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to fetch items" });
  }
};

// Get a single prescription item by itemId
export const getPrescriptionItemById = async (req: Request, res: Response) => {
  const itemId = parseInt(req.params.itemId);
  if (isNaN(itemId)) {
     res.status(400).json({ error: "Invalid item ID" });
  }

  try {
    const item = await getPrescriptionItemByIdServices(itemId);
    if (!item) {
       res.status(404).json({ message: "Prescription item not found" });
    }
    res.status(200).json(item);
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to fetch prescription item" });
  }
};

// Create a new prescription item
export const createPrescriptionItem = async (req: Request, res: Response) => {
  const {
    prescriptionId,
    drugName,
    dosage,
    route,
    frequency,
    duration,
    instructions,
    substitutionAllowed,
  } = req.body;

  // Basic required field check
  if (
    !prescriptionId ||
    !drugName ||
    !dosage ||
    !route ||
    !frequency ||
    !duration
  ) {
  res.status(400).json({
      error: "prescriptionId, drugName, dosage, route, frequency, and duration are required",
    });
  }

  // Schema validation
  const parseResult = PrescriptionItemValidator.safeParse(req.body);

  if (!parseResult.success) {
     res.status(400).json({ error: parseResult.error.issues });
  }

  try {
    const message = await createPrescriptionItemServices({
      prescriptionId,
      drugName,
      dosage,
      route,
      frequency,
      duration,
      instructions,
      substitutionAllowed,
    });

    res.status(201).json({ message });
  } catch (error: any) {
    res.status(500).json({
      error: error.message || "Failed to create prescription item",
    });
  }
};


// Update an existing prescription item by itemId
export const updatePrescriptionItem = async (req: Request, res: Response) => {
  const itemId = parseInt(req.params.itemId);
  if (isNaN(itemId)) {
     res.status(400).json({ error: "Invalid item ID" });
  }

  const {
    prescriptionId,
    drugName,
    dosage,
    route,
    frequency,
    duration,
    instructions,
    substitutionAllowed,
  } = req.body;

  if (
    !prescriptionId &&
    !drugName &&
    !dosage &&
    !route &&
    !frequency &&
    !duration &&
    !instructions &&
    substitutionAllowed === undefined
  ) {
     res.status(400).json({ error: "At least one field must be provided to update" });
  }

  try {
    const message = await updatePrescriptionItemServices(itemId, {
      ...(prescriptionId && { prescriptionId }),
      ...(drugName && { drugName }),
      ...(dosage && { dosage }),
      ...(route && { route }),
      ...(frequency && { frequency }),
      ...(duration && { duration }),
      ...(instructions && { instructions }),
      ...(substitutionAllowed !== undefined && { substitutionAllowed }),
    });

    res.status(200).json({ message });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to update prescription item" });
  }
};

// Delete a prescription item by itemId
export const deletePrescriptionItem = async (req: Request, res: Response) => {
  const itemId = parseInt(req.params.itemId);
  if (isNaN(itemId)) {
     res.status(400).json({ error: "Invalid item ID" });
  }

  try {
    const message = await deletePrescriptionItemServices(itemId);
    res.status(200).json({ message });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to delete prescription item" });
  }
};
