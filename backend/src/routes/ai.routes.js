import express from "express";

const aiRoutes = express.Router();

aiRoutes.get("/review", (req, res) => {
  res.send("AI Routes are working");
});

export default aiRoutes;
