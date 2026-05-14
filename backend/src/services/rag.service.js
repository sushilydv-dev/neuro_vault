import pc from "../config/pinecone.js";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import fs from "fs";
import path from "path";
import PDFParser from "pdf2json";
import mammoth from "mammoth";
import WordExtractor from "word-extractor";

const index = pc.index("neurovault-index");

function stripHtml(html) {
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

async function extractPdfText(filePath) {
  return new Promise((resolve, reject) => {
    const pdfParser = new PDFParser(null, 1);
    pdfParser.on("pdfParser_dataError", (errData) =>
      reject(errData.parserError),
    );
    pdfParser.on("pdfParser_dataReady", () => {
      try {
        const rawText = pdfParser.getRawTextContent();
        resolve(rawText || "");
      } catch (e) {
        reject(e);
      }
    });
    pdfParser.loadPDF(filePath);
  });
}

async function extractTextFromFile(filePath, originalName) {
  const ext = path.extname(originalName || filePath).toLowerCase();

  switch (ext) {
    case ".pdf":
      return extractPdfText(filePath);

    case ".txt":
    case ".md":
    case ".csv":
    case ".tsv":
    case ".log":
    case ".json":
      return fs.readFileSync(filePath, "utf8");

    case ".html":
    case ".htm":
      return stripHtml(fs.readFileSync(filePath, "utf8"));

    case ".docx": {
      const result = await mammoth.extractRawText({ path: filePath });
      return result.value || "";
    }

    case ".doc": {
      const extractor = new WordExtractor();
      const doc = await extractor.extract(filePath);
      return doc.getBody() || "";
    }

    default:
      throw new Error(`Unsupported file type for indexing: ${ext || "(none)"}`);
  }
}

async function indexChunksToPinecone(fullText, workspaceId, fileName) {
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
  });
  const chunks = await splitter.splitText(fullText);

  const ns = index.namespace(`workspace_${workspaceId}`);

  const records = chunks.map((chunk, i) => ({
    id: `${workspaceId}_${Date.now()}_${i}`,
    text: chunk,
    values: new Array(1024).fill(0.1),
    metadata: {
      text: chunk,
      workspace_id: workspaceId,
      fileName: fileName,
      indexedAt: new Date().toISOString(),
    },
  }));

  await ns.upsert({ records });
  return chunks.length;
}


export const processAndUploadDocument = async (filePath, workspaceId, fileName) => {
  try {
    if (!fs.existsSync(filePath)) {
      throw new Error(`File not found at: ${filePath}`);
    }

    const fullText = await extractTextFromFile(filePath, fileName);

    if (!fullText || fullText.trim().length === 0) {
      return {
        success: false,
        reason: "No extractable text (empty or unsupported content)",
      };
    }

    const chunksCount = await indexChunksToPinecone(
      fullText,
      workspaceId,
      fileName,
    );

    console.log(
      `Successfully indexed ${chunksCount} chunks for Workspace: ${workspaceId} (${fileName})`,
    );
    return { success: true, chunksCount };
  } catch (error) {
    console.error("Document indexing error:", error.message || error);
    throw error;
  }
};


export const processAndUploadPDF = processAndUploadDocument;
