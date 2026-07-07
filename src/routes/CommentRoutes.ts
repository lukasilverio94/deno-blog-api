import { isAuthenticated } from "../middlewares/AuthMiddleware.ts";
import { CommentController } from './../controllers/CommentController.ts';
import { CommentRepository } from './../models/Comment/CommentRepository.ts';
import { Router } from 'npm:express';

const CommentsRouter = Router();

const commentRepository = new CommentRepository();
const commentController = new CommentController(commentRepository);

CommentsRouter.post('/api/comments', isAuthenticated, commentController.create);
CommentsRouter.get('/api/comments', commentController.findAll);
CommentsRouter.get('/api/comments/:id', commentController.findById);
CommentsRouter.patch('/api/comments/:id', isAuthenticated, commentController.update);
CommentsRouter.delete('/api/comments/:id', isAuthenticated, commentController.delete);

export { CommentsRouter };