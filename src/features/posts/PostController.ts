import { Request, Response, NextFunction } from "express";
import { PostService } from "./PostService.ts";

export class PostController { 
    constructor(private readonly postService: PostService){}

    create = async(req: Request, res: Response, next: NextFunction) => {
        try {
            const post = await this.postService.create(req.body);
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
            const post = await this.postService.updateById(id, req.body);
            return res.send_noContent('Post updated successfully', { postId: post._id });
        } catch (error) {
            next(error);
        }
    }

    delete = async(req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params as { id: string };
            await this.postService.delete(id);
            return res.send_noContent('Post deleted successfully', { postId: id });
        } catch (error) {
            next(error);
        }
    }
}
