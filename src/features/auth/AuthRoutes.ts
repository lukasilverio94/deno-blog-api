import { AuthService } from "./AuthService.ts";
import { AuthController } from "./AuthController.ts";
import { UserRepository } from "../../models/User/UserRepository.ts";
import { Router } from "express";
import { isAuthenticated } from "../../middlewares/AuthMiddleware.ts";
const AuthRouter = Router();

const userRepository = new UserRepository();
const authService = new AuthService(userRepository);
const authController = new AuthController(authService);

AuthRouter.post("/api/auth/register", authController.register);
AuthRouter.post("/api/auth/login", authController.login);
AuthRouter.get("/api/auth/me", isAuthenticated, authController.me);
AuthRouter.post("/api/auth/logout", authController.logout);

export { AuthRouter };