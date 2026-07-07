import { isAuthenticated } from "../middlewares/AuthMiddleware.ts";
import { PostController } from './../controllers/PostController.ts';
import { PostRepository } from './../models/Post/PostRepository.ts';

import { Router } from 'express';

const PostsRouter = Router();

const blogPostRepository = new PostRepository();
const postController = new PostController(blogPostRepository);

PostsRouter.post('/api/posts', isAuthenticated, postController.create);
PostsRouter.get('/api/posts', postController.findAll);
PostsRouter.get('/api/posts/:id', postController.findById);
PostsRouter.patch('/api/posts/:id', isAuthenticated, postController.update);
PostsRouter.delete('/api/posts/:id', isAuthenticated, postController.delete);

export { PostsRouter };