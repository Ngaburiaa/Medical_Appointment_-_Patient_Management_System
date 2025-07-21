
import { Request, Response } from "express";
import { createUserServices, getDoctorByUserIdService, getUserByEmailService, getUserByPhoneService, updateUserPasswordService } from "./auth.service";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { sendNotificationEmail } from "../emails/mailer";
import { sendOTPVerificationEmail } from "../emails/sendOTPEmail";
import { verifyOTP } from "../emails/verifyOTP";
import { sendOtpViaSms } from "../emails/sendOTPViaSMS";
import { UserLoginValidator, UserValidator } from "../validation/user.validator";
import { getUserByIdServices } from "../Users/user.service";

//Register a new user
export const createUser=async(req:Request,res:Response)=>{
try {
    const parseResult=UserValidator.safeParse(req.body)

    if(!parseResult.success){
        res.status(400).json({error:parseResult.error.issues})   
        return
     }

const user=parseResult.data

const userEmail=user.email

const existingUser=await getUserByEmailService(userEmail)

if(existingUser){
    res.status(400).json({error:"user already exists"})
    return
}

const salt =bcrypt.genSaltSync(10)
const hashedPassword=bcrypt.hashSync(user.password,salt)
user.password=hashedPassword

        const newUser = await createUserServices(user);
        const results = await sendNotificationEmail(user.email, user.firstName, "Account created successfully", "Welcome to our Hospital service</b>");
        if (!results) {
            res.status(500).json({ error: "Failed to send notification email" });
            return;
        }else {
            console.log("Email sent successfully:", results);
        }     
        res.status(201).json(newUser);  

} catch (error) {
    res.status(500).json({error: "Failed to register user"})
}
}


export const loginUser = async (req: Request, res: Response) => {
  try {
     const parseResult = UserLoginValidator.safeParse(req.body);
    if (!parseResult.success) {
       res.status(400).json({ error: parseResult.error.issues });
       return
    }

    const { email, password } = parseResult.data;

    const user = await getUserByEmailService(email);
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return 
    }

    const isMatch = bcrypt.compareSync(password, user.password);
    if (!isMatch) {
      res.status(401).json({ error: "Invalid password" });
       return
    }

    const payload = {
      userId: user.userId,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      address: user.address,
      userType: user.userType,
       exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7 //expires after 1 week
    };

    const secret = process.env.JWT_SECRET as string;
    const token = jwt.sign(payload, secret);

    // ✅ If doctor, include doctor data
    let doctor = null;
    if (user.userType === "doctor") {
      doctor = await getDoctorByUserIdService(user.userId);
    }

   res.status(200).json({
      message: "Login successful",
      token,
      userId: user.userId,
      firstName: user.firstName,
      lastName: user.lastName,
      address: user.address,
      email: user.email,
      userType: user.userType,
      doctor, 
       });
        
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Failed to login user" });
    return 
  }
};



//Password Reset link
export const passwordReset = async (req: Request, res: Response) => {
    try {
        const { email } = req.body;
        if (!email) {
            res.status(400).json({ error: "Email is required" });
            return;
        }

        const user = await getUserByEmailService(email);
        if (!user) {
            res.status(404).json({ error: "User not found" });
            return;
        }

        // Generate a reset token (for simplicity, using JWT)
        const secret = process.env.JWT_SECRET as string;
        const resetToken = jwt.sign({ userId: user.userId }, secret, { expiresIn: '1h' });

        // Send reset email 
        const results = await sendNotificationEmail(email, "Password Reset", user.firstName, `Click the link to reset your password: <a href="http://localhost:5000/api/auth/reset/${resetToken}">Reset Password</a>`);
        
        if (!results) {
            res.status(500).json({ error: "Failed to send reset email" });
            return;
        }

        res.status(200).json({ message: "Password reset email sent successfully" });
    } catch (error:any) {
        res.status(500).json({ error:error.message || "Failed to reset password" });
    }
}

//Password reset option

export const resetPassword = async (req: Request, res: Response) => {
    try {
        const { token } = req.params;
        const { password } = req.body;

        if (!token) {
            res.status(400).json({ error: "Token is required" });
            return;
        }

        if (!password) {
            res.status(400).json({ error: "Password is required" });
            return;
        }

        const secret = process.env.JWT_SECRET as string;
        const payload: any = jwt.verify(token, secret);

        // Fetch user by ID from token
        const user = await getUserByIdServices(payload.userId);

        if (!user) {
            res.status(404).json({ error: "User not found" });
            return;
        }

        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(password, salt);

     
        await updateUserPasswordService(user.email, hashedPassword);

        res.status(200).json({ message: "Password has been reset successfully" });

    } catch (error: any) {
        res.status(500).json({ error: error.message || "Invalid or expired token" });
    }
};


//Request login OTP
export const requestLoginOtp = async (req: Request, res: Response) => {
  const { target, type } = req.body;

  if (!target || !["email", "sms"].includes(type)) {
     res.status(400).json({ error: "Valid type (email or sms) and target are required" });
     return
  }

  try {
    if (type === "email") {
      const user = await getUserByEmailService(target);
      if (!user)  {res.status(404).json({ error: "User not found" });
    return;
}
      
      const result = await sendOTPVerificationEmail(target, user.firstName);
      result.success
        ? res.status(200).json({ message: "OTP sent to your email" })
        : res.status(500).json({ error: result.message });
        return 

    } else if (type === "sms") {
      const result = await sendOtpViaSms(target);
       result.success
        ? res.status(200).json({ message: "OTP sent to your phone" })
        : res.status(500).json({ error: result.message });
        return
    }
  } catch (error: any) {
   res.status(500).json({ error: error.message || "Failed to send OTP" });
  }
};


//Verify login OTP
export const verifyLoginOtp = async (req: Request, res: Response) => {
  const { target, otp, type } = req.body;

  if (!target || !otp || !["email", "sms"].includes(type)) {
    res.status(400).json({ error: "Target, type, and OTP are required" });
  }

  try {
    const isVerified = await verifyOTP(target, otp);
    if (!isVerified.success) {
      res.status(401).json({ error: isVerified.message });
    }

    // Find user
    const user = type === "email"
      ? await getUserByEmailService(target)
      : await getUserByPhoneService(target); 

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    const payload = {
      userId: user.userId,
      email: user.email,
      userType: user.userType,
      exp: Math.floor(Date.now() / 1000) + 3600,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET!);

    res.status(200).json({
      message: "OTP verified. Login successful.",
      token,
      userId: user.userId,
      userName: user.firstName,
       email: user.email,
      userType: user.userType,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "OTP verification failed" });
  }
};
