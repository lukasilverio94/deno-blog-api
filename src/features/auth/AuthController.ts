import { UserRules } from "../users/UserRules.ts";
import { AuthService } from './AuthService.ts';
import { Request, Response, NextFunction } from "express";

export class AuthController {
    constructor(
        private readonly service: AuthService,
         private readonly rules = new UserRules()
    ) { 
        this.rules = rules;
    }

    register = async(req: Request, res: Response, next: NextFunction) => {
        try {
           const { username, bio, avatar, password } = req.body;
           this.rules.validate(
                { username },
                { bio },
                { avatar }, 
                { password }, 
            );
            const { token } = await this.service.register(req.body);
            res.send_created("Registered sucessfuly",{ token } )
        } catch (error) {
            next(error);
        }
    }

    login = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { username, password } = req.body;
              this.rules.validate(
                { username },
                { password }
            )
            const login = await this.service.login(username, password);
            res.send_ok(
                "Login successful",
                login,
            );
        } catch (error) {
            next(error);
        }
    }
}