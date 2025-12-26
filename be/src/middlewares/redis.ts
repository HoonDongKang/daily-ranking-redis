import { createClient } from "redis";
import "dotenv/config";

const REDIS_PASSWORD = process.env.REDIS_PASSWORD;
const REDIS_HOST = process.env.REDIS_HOST;
const REDIS_PORT = Number.parseInt(process.env.REDIS_PORT || "0");

export const redisClient = createClient({
    username: "default",
    password: REDIS_PASSWORD,
    socket: {
        host: REDIS_HOST,
        port: REDIS_PORT,
    },
});

export const connectRedis = async () => {
    redisClient.on("error", (err) => {
        console.error("Redis Client Error:", err);
    });

    if (!redisClient.isOpen) {
        await redisClient.connect();
        console.log("✅ Redis connected");
    }
};
