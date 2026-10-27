import { Router } from "express";
import { authenticate } from "../../middleware/authenticate";
import { getCurrentIdentity } from "./auth.controller";

export const authRouter = Router();

authRouter.get("/me", authenticate, getCurrentIdentity);
