import aiService from "../services/ai.service.js";

export const getResponse = async (req, res) => {
  try {
    const code = req.query.code;
    if (!code) {
      return res.status(400).json({ error: "Code is required" });
    }

    const review = await aiService(code);
    res.json({ review });
  } catch (error) {
    console.error("Controller Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
