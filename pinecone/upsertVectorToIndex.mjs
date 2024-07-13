import { pc } from "./pineconeClient.mjs";

export const upsertVectorToIndex = async (indexName, upsertData) => {
  try {
    const index = pc.Index(indexName);
    await index.upsert(upsertData);
    return { status: "success" };
  } catch (error) {
    throw error;
  }
};
