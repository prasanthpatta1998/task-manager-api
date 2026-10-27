import type { RequestHandler } from "express";
import { AppError } from "../common/errors/app-error";

export type AppRole = "admin" | "member";

export function requireRoles(...allowedRoles: AppRole[]): RequestHandler {
  return (req, _res, next) => {
    const user = (req as typeof req & { user?: { role?: AppRole } }).user;
    if (!user) return next(new AppError(401, "Authentication required", "UNAUTHENTICATED"));
    if (!user.role || !allowedRoles.includes(user.role)) {
      return next(new AppError(403, "You do not have permission to perform this action", "FORBIDDEN"));
    }
    next();
  };
}
