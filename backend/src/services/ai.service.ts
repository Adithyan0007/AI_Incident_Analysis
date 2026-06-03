import "dotenv/config";
import { GoogleGenAI } from "@google/genai";

if (!process.env.GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY is missing");
}

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export const GetGeminiRcaReport = async (prompt: string) => {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
  });

  return response.text;
};
