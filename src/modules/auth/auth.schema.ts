import { z } from "zod";

export const cognitoIdentitySchema = z.object({
  sub: z.string().min(1),
  email: z.string().email().optional()
});

export type CognitoIdentity = z.infer<typeof cognitoIdentitySchema>;
