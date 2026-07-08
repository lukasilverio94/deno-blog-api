import { AuthService } from './AuthService.ts';
import { Request, Response, NextFunction } from "express";

export class AuthController {
    constructor(private readonly service: AuthService) { }

    login = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { username, password } = req.body;
            const login = await this.service.login(username, password);
            res.send_ok(
                "Login successfull",
                login,
            );
        } catch (error) {
            next(error);
        }
    }
}