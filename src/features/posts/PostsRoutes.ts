import { isAuthenticated } from "../../middlewares/AuthMiddleware.ts";
import { PostController } from './PostController.ts';
import { PostRepository } from '../../models/Post/PostRepository.ts';
import { PostService } from "./PostService.ts";

import { Router } from 'express';

const PostsRouter = Router();

const blogPostRepository = new PostRepository();
const postService = new PostService(blogPostRepository);
const postController = new PostController(postService);

PostsRouter.post('/api/posts', isAuthenticated, postController.create);
PostsRouter.get('/api/posts', postController.findAll);
PostsRouter.get('/api/posts/:id', postController.findById);
PostsRouter.patch('/api/posts/:id', isAuthenticated, postController.update);
PostsRouter.delete('/api/posts/:id', isAuthenticated, postController.delete);

export { PostsRouter };
