import express from "express";
import cors from "cors";
import userRoutes from "./routes/userRoute.js";
import connectDB from "./config/mongodb.js";
import aiRoutes from "./routes/ai.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Server is running");
});

connectDB();

app.use("/api/auth", userRoutes);
app.use("/api/ai", aiRoutes);

export default app;
