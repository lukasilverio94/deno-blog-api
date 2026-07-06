import { Request, Response, NextFunction } from "express";
import { CommentRepository } from './../models/Comment/CommentRepository.ts';

export class CommentController {
    constructor(private readonly repository: CommentRepository) {}

    create = async(req: Request, res: Response, next: NextFunction) => {
        try {
            const comment = await this.repository.create(req.body);
            return res.send_created('Comment created', comment);
        } catch (error) {
            next(error);
        }
    }

    findAll = async(_req: Request, res: Response, next: NextFunction) => {
        try {
            const comments = await this.repository.findAll();
            return res.send_ok('', comments);
        }
        catch(error) {
            next(error);
        }
    }

    findById = async(req: Request, res: Response, next: NextFunction) => {
        try {
            const comment = await this.repository.findById(req.params.id);
            return res.send_ok('', comment);
        } catch (error) {
            next(error);
        }
    }
}