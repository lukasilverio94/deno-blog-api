import { Request, Response, NextFunction } from "express";
import { PostService } from "./PostService.ts";

type AuthenticatedRequest = Request & { userId: string };

export class PostController { 
    constructor(private readonly postService: PostService){}

    create = async(req: Request, res: Response, next: NextFunction) => {
        try {
            const { userId } = req as AuthenticatedRequest;
            const post = await this.postService.create(req.body, userId);
            return res.send_ok('Post created successfully', { post });
        } catch (error) {
            next(error);
        }
    }

      findAll = async(_req: Request, res: Response, next: NextFunction) => {
        try {
            const posts = await this.postService.findAll();
            return res.send_ok('All posts found', { posts });
        } catch (error) {
            next(error);
        }
    }

    findById = async(req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params as { id: string };
            const post = await this.postService.findById(id);
            return res.send_ok('', { post });
        } catch (error) {
            next(error);
        }
    }

    update = async(req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params as { id: string };
            const { userId } = req as AuthenticatedRequest;
            const post = await this.postService.updateById(id, req.body, userId);
            const updatedFields = Object.keys(req.body);
            return res.send_ok('Post updated successfully', {
                post,
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
            const { userId } = req as AuthenticatedRequest;
            const post = await this.postService.delete(id, userId);
            return res.send_ok('Post deleted successfully', { post });
        } catch (error) {
            next(error);
        }
    }
}
