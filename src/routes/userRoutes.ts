
import { UserRepository } from '../models/User/UserRepository.ts';
import { UserController } from '../controllers/User/UserController.ts';
import { Router } from 'npm:express';

const UserRouter = Router();

const userRepository = new UserRepository();
const userController = new UserController(userRepository);

UserRouter.post('/api/users', userController.createUser);

export { UserRouter };