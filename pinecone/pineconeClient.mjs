import { Pinecone } from "@pinecone-database/pinecone";

export const pc = new Pinecone({
  apiKey:
    process.env.PINECONE_API_KEY || process.env.NEXT_PUBLIC_PINECONE_API_KEY,
});
