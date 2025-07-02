import { redisClient } from "./redisClient";
import nodeMailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodeMailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_SENDER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

export const sendOTPVerificationEmail = async (
  email: string,
  firstName: string | null
) => {
  try {
    const otp = generateOTP();
    const subject = "Your OTP Code";
    const message = `Use this code to verify your email. It expires in 5 minutes.`;

    const mailOptions = {
      from: process.env.EMAIL_SENDER,
      to: email,
      subject,
      html: `
        <div style="font-family: Arial, sans-serif;">
          <h2>${subject}</h2>
          <p>Hi ${firstName || "User"},</p>
          <p>${message}</p>
          <h1 style="color: #ff6600;">${otp}</h1>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    await redisClient.setEx(`otp:${email}`, 300, otp); // 5 minutes
    return { success: true, message: "OTP sent" };
  } catch (error) {
    console.error("OTP Send Error:", error);
    return { success: false, message: "Failed to send OTP" };
  }
};
