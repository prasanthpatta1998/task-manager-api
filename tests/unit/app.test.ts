import request from "supertest";
import { describe, expect, it } from "vitest";
import { createApp } from "../../src/app";

describe("Task Manager API app", () => {
  const app = createApp({ corsOrigin: "http://localhost:5173" });

  it("returns liveness without a database", async () => {
    const response = await request(app).get("/health/live");
    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({ status: "ok", service: "task-manager-api" });
  });


  it("exposes the ALB readiness health endpoint", async () => {
    const response = await request(app).get("/health");
    expect([200, 503]).toContain(response.status);
    expect(["ready", "not_ready"]).toContain(response.body.status);
    expect(response.body.checks).toHaveProperty("database");
  });

  it("returns API metadata", async () => {
    const response = await request(app).get("/api/v1");
    expect(response.status).toBe(200);
    expect(response.body.data).toMatchObject({
      name: "task-manager-api",
      version: "1.0.0",
      apiPrefix: "/api/v1"
    });
  });

  it("returns a structured 404 for unknown routes", async () => {
    const response = await request(app).get("/not-a-route");
    expect(response.status).toBe(404);
    expect(response.body.error.code).toBe("NOT_FOUND");
    expect(response.headers["x-request-id"]).toBeTruthy();
  });

  it("does not expose the Express fingerprint header", async () => {
    const response = await request(app).get("/health/live");
    expect(response.headers["x-powered-by"]).toBeUndefined();
  });

  it("requires an access token for the Cognito identity route", async () => {
    const response = await request(app).get("/api/v1/auth/me");
    expect(response.status).toBe(401);
    expect(response.body.error.code).toBe("UNAUTHENTICATED");
  });
});
