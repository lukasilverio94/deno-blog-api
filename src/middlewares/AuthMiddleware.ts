import type { NextFunction, Request, Response } from "express";
import { verifyToken } from "../utils/AuthUtil.ts";

type AuthenticatedRequest = Request & { userId: string };

export const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies?.auth_token;

    if (!token) {
        return res.send_unauthorized("Not authorized");
    }
    try {
        const decoded = verifyToken(token);
        if (typeof decoded === "string" || !decoded || !decoded.userId) {
            return res.send_unauthorized("Token is invalid or expired");
        }
        (req as AuthenticatedRequest).userId = String(decoded.userId);
        return next();
    } catch {
        return res.send_unauthorized("Token is invalid or expired");
    }
};