import { redisClient } from "./redisClient";

export const verifyOTP = async (email: string, inputOtp: string) => {
  const storedOtp = await redisClient.get(`otp:${email}`);
  if (!storedOtp) return { success: false, message: "OTP expired or not found" };
  if (storedOtp !== inputOtp) return { success: false, message: "Invalid OTP" };

  await redisClient.del(`otp:${email}`);
  return { success: true, message: "OTP verified" };
};
