import { createClient } from "redis";
import dotenv from "dotenv";
dotenv.config();

export const redisClient = createClient({
  url: process.env.REDIS_URL,
});

redisClient.on("error", (err: any) => console.error("Redis error:", err));

export const connectRedis = async () => {
  if (!redisClient.isOpen) {
    await redisClient.connect();
    console.log("✅ Redis connected");
  }
};
