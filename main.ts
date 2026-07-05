// @deno-types='npm:@types/express'
import express, { Request, Response } from 'npm:express'
import { connectMongoDB } from "./src/config/db.ts";
import { UserRouter } from "./src/routes/userRoute.ts";

const app = express();
const PORT = Number(Deno.env.get("PORT")) || 3000;

await connectMongoDB();

app.use(express.json());

app.use(UserRouter);

app.get("/", (_req: Request, res: Response) => {
  res.send("Welcome to the Deno Blog API!");
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
