import { Pinecone } from "@pinecone-database/pinecone";

const pc = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY,
});

export const initPinecone = async () => {
  const indexName = "neurovault-index";

  const existingIndexes = await pc.listIndexes();
  const indexExists = existingIndexes.indexes.some(
    (idx) => idx.name === indexName,
  );

  if (!indexExists) {
    console.log("Creating new index with Llama embeddings...");
    await pc.createIndexForModel({
      name: indexName,
      cloud: "aws",
      region: "us-east-1",
      embed: {
        model: "llama-text-embed-v2",
        fieldMap: { text: "text" },
      },
    });

    let ready = false;
    while (!ready) {
      const desc = await pc.describeIndex(indexName);
      if (desc.status.ready) ready = true;
      else await new Promise((r) => setTimeout(r, 2000));
    }
  }

  return pc.index(indexName);
};

export default pc;
