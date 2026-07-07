import { PostController } from './../controllers/PostController.ts';
import { PostRepository } from './../models/Post/PostRepository.ts';

import { Router } from 'npm:express';

const PostsRouter = Router();

const blogPostRepository = new PostRepository();
const postController = new PostController(blogPostRepository);

PostsRouter.post('/api/posts', postController.create);
PostsRouter.get('/api/posts', postController.findAll);
PostsRouter.get('/api/posts/:id', postController.findById);
PostsRouter.patch('/api/posts/:id', postController.update);
PostsRouter.delete('/api/posts/:id', postController.delete);

export { PostsRouter };