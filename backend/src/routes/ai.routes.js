import express from "express";
import { getResponse } from "../controllers/ai.controllers.js";

const aiRoutes = express.Router();

aiRoutes.get("/review", getResponse);

export default aiRoutes;
