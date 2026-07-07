import { Request, Response, NextFunction } from "express";
import { PostRepository } from './../models/Post/PostRepository.ts';

export class PostController { 
    constructor(private readonly repository: PostRepository){}

    create = async(req: Request, res: Response, next: NextFunction) => {
        try {
            const post = await this.repository.create(req.body);
            return res.send_ok('Post created successfully', { post });
        } catch (error) {
            next(error);
        }
    }

      findAll = async(_req: Request, res: Response, next: NextFunction) => {
        try {
            const posts = await this.repository.findAll();
            return res.send_ok('', { posts });
        } catch (error) {
            next(error);
        }
    }

    findById = async(req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params as { id: string };
            const post = await this.repository.findById(id);
            return res.send_ok('', { post });
        } catch (error) {
            next(error);
        }
    }

    update = async(req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params as { id: string };
            const post = await this.repository.update(id, req.body);
            return res.send_ok('Post updated successfully', { post });
        } catch (error) {
            next(error);
        }
    }

    delete = async(req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params as { id: string };
            const post = await this.repository.delete(id);
            return res.send_ok('Post deleted successfully', { post });
        } catch (error) {
            next(error);
        }
    }
}