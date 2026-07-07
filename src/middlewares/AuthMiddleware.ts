import { Request, Response, NextFunction } from 'express';
import { verifyToken } from "../utils/AuthUtil.ts";

export const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers?.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        res.send_unauthorized("Not authorized!");
        return;
    }
    const token = authHeader.split(" ")[1];

    try {
        const decoded = verifyToken(token);
        (req as any).user = decoded.userId;
        next();
    } catch (error) {
        res.send_unauthorized("Token is invalid or expired", { error });
        return;
    }
}