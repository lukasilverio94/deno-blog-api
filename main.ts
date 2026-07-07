// @deno-types='npm:@types/express'
import express from "npm:express";
// @deno-types='npm:@types/morgan'
import morgan from "npm:morgan";
import { connectMongoDB } from "./src/config/db.ts";
import { UserRouter } from "./src/routes/UserRoutes.ts";
import responser from "responser";
import { PostsRouter } from "./src/routes/PostsRoutes.ts";
import { CommentsRouter } from "./src/routes/CommentRoutes.ts";
import { AuthRouter } from "./src/routes/AuthRoutes.ts";

const app = express();
const PORT = Number(Deno.env.get("PORT")) || 3000;

await connectMongoDB();

app.use(morgan('dev'));
app.use(express.json());
app.use(responser.default);

app.use(UserRouter);
app.use(AuthRouter);
app.use(PostsRouter);
app.use(CommentsRouter);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
