import { UserRepository } from "../../models/User/UserRepository.ts";
import { Request, Response } from 'npm:express';

export class UserController {
    constructor(private readonly userRepository: UserRepository){}

    createUser = async(req: Request, res: Response) => {
        try {
            const user = await this.userRepository.create(req.body);
            return res.status(201).json({user});
        } catch (error) {
            return res.status(400).json({
                message: 'Something went wrong creating user',
                data: {
                    body: req.body,
                    error
                }
            })
        }
    }
}