const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_KEY);
const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash",



systemInstruction: `
  return the error message if the code provided is wrong , if it is correct just say , it is right code. 
`
});


async function generateContent(prompt) {
  try {
    if (!prompt) throw new Error("Prompt is required");

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = await response.text();

    return text;
  } catch (error) {
    console.error("AI Service Error:", error);
    throw new Error("Failed to generate AI response");
  }
}

module.exports = generateContent;

