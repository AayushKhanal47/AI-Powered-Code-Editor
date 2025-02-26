

const aiService = require("../services/ai.service");

exports.getResponse = async (req, res) => {
  try {
    const code = req.body.code;
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

