import { createUser } from './src/controllers/User/UserController.ts';
// @deno-types='npm:@types/express'
import express, { Request, Response, Router } from 'npm:express'
import { connectMongoDB } from "./src/config/db.ts";

const app = express();
const PORT = Number(Deno.env.get("PORT")) || 3000;

connectMongoDB();

app.use(express.json());

app.use('/users', createUser);

app.get("/", (_req: Request, res: Response) => {
  res.send("Welcome to the Deno Blog API!");
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

