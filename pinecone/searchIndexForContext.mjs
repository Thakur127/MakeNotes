import { pc } from "./pineconeClient.mjs";

export const searchIndexForContext = async (
  indexName,
  queryEmbed,
  lookupField
) => {
  try {
    const index = pc.Index(indexName);
    const queryResponse = await index.query({
      topK: 5,
      vector: Array.from(queryEmbed),
      includeValues: true,
      includeMetadata: true,
    });

    // console.log(queryResponse);
    // Extracting the text field from the metadata
    let context = "";
    if (queryResponse.matches.length > 0) {
      queryResponse.matches.forEach((match) => {
        context += match.metadata[lookupField];
      });
    } else {
      console.log("No matches found.");
    }
    return context;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
