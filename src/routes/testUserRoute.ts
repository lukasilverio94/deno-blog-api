import express from "express";
const router = express.Router();

import { createUser } from "../controllers/User/UserController.ts";

router.post('/', createUser);

export default router;