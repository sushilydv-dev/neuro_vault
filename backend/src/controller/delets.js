import pc from "./src/config/pinecone.js";
const indexName = "neurovault-index";
const workspaceId = "2"; // The workspace you want to clear

async function clearPinecone() {
  try {
    const index = pc.index(indexName);

    console.log(`Connecting to index: ${indexName}...`);

   
    const namespace = index.namespace(`workspace_${workspaceId}`);

    console.log(
      ` Deleting all chunks in namespace: workspace_${workspaceId}...`,
    );

    await namespace.deleteAll();

    console.log("Cleanup successful! The namespace is now empty.");
    process.exit(0);
  } catch (error) {
    console.error("Cleanup failed:", error);
    process.exit(1);
  }
}

clearPinecone();
