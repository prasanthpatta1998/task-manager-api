import type { Request, Response } from "express";
import { getIdentity } from "./auth.service";

export function getCurrentIdentity(req: Request, res: Response): void {
  if (!req.auth) {
    res.status(401).json({ error: { code: "UNAUTHENTICATED", message: "Authentication required" } });
    return;
  }
  res.status(200).json({ data: getIdentity(req.auth) });
}
