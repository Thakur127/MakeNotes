import { genAI } from "./googleGenerativeAI";
import { embeddingModel } from "./models";

export const createEmbedding = async (content) => {
  try {
    const result = await embeddingModel.embedContent(content);
    const embedding = result.embedding.values;
    return embedding;
  } catch (error) {
    throw error;
  }
};
