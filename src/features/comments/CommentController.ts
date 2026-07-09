import { NextFunction, Request, Response } from "express";
import { CommentService } from "./CommentService.ts";
import { CommentRules } from "../../models/Comment/CommentRules.ts";

type AuthenticatedRequest = Request & { userId: string };

export class CommentController {
  constructor(
    private readonly commentService: CommentService,
    private readonly rules = new CommentRules(),
  ) {
    this.rules = rules;
  }

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { postId } = req.params as { postId?: string };
      const { userId } = req as AuthenticatedRequest;
      this.rules.validate(
        { postId },
        { content: req.body.content },
      );
      const comment = await this.commentService.create(
        req.body,
        userId,
        postId,
      );
      return res.send_created("Comment created", { comment });
    } catch (error) {
      next(error);
    }
  };

  findAll = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const comments = await this.commentService.findAll();
      return res.send_ok("All comments found", { comments });
    } catch (error) {
      next(error);
    }
  };

  findById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params as { id: string };
      this.rules.validate({ id });
      const comment = await this.commentService.findById(id);
      return res.send_ok("Comment found", { comment });
    } catch (error) {
      next(error);
    }
  };

  findByPost = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { postId } = req.params as { postId: string };
      this.rules.validate({ postId });
      const comments = await this.commentService.findByPost(postId);
      return res.send_ok("All comments in this post", { comments });
    } catch (error) {
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params as { id: string };
      const { userId } = req as AuthenticatedRequest;
      this.rules.validate(
        { id },
        { content: req.body.content },
      );
      const comment = await this.commentService.updateById(
        id,
        req.body,
        userId,
      );
      const updatedFields = Object.keys(req.body);
      return res.send_ok("Comment updated successfully", {
        comment,
        updatedFields,
        updatedFieldsCount: updatedFields.length,
      });
    } catch (error) {
      next(error);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params as { id: string };
      const { userId } = req as AuthenticatedRequest;

      this.rules.validate({ id });
      const comment = await this.commentService.delete(id, userId);
      return res.send_ok("Comment deleted successfully", { comment });
    } catch (error) {
      next(error);
    }
  };
}
