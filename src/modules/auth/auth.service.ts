import type { CognitoIdentity } from "./auth.schema";

/**
 * Cognito handles sign-up, sign-in, password resets and MFA.
 * This service maps verified Cognito identity claims to application behavior.
 * User profile persistence will be added with the users module.
 */
export function getIdentity(identity: CognitoIdentity) {
  return {
    id: identity.sub,
    email: identity.email ?? null
  };
}
