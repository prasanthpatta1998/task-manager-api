import { describe, expect, it } from "vitest";
import { loadEnv } from "../../src/config/env";

const validEnv = {
  NODE_ENV: "test",
  PORT: "4000",
  LOG_LEVEL: "silent",
  CORS_ORIGIN: "http://localhost:5173",
  MONGODB_URI: "mongodb://localhost:27017/task_manager",
  MONGODB_DB_NAME: "task_manager",
  AWS_REGION: "ap-south-1"
};

describe("loadEnv", () => {
  it("parses a valid environment", () => {
    const env = loadEnv(validEnv);
    expect(env.PORT).toBe(4000);
    expect(env.NODE_ENV).toBe("test");
  });

  it("rejects a missing MongoDB URI", () => {
    const { MONGODB_URI: _removed, ...incomplete } = validEnv;
    expect(() => loadEnv(incomplete)).toThrow(/MONGODB_URI is required/);
  });

  it("rejects an invalid port", () => {
    expect(() => loadEnv({ ...validEnv, PORT: "70000" })).toThrow(/Invalid environment configuration/);
  });
});
