import { isAuthenticated } from "../../middlewares/AuthMiddleware.ts";
import { CommentRepository } from '../../models/Comment/CommentRepository.ts';
import { PostRepository } from "../../models/Post/PostRepository.ts";
import { Router } from 'npm:express';
import { CommentController } from "./CommentController.ts";
import { CommentService } from "./CommentService.ts";

const CommentsRouter = Router();

const commentRepository = new CommentRepository();
const postRepository = new PostRepository();
const commentService = new CommentService(commentRepository, postRepository);
const commentController = new CommentController(commentService);

CommentsRouter.post('/api/comments', isAuthenticated, commentController.create);
CommentsRouter.post('/api/posts/:postId/comments', isAuthenticated, commentController.create);
CommentsRouter.get('/api/comments', commentController.findAll);
CommentsRouter.get('/api/comments/:id', commentController.findById);
CommentsRouter.get('/api/comments/post/:postId', commentController.findByPost);
CommentsRouter.patch('/api/comments/:id', isAuthenticated, commentController.update);
CommentsRouter.delete('/api/comments/:id', isAuthenticated, commentController.delete);

export { CommentsRouter };
