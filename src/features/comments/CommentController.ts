import { Request, Response, NextFunction } from "express";
import { CommentService } from "./CommentService.ts";

type AuthenticatedRequest = Request & { userId: string };

export class CommentController {
    constructor(private readonly commentService: CommentService) {}

    create = async(req: Request, res: Response, next: NextFunction) => {
        try {
            const { postId } = req.params as { postId?: string };
            const { userId } = req as AuthenticatedRequest;
            const comment = await this.commentService.create(req.body, userId, postId);
            return res.send_created('Comment created', { comment });
        } catch (error) {
            next(error);
        }
    }

    findAll = async(_req: Request, res: Response, next: NextFunction) => {
        try {
            const comments = await this.commentService.findAll();
            return res.send_ok('All comments found', { comments });
        }
        catch(error) {
            next(error);
        }
    }

    findById = async(req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params as { id: string };
            const comment = await this.commentService.findById(id);
            return res.send_ok('', { comment });
        } catch (error) {
            next(error);
        }
    }

    update = async(req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params as { id: string };
            const comment = await this.commentService.updateById(id, req.body);
            return res.send_noContent('Comment updated successfully', { commentId: comment._id });
        } catch (error) {
            next(error);
        }
    }

    delete = async(req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params as { id: string };
            await this.commentService.delete(id);
            return res.send_noContent('Comment deleted successfully', { commentId: id });
        } catch (error) {
            next(error);
        }
    }
}
