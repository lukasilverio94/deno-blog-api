import { signToken } from '../../utils/AuthUtil.ts';
import { NextFunction } from 'express';
import bcrypt from 'bcrypt';
import { UserRepository } from "../../models/User/UserRepository.ts";
import { Request, Response } from 'express';
import { UserRules } from "./UserRules.ts";

export class UserController {

    constructor(private readonly userRepository: UserRepository, private readonly rules = new UserRules()){
        this.rules = rules;
    }

    create = async(req: Request, res: Response, next: NextFunction) => {
        try {
            this.rules.validate(
                { username: req.body.username },
                { password: req.body.password},
                { bio: req.body.bio },
                { avatar: req.body.avatar }
            );

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
            const users = await this.userRepository.findAll().select("-password");
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
            const user = await this.userRepository.findById(id).select("-password");
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
            if (!user) {
                return res.send_notFound("User not found")
            }
            return res.send_noContent("User updated successfully", { userId: user._id});
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
