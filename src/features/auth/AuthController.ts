import { UserRules } from "../users/UserRules.ts";
import { AuthService } from "./AuthService.ts";
import type { NextFunction, Request, Response } from "express";

type AuthenticatedRequest = Request & { userId: string };

export class AuthController {
    constructor(
        private readonly service: AuthService,
        private readonly rules = new UserRules(),
    ) {
        this.rules = rules;
    }

    private getCookieOptions() {
        return {
            httpOnly: true,
            secure: Deno.env.get("ENVIRONMENT") === "production",
            sameSite: "lax" as const,
            path: "/",
            maxAge: 60 * 60 * 1000,
        };
    }

    register = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { username, bio, avatar, password } = req.body;
            this.rules.validate(
                { username },
                { bio },
                { avatar },
                { password },
            );
            const { token, user } = await this.service.register(req.body);
            res.cookie("auth_token", token, this.getCookieOptions());
            return res.send_created("Registered sucessfuly", { user });
        } catch (error) {
            next(error);
        }
    };

    login = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { username, password } = req.body;
            this.rules.validate(
                { username },
                { password },
            );
            const { token, user } = await this.service.login(username, password);
            res.cookie("auth_token", token, this.getCookieOptions());
            return res.send_ok(
                "Login successful",
                { user },
            );
        } catch (error) {
            next(error);
        }
    };

    me = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { userId } = req as AuthenticatedRequest;
            const user = await this.service.getCurrentUser(userId);
            return res.send_ok("Current user retrieved", {
                user,
            });
        } catch (error) {
            next(error);
        }
    };

    logout = (_req: Request, res: Response, next: NextFunction) => {
        try {
            res.clearCookie("auth_token", {
                httpOnly: true,
                secure: Deno.env.get("ENVIRONMENT") === "production",
                sameSite: "lax",
                path: "/",
            });
            return res.send_ok("Logout successful", null);
        } catch (error) {
            next(error);
        }
    };
}
