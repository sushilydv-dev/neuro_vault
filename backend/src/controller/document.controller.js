import Documents from "../models/document.js";
import Workspacemembers from "../models/workspacemember.model.js";
import jwt from "jsonwebtoken";
import Users from "../models/user.model.js";
import { processAndUploadDocument } from "../services/rag.service.js";
import path from "path";
import fs from "fs";

export const uploadDocument = async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) {
      return res.status(400).json({ message: "No token" });
    }
    const data = jwt.verify(token, process.env.JWT_SECRET);
    const id = data.id;

    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const { workspace_id } = req.body;
    if (!workspace_id) {
      return res.status(400).json({ error: "workspace_id required" });
    }

    const members = await Workspacemembers.findOne({
      where: {
        workspace_id: workspace_id,
        user_id: id,
      },
    });

    if (!members) {
      return res.status(403).json({
        message: "User does not have access to the workspace",
      });
    }

    const role = members.role?.toLowerCase().trim();
    const status = role === "admin" ? "approved" : "pending";

    
    const file_url = `/uploads/${req.file.filename}`;
    const absolute_path = req.file.path; 

    const document = await Documents.create({
      workspace_id: workspace_id,
      uploaded_by: id,
      file_name: req.file.originalname,
      file_url: file_url,

      file_path: absolute_path,
      status: status,
    });

   
    if (status === "approved") {
      console.log("Admin upload: Auto-indexing to Pinecone...");
      await processAndUploadDocument(
        absolute_path,
        workspace_id,
        req.file.originalname,
      );
    }

    res.status(201).json({
      message: "File uploaded successfully",
      document,
    });
  } catch (err) {
    console.error("Upload error:", err);
    if (err.name === "JsonWebTokenError") {
      return res.status(401).json({ error: "Invalid token" });
    }
    res.status(500).json({ error: "Upload failed" });
  }
};

async function assertWorkspaceAdmin(token, workspaceId) {
  let data;
  try {
    data = jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    const err = new Error("Invalid or expired token");
    err.statusCode = 401;
    throw err;
  }
  const member = await Workspacemembers.findOne({
    where: {
      workspace_id: workspaceId,
      user_id: data.id,
      role: "admin",
    },
  });
  if (!member) {
    const err = new Error("Admin only");
    err.statusCode = 403;
    throw err;
  }
  return data;
}

export const approveDocument = async (req, res) => {
  try {
    const { docId, workspaceId, token } = req.body;
    if (!token) {
      return res.status(400).json({ error: "No token" });
    }
    await assertWorkspaceAdmin(token, workspaceId);

    const doc = await Documents.findByPk(docId);
    if (!doc) return res.status(404).json({ error: "Document not found" });
    if (doc.workspace_id !== parseInt(workspaceId, 10)) {
      return res.status(400).json({ error: "Document does not belong to workspace" });
    }
    if (doc.status === "rejected") {
      return res.status(400).json({ error: "Document was rejected" });
    }

   
    if (!doc.file_path || !fs.existsSync(doc.file_path)) {
      console.error("File path missing or invalid:", doc.file_path);
      return res
        .status(400)
        .json({ error: "Physical file not found on server" });
    }

    console.log(` Starting RAG indexing for: ${doc.file_name}`);

    
    const result = await processAndUploadDocument(
      doc.file_path,
      workspaceId,
      doc.file_name,
    );

    if (result.success) {
      await doc.update({ status: "approved" });
      return res.status(200).json({
        message: "Document approved and indexed in Pinecone!",
        chunks: result.chunksCount,
      });
    } else {
      throw new Error(result.reason);
    }
  } catch (error) {
    if (error.statusCode === 403) {
      return res.status(403).json({ error: error.message });
    }
    if (error.statusCode === 401) {
      return res.status(401).json({ error: error.message });
    }
    console.error("Critical Approval Error:", error);
    res.status(500).json({ error: "Failed to index document in Pinecone" });
  }
};

export const rejectDocument = async (req, res) => {
  try {
    const { docId, workspaceId, token } = req.body;
    if (!token) {
      return res.status(400).json({ error: "No token" });
    }
    await assertWorkspaceAdmin(token, workspaceId);

    const doc = await Documents.findByPk(docId);
    if (!doc) return res.status(404).json({ error: "Document not found" });
    if (doc.workspace_id !== parseInt(workspaceId, 10)) {
      return res.status(400).json({ error: "Document does not belong to workspace" });
    }
    if (doc.status !== "pending") {
      return res.status(400).json({ error: "Only pending documents can be rejected" });
    }

    await doc.update({ status: "rejected" });
    return res.json({ message: "Document rejected" });
  } catch (error) {
    if (error.statusCode === 403) {
      return res.status(403).json({ error: error.message });
    }
    if (error.statusCode === 401) {
      return res.status(401).json({ error: error.message });
    }
    console.error("Reject document error:", error);
    res.status(500).json({ error: "Failed to reject document" });
  }
};



export const getDocuments = async (req, res) => {
  try {
    const { spaceid, token } = req.body;
    if (!token) return res.status(400).json({ message: "No token" });

    const data = jwt.verify(token, process.env.JWT_SECRET);
    const member = await Workspacemembers.findOne({
      where: { workspace_id: spaceid, user_id: data.id, role: "admin" },
    });
    if (!member) {
      return res.status(403).json({ error: "Only admins can review pending documents" });
    }

    const documents = await Documents.findAll({
      where: { workspace_id: spaceid, status: "pending" },
      include: [{ model: Users, as: "user", attributes: ["name"] }],
      order: [["createdAt", "DESC"]],
    });

    res.json(
      documents.map((doc) => {
        const dateObj = new Date(doc.createdAt);
        return {
          document_id: doc.id,
          file_name: doc.file_name,
          status: doc.status,
          file_url: doc.file_url,
          date: dateObj.toLocaleDateString(),
          time: dateObj.toLocaleTimeString(),
          uploaded_by: doc.user?.name,
        };
      }),
    );
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch documents" });
  }
};

export const getUserUploadedDocuments = async (req, res) => {
  try {
    const { spaceid, token } = req.body;
    if (!token) return res.status(400).json({ message: "No token" });

    const data = jwt.verify(token, process.env.JWT_SECRET);

    const documents = await Documents.findAll({
      where: {
        workspace_id: spaceid,
        uploaded_by: data.id,
      },
      order: [["createdAt", "DESC"]],
    });

    res.json(
      documents.map((doc) => ({
        document_id: doc.id,
        file_name: doc.file_name,
        status: doc.status,
        file_url: doc.file_url,
      })),
    );
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch approved documents" });
  }
};

export const getApprovedDocuments = async (req, res) => {
  try {
    const { spaceid, token } = req.body;
    if (!token) return res.status(400).json({ message: "No token" });

    jwt.verify(token, process.env.JWT_SECRET);

    const documents = await Documents.findAll({
      where: { workspace_id: spaceid, status: "approved" },
      include: [{ model: Users, as: "user", attributes: ["name"] }],
      order: [["createdAt", "DESC"]],
    });

    res.json(
      documents.map((doc) => {
        const dateObj = new Date(doc.createdAt);
        return {
          document_id: doc.id,
          file_name: doc.file_name,
          status: doc.status,
          file_url: doc.file_url,
          date: dateObj.toLocaleDateString(),
          time: dateObj.toLocaleTimeString(),
          uploaded_by: doc.user?.name,
        };
      }),
    );
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch pending documents" });
  }
};
