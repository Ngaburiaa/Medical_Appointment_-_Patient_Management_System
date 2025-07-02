import { Router } from "express";
import { createUser, loginUser, passwordReset, requestLoginOtp, resetPassword, verifyLoginOtp } from "./auth.controller";

export const authRouter = Router();

authRouter.post('/register', createUser);
authRouter.post('/login', loginUser); 
authRouter.post("/password-reset", passwordReset);
authRouter.put("/reset/:token", resetPassword);
authRouter.post("/request-otp", requestLoginOtp);
authRouter.post("/verify-otp", verifyLoginOtp);