import mongoose from "npm:mongoose@latest";

const MONGODB_URI = Deno.env.get("MONGODB_URI") ?? "mongodb://localhost:27017/deno_mongoose_tutorial";

  export async function connectMongoDB(): Promise<void> {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("MongoDB Connected");
  } catch (error) {
    console.log("Error connecting database: ", error);
    process.exit(1);
  }
}

await mongoose.connect(MONGODB_URI);

console.log(mongoose.connection.readyState);