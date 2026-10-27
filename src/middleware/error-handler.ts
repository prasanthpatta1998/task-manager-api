import type { ErrorRequestHandler, RequestHandler } from "express";
import { AppError } from "../common/errors/app-error";
import { logger } from "../config/logger";

export const notFoundHandler: RequestHandler = (req, res) => {
  res.status(404).json({
    error: {
      code: "NOT_FOUND",
      message: `Route ${req.method} ${req.path} was not found`,
      requestId: res.locals.requestId
    }
  });
};

export const errorHandler: ErrorRequestHandler = (err: unknown, req, res, _next) => {
  const error = err instanceof Error ? err : new Error("Unknown error");
  const statusCode = err instanceof AppError ? err.statusCode : 500;
  const code = err instanceof AppError ? err.code : "INTERNAL_SERVER_ERROR";
  const message = statusCode < 500 ? error.message : "An unexpected error occurred";

  logger.error({
    err: error,
    requestId: res.locals.requestId,
    method: req.method,
    path: req.path
  }, "Request failed");

  res.status(statusCode).json({
    error: {
      code,
      message,
      requestId: res.locals.requestId
    }
  });
};
