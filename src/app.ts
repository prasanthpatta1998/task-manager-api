import cors from "cors";
import express from "express";
import helmet from "helmet";
import pinoHttp from "pino-http";
import { API_PREFIX, SERVICE_NAME } from "./common/constants";
import { isDatabaseReady } from "./config/database";
import { logger } from "./config/logger";
import { errorHandler, notFoundHandler } from "./middleware/error-handler";
import { requestIdMiddleware } from "./middleware/request-id";
import { apiRouter } from "./routes";

export function createApp(options?: { corsOrigin?: string }) {
  const app = express();
  const corsOrigin = options?.corsOrigin ?? process.env.CORS_ORIGIN ?? "http://localhost:5173";

  app.disable("x-powered-by");
  app.use(helmet());
  app.use(cors({
    origin: corsOrigin.split(",").map((origin) => origin.trim()),
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Request-Id"],
    exposedHeaders: ["X-Request-Id"]
  }));
  app.use(express.json({ limit: "1mb" }));
  app.use(requestIdMiddleware);
  app.use(pinoHttp({ logger }));

  app.get("/health/live", (_req, res) => {
    res.status(200).json({ status: "ok", service: SERVICE_NAME });
  });

  app.get("/health/ready", (_req, res) => {
    const ready = isDatabaseReady();
    res.status(ready ? 200 : 503).json({
      status: ready ? "ready" : "not_ready",
      checks: { database: ready ? "connected" : "disconnected" }
    });
  });

  // Compatibility endpoint used by the ALB health check in task-manager-infra.
  app.get("/health", (_req, res) => {
    const ready = isDatabaseReady();
    res.status(ready ? 200 : 503).json({
      status: ready ? "ready" : "not_ready",
      checks: { database: ready ? "connected" : "disconnected" }
    });
  });

  app.use(API_PREFIX, apiRouter);
  app.use(notFoundHandler);
  app.use(errorHandler);
  return app;
}
