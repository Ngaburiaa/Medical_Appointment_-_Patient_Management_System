import { redisClient } from "./redisClient";
import { Twilio } from "twilio";
import dotenv from "dotenv";
dotenv.config();

const client = new Twilio(
  process.env.TWILIO_ACCOUNT_SID!,
  process.env.TWILIO_AUTH_TOKEN!
);

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

export const sendOtpViaSms = async (phone: string) => {
  const otp = generateOTP();
  try {
    const existingTTL = await redisClient.ttl(`otp:${phone}`);
    if (existingTTL > 240) {
      return {
        success: false,
        message: `Please wait before requesting another OTP.`,
      };
    }

    await client.messages.create({
      body: `Your OTP is: ${otp}. It expires in 5 minutes.`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phone,
    });

    await redisClient.setEx(`otp:${phone}`, 300, otp);
    return { success: true, message: "OTP sent via SMS" };
  } catch (error) {
    console.error("SMS OTP error:", error);
    return { success: false, message: "Failed to send OTP via SMS" };
  }
};

