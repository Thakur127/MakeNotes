import { genAI } from "./googleGenerativeAI";

export const embeddingModel = genAI.getGenerativeModel({
  model: "text-embedding-004",
});

export const generativeModel = genAI.getGenerativeModel({
  model: "gemini-1.5-pro",
});
