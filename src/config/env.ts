import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().int().min(1).max(65535).default(4000),
  LOG_LEVEL: z.enum(["fatal", "error", "warn", "info", "debug", "trace", "silent"]).default("info"),
  CORS_ORIGIN: z.string().default("http://localhost:5173"),
  MONGODB_URI: z.string().min(1, "MONGODB_URI is required"),
  MONGODB_DB_NAME: z.string().min(1).default("task_manager"),
  AWS_REGION: z.string().default("ap-south-1"),
  COGNITO_USER_POOL_ID: z.string().optional().default(""),
  COGNITO_CLIENT_ID: z.string().optional().default("")
});

export type AppEnv = z.infer<typeof envSchema>;


export function loadEnv(source: NodeJS.ProcessEnv = process.env): AppEnv {
  const parsed = envSchema.safeParse(source);

  if (!parsed.success) {
    const details = parsed.error.issues
      .map((issue) => {
        const field = issue.path.join(".");
        const message =
          field === "MONGODB_URI" && issue.code === "invalid_type"
            ? "MONGODB_URI is required"
            : issue.message;

        return `${field}: ${message}`;
      })
      .join("; ");

    throw new Error(`Invalid environment configuration: ${details}`);
  }

  return parsed.data;
}

