
import { UserRepository } from '../models/User/UserRepository.ts';
import { UserController } from '../controllers/UserController.ts';
import { Router } from 'npm:express';

const UserRouter = Router();

const userRepository = new UserRepository();
const userController = new UserController(userRepository);

UserRouter.post('/api/users', userController.create);
UserRouter.get('/api/users', userController.findAll);
UserRouter.get('/api/users/:id', userController.findById);

export { UserRouter };