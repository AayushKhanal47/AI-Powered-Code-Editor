import express from "express";
import cors from "cors";
import { userRouter } from "./routes/userRoute.js"; 
import aiRoutes from "./routes/ai.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("aayush");
});

app.use("/api/auth", userRouter);
app.use("/ai", aiRoutes);

export default app;

