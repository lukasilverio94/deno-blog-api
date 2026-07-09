import { UserService } from './UserService.ts';
import { NextFunction } from 'express';
import { Request, Response } from 'express';
import { UserRules } from "./UserRules.ts";

export class UserController {

    constructor(private readonly userService: UserService, private readonly rules = new UserRules()){
        this.rules = rules;
    }

    findAll = async(_req: Request, res: Response, next: NextFunction) => {
        try {
            const users = await this.userService.findAll();
            return res.send_ok('All users found', { users });
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
            const user = await this.userService.findById(id);
            return res.send_ok('', { user });
        } catch (error) {
            next(error);
        }
    }

    update = async(req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params as { id: string };
            const user = (await this.userService.updateById(id, req.body ));
            const updatedFields = Object.keys(req.body);
            return res.send_ok("User updated successfully", {
                user,
                updatedFields,
                updatedFieldsCount: updatedFields.length,
            });
        } catch (error) {
            next(error);
        }
    }

    delete = async(req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params as { id: string };
            const user = await this.userService.delete(id);
            return res.send_ok('User deleted successfully', { user });
        } catch (error) {
            next(error);
        }
    }
}
