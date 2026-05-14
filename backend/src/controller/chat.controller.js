import pc from "../config/pinecone.js";
import Workspacemembers from "../models/workspacemember.model.js";
import Chats from "../models/chat.model.js";
import ChatSessions from "../models/chatSession.js";
import jwt from "jsonwebtoken";

const index = pc.index("neurovault-index");

export const getSessions = async (req, res) => {
  try {
    const { workspace_id, token } = req.body;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const member = await Workspacemembers.findOne({
      where: { workspace_id, user_id: decoded.id },
    });

    if (!member) return res.status(403).json({ error: "Access denied" });

    const sessions = await ChatSessions.findAll({
      where: { workspace_id, member_id: member.id, is_active: true },
      order: [["updatedAt", "DESC"]],
    });

    res.status(200).json({ sessions });
  } catch (error) {
    console.error(" Session Fetch Error:", error);
    res.status(500).json({ error: "Failed to fetch sessions" });
  }
};

export const getChatHistory = async (req, res) => {
  try {
    const { session_id, token } = req.body;
    if (!session_id)
      return res.status(400).json({ error: "Session ID required" });

    jwt.verify(token, process.env.JWT_SECRET);

    const history = await Chats.findAll({
      where: { session_id, chat_status: true },
      order: [["createdAt", "ASC"]],
    });

    const formattedHistory = history.flatMap((chat) => [
      { id: `u-${chat.id}`, role: "user", content: chat.query_text },
      { id: `a-${chat.id}`, role: "assistant", content: chat.response_text },
    ]);

    res.status(200).json({ history: formattedHistory });
  } catch (error) {
    console.error("History Error:", error);
    res.status(500).json({ error: "Failed to load history" });
  }
};


export const handleChat = async (req, res) => {
  try {
    const { message, workspace_id, token, session_id } = req.body;
    if (!message || !workspace_id || !token)
      return res.status(400).json({ error: "Missing fields" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const member = await Workspacemembers.findOne({
      where: { workspace_id, user_id: decoded.id },
    });

    if (!member) return res.status(403).json({ error: "Access denied" });


    let currentSessionId = session_id;
    if (!currentSessionId || currentSessionId === "new") {
      const newSession = await ChatSessions.create({
        workspace_id,
        member_id: member.id,
        title: message.substring(0, 35) + (message.length > 35 ? "..." : ""),
      });
      currentSessionId = newSession.id;
    }

    const namespace = index.namespace(`workspace_${workspace_id}`);
    const queryResponse = await namespace.query({
      topK: 3,
      vector: new Array(1024).fill(0.0001), 
      includeMetadata: true,
    });

   
    if (!queryResponse.matches || queryResponse.matches.length === 0) {
      const noDataAnswer =
        "I'm sorry, but I don't have any uploaded documents in this workspace to answer that question.";

      const chatEntry = await Chats.create({
        session_id: currentSessionId,
        member_id: member.id,
        created_by: decoded.id,
        query_text: message,
        response_text: noDataAnswer,
        chat_status: true,
      });

      return res.status(200).json({
        answer: noDataAnswer,
        session_id: currentSessionId,
        chat_id: chatEntry.id,
        sources: [],
      });
    }

 
    const context = queryResponse.matches
      .map((m) => `[File: ${m.metadata?.fileName}]: ${m.metadata?.text}`)
      .join("\n\n");

    
    const aiAnswer = await generateAIResponse(message, context);

   
    const chatEntry = await Chats.create({
      session_id: currentSessionId,
      member_id: member.id,
      created_by: decoded.id,
      query_text: message,
      response_text: aiAnswer,
      chat_status: true,
    });

    res.status(200).json({
      answer: aiAnswer,
      session_id: currentSessionId,
      chat_id: chatEntry.id,
      sources: [
        ...new Set(queryResponse.matches.map((m) => m.metadata?.fileName)),
      ].filter(Boolean),
    });
  } catch (error) {
    console.error(" Chat Error:", error);
    res.status(500).json({ error: "RAG error" });
  }
};


async function generateAIResponse(userMessage, context) {
  try {
    const response = await fetch("http://localhost:11434/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "llama3:latest",
        messages: [
          {
            role: "system",
            content: `You are NeuroVault AI, a strict assistant that ONLY answers questions based on the provided Context.
            
            STRICT RULES:
            1. Use ONLY the provided Context to answer.
            2. If the Context does not contain the answer, say: "I'm sorry, the uploaded documents do not contain information about this."
            3. Do NOT use your own external knowledge or pre-trained facts.
            4. If the user asks general questions (like "Who are you?" or "Hello"), you may identify as NeuroVault AI but remind them you only answer based on documents.`,
          },
          {
            role: "user",
            content: `Context:\n${context}\n\nQuestion: ${userMessage}`,
          },
        ],
        stream: false,
      }),
    });
    const data = await response.json();
    return data.message.content;
  } catch (err) {
    console.error("Ollama Error:", err);
    return "Error reaching Ollama. Please ensure your local AI server is running.";
  }
}
