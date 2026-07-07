import { JWTPayload } from 'npm:jose@5.9.6';
import jwt from "jsonwebtoken";
import { throwlhos } from "../globals/Throwlhos.ts";

const JWT_SECRET =  Deno.env.get("JWT_SECRET") ?? "this is not a safe secret";
const EXPIRES_IN = Deno.env.get("EXPIRES_IN") ?? '1h';

export const signToken = (payload: object): JWTPayload => {
    if(!JWT_SECRET) {
        throw throwlhos.err_badRequest('JWT_SECRET is not defined');
    }
    return jwt.sign(payload, JWT_SECRET, {
        expiresIn: EXPIRES_IN,
        algorithm: 'HS512'
    });
}

export const verifyToken = (token: string): JWTPayload => {
    return jwt.verify(token, JWT_SECRET);
}