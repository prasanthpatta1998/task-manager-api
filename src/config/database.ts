import mongoose from "mongoose";
import type { AppEnv } from "./env";
import { logger } from "./logger";

export async function connectDatabase(env: AppEnv): Promise<void> {
  mongoose.set("strictQuery", true);
  await mongoose.connect(env.MONGODB_URI, {
    dbName: env.MONGODB_DB_NAME,
    serverSelectionTimeoutMS: 10000
  });
  logger.info({ database: env.MONGODB_DB_NAME }, "Connected to MongoDB");
}

export async function disconnectDatabase(): Promise<void> {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
    logger.info("Disconnected from MongoDB");
  }
}

export function isDatabaseReady(): boolean {
  return mongoose.connection.readyState === 1;
}
