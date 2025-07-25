
import { Router } from "express";
import { initiatePayment, createQRCode, mpesaCallback } from "./mpesa.controller";
import { allRolesAuth } from "../middleware/bearAuth"; 

export const mpesaRouter = Router();

mpesaRouter.post("/initiate-payment", initiatePayment);
mpesaRouter.post("/generate-qr", allRolesAuth, createQRCode);
mpesaRouter.post("/callback", mpesaCallback);
