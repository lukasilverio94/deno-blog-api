import { Request, Response, NextFunction } from 'express';
import { verifyToken } from "../utils/AuthUtil.ts";
import { throwlhos } from "../globals/Throwlhos.ts";

type AuthenticatedRequest = Request & { userId: string };

export const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers?.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        res.send_unauthorized("Not authorized!");
        return;
    }
    const token = authHeader.split(" ")[1];

    try {
        const decoded = verifyToken(token);
        if (typeof decoded === "string" || !decoded.userId) {
            throw throwlhos.err_unauthorized("Token is invalid or expired");
        }
        (req as AuthenticatedRequest).userId = String(decoded.userId);
        next();
    } catch (error) {
        res.send_unauthorized("Token is invalid or expired", { error });
        return;
    }
}