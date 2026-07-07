import { AuthController } from './AuthController.ts';
import { UserRepository } from "../../models/User/UserRepository.ts";
import { Router } from "express";

const AuthRouter = Router();

const userRepository = new UserRepository();
const authController = new AuthController(userRepository);

AuthRouter.post("/api/login", authController.login);


export { AuthRouter };