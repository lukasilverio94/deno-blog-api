import { UserRepository } from '../../models/User/UserRepository.ts';
import { UserController } from './UserController.ts';
import { Router } from 'express';
import { isAuthenticated } from "../../middlewares/AuthMiddleware.ts";
import { UserService } from "./UserService.ts";

const UserRouter = Router();

const userRepository = new UserRepository();
const userService = new UserService(userRepository);
const userController = new UserController(userService);

UserRouter.post('/api/users', userController.create);
UserRouter.get('/api/users', userController.findAll);
UserRouter.get('/api/users/:id', userController.findById);
UserRouter.patch('/api/users/:id', isAuthenticated, userController.update);
UserRouter.delete('/api/users/:id', isAuthenticated, userController.delete);

export { UserRouter };