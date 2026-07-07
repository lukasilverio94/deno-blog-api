import  bcrypt from "npm:bcrypt";
import { signToken } from "./../utils/AuthUtil.ts";
import { Request, Response, NextFunction } from "express";
import { UserRepository } from "../models/User/UserRepository.ts";

export class AuthController {
   constructor(private readonly repository: UserRepository){}
   
   login = async(req: Request, res: Response, next: NextFunction) => {

        const { username, password } = req.body;

        try {
            const user = await this.repository.findOne({ username });
            if (!user) {
                return res.send_badRequest("Invalid credentials");
            }

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.send_unauthorized("Invalid credentials");
            }

            const token = signToken({ userId: user._id });
            res.send_ok("Login successfull", { userId: user._id, username: user.username, token });
        } catch (error) {
            next(error);
        }
    }
}