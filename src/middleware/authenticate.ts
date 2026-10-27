import { CognitoJwtVerifier } from "aws-jwt-verify";
import type { RequestHandler } from "express";
import { AppError } from "../common/errors/app-error";
import { loadEnv } from "../config/env";

type CognitoClaims = {
  sub: string;
  email?: string;
  token_use?: string;
  "cognito:groups"?: string[];
};

declare global {
  namespace Express {
    interface Request {
      auth?: CognitoClaims;
    }
  }
}

let verifier: ReturnType<typeof CognitoJwtVerifier.create> | undefined;

function getVerifier() {
  if (verifier) return verifier;
  const env = loadEnv();
  if (!env.COGNITO_USER_POOL_ID || !env.COGNITO_CLIENT_ID) {
    throw new AppError(503, "Authentication is not configured", "AUTH_NOT_CONFIGURED");
  }
  verifier = CognitoJwtVerifier.create({
    userPoolId: env.COGNITO_USER_POOL_ID,
    tokenUse: "access",
    clientId: env.COGNITO_CLIENT_ID
  });
  return verifier;
}

export const authenticate: RequestHandler = async (req, _res, next) => {
  const authorization = req.header("authorization");
  if (!authorization?.startsWith("Bearer ")) {
    return next(new AppError(401, "Bearer access token required", "UNAUTHENTICATED"));
  }

  const token = authorization.slice("Bearer ".length).trim();
  if (!token) return next(new AppError(401, "Bearer access token required", "UNAUTHENTICATED"));

  try {
    const claims = await getVerifier().verify(token);
    req.auth = claims as CognitoClaims;
    next();
  } catch {
    next(new AppError(401, "Invalid or expired access token", "INVALID_TOKEN"));
  }
};
