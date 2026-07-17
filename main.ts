// @deno-types='npm:@types/express'
import express from "express";
// @deno-types='npm:@types/morgan'
import morgan from "morgan";
import cors from 'cors';
import { connectMongoDB } from "./src/config/db.ts";
import { UserRouter } from "./src/features/users/UserRoutes.ts";
import responser from "responser";
import { PostsRouter } from "./src/features/posts/PostsRoutes.ts";
import { CommentsRouter } from "./src/features/comments/CommentRoutes.ts";
import { AuthRouter } from "./src/features/auth/AuthRoutes.ts";
import { errorHandler } from "./src/middlewares/Error.ts";

const app = express();
const corsOptions = {
  origin:  Deno.env.get("BASE_CLIENT_URL"), 
  credentials: true,            
  optionsSuccessStatus: 200    
}

const PORT = Number(Deno.env.get("PORT")) || 3000;

await connectMongoDB();

app.use(cors(corsOptions));
app.use(morgan('dev'));
app.use(express.json());
app.use(responser.default);

app.use(UserRouter);
app.use(AuthRouter);
app.use(PostsRouter);
app.use(CommentsRouter);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
