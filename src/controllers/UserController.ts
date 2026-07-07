import { signToken } from './../utils/AuthUtil.ts';
import { NextFunction } from 'express';
import bcrypt from 'npm:bcrypt';
import { UserRepository } from "../models/User/UserRepository.ts";
import { Request, Response } from 'npm:express';
import { UserRules } from "../validation/UseRules.ts";

export class UserController {

    
    constructor(private readonly userRepository: UserRepository, private readonly rules = new UserRules()){
        this.rules = rules;
    }

    create = async(req: Request, res: Response, next: NextFunction) => {
        try {
            this.rules.validate(
                { username: req.body.username },
                { password: req.body.password}
            )
            const { username, bio, avatar, password } = req.body;
            const hashed = await bcrypt.hash(password, 12);
            const existing = await this.userRepository.findOne({ username });
            if (existing) {
                return res.send_conflict('This username is already taken', { username });
            }
            const user = await this.userRepository.create({
                username,
                bio,
                avatar,
                password: hashed
            });
            const token = signToken({ userId: user._id });
            return res.send_ok('User created succesfully', { token });
        } catch (error) {
            next(error);
        }
    }

    findAll = async(_req: Request, res: Response, next: NextFunction) => {
        try {
            const users = await this.userRepository.findAll();
            return res.send_ok('', { users });
        } catch (error) {
            next(error);
        }
    }

    findById = async(req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params as { id: string };
            this.rules.validate(
                {_id: id}
            )
            const user = await this.userRepository.findById(id);
            return res.send_ok('', { user });
        } catch (error) {
            next(error);
        }
    }

    update = async(req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params as { id: string };
            const data = { ...req.body };

            if (data.password) {
                data.password = await bcrypt.hash(data.password, 12);
            }

            const user = await this.userRepository.update(id, data);
            return res.send_ok('User updated successfully', { user });
        } catch (error) {
            next(error);
        }
    }

    delete = async(req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params as { id: string };
            const user = await this.userRepository.delete(id);
            return res.send_ok('User deleted successfully', { user });
        } catch (error) {
            next(error);
        }
    }
}
