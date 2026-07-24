import jwt, { JwtPayload } from "jsonwebtoken";

const EXPIRES_IN = Deno.env.get("EXPIRES_IN") ?? "1h";

const getJwtSecret = (): string => {
  const secret = Deno.env.get("JWT_SECRET");
  if (!secret) {
    throw new Error("JWT_SECRET is not configured");
  }
  return secret;
};

export const signToken = (payload: object): string => {
  return jwt.sign(payload, getJwtSecret(), {
    expiresIn: EXPIRES_IN,
    algorithm: "HS512",
  });
};

export const verifyToken = (token: string): string | JwtPayload => {
  return jwt.verify(token, getJwtSecret());
};
