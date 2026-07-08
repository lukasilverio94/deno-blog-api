import { AuthService } from './AuthService.ts';
import { AuthController } from './AuthController.ts';
import { UserRepository } from "../../models/User/UserRepository.ts";
import { Router } from "express";
const AuthRouter = Router();

const userRepository = new UserRepository();
const authService = new AuthService(userRepository);
const authController = new AuthController(authService);

AuthRouter.post("/api/register", authController.register);
AuthRouter.post("/api/login", authController.login);

export { AuthRouter };