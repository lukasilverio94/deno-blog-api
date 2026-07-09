import { NextFunction, Request, Response } from "express";
import { PostService } from "./PostService.ts";
import { PostRules } from "../../models/Post/PostRules.ts";

type AuthenticatedRequest = Request & { userId: string };

export class PostController {
  constructor(
    private readonly postService: PostService,
    private readonly rules = new PostRules(),
  ) {
    this.rules = rules;
  }

  private getPostBodyRules(
    body: Record<string, unknown>,
    requiredFields = false,
  ) {
    const rules = [];

    if (requiredFields || body.title !== undefined) {
      rules.push({ title: body.title });
    }

    if (requiredFields || body.content !== undefined) {
      rules.push({ content: body.content });
    }

    if (body.published !== undefined) {
      rules.push({ published: body.published });
    }

    if (body.tags !== undefined) {
      rules.push({ tags: body.tags });
    }

    return rules;
  }

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userId } = req as AuthenticatedRequest;
      this.rules.validate(
        ...this.getPostBodyRules(req.body, true),
      );
      const post = await this.postService.create(req.body, userId);
      return res.send_ok("Post created successfully", { post });
    } catch (error) {
      next(error);
    }
  };

  findAll = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const posts = await this.postService.findAll();
      return res.send_ok("All posts found", { posts });
    } catch (error) {
      next(error);
    }
  };

  findById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params as { id: string };
      this.rules.validate({ id });
      const post = await this.postService.findById(id);
      return res.send_ok("Post found", { post });
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
        ...this.getPostBodyRules(req.body),
      );
      const post = await this.postService.updateById(id, req.body, userId);
      const updatedFields = Object.keys(req.body);
      return res.send_ok("Post updated successfully", {
        post,
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
      const post = await this.postService.delete(id, userId);
      return res.send_ok("Post deleted successfully", { post });
    } catch (error) {
      next(error);
    }
  };
}
