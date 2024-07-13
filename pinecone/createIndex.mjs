import { pc } from "./pineconeClient.mjs";

export const createIndex = async (
  indexName,
  dimension = 768,
  metric = "euclidean"
) => {
  try {
    const index = await pc.createIndex({
      name: indexName,
      dimension: dimension,
      metric: metric,
      spec: {
        serverless: {
          cloud: "aws",
          region: "us-east-1",
        },
      },
    });
    const indexStatus = await pc.describeIndex(indexName);
    return {
      index,
      indexStatus,
    };
  } catch (error) {
    throw error;
  }
};
