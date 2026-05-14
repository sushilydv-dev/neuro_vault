import { Router } from "express";
import {
  logIn,
  signUp,
  verify,
  getProfile,
} from "../controller/authen.controller.js";
import {
  getDashInfo,
  getWorkspaceData,
  getConnections,
} from "../controller/dashinfo.controller.js";
import {
  getUserWorkspaces,
  getWorkspaceMembers,
  createWorkspaces,
  removeWorkspaceMember,
  getsearchedworkspaces,
  joinWorkspace,
  getPendingJoinRequests,
  respondJoinRequest,
} from "../controller/workspacemanage.controller.js";
import {
  uploadDocument,
  getDocuments,
  getUserUploadedDocuments,
  approveDocument,
  rejectDocument,
  getApprovedDocuments,
} from "../controller/document.controller.js";

import {
  handleChat,
  getChatHistory,
  getSessions,
} from "../controller/chat.controller.js";

import upload from "../config/multer.js";
import uploadAvatar from "../config/multerAvatar.js";
import {
  listPresetProfilePics,
  setPresetProfilePic,
  uploadCustomProfilePic,
} from "../controller/profile.controller.js";

export const authRouter = Router();

// --- Authentication ---
authRouter.post("/signup", signUp);
authRouter.post("/login", logIn);
authRouter.get("/verify", verify);
authRouter.get("/me", getProfile);

// --- Profile Picture ---
authRouter.get("/profile/preset-pics", listPresetProfilePics);
authRouter.post("/profile/preset-pics/select", setPresetProfilePic);
authRouter.post(
  "/profile/avatar",
  uploadAvatar.single("file"),
  uploadCustomProfilePic,
);

// --- Dashboard & Analytics ---
authRouter.post("/dashinfo", getDashInfo);
authRouter.post("/connections", getConnections);

// --- Workspace Management ---
authRouter.post("/workspaces", getUserWorkspaces);
authRouter.post("/workspacedata", getWorkspaceData);
authRouter.post("/createworkspace", createWorkspaces);
authRouter.post("/workspacemembers", getWorkspaceMembers);
authRouter.post("/removemember", removeWorkspaceMember);
authRouter.post("/searchworkspaces", getsearchedworkspaces);
authRouter.post("/joinworkspace", joinWorkspace);
authRouter.post("/pending-join-requests", getPendingJoinRequests);
authRouter.post("/respond-join-request", respondJoinRequest);

// --- Document & Knowledge Base ---
authRouter.post("/uploads", upload.single("file"), uploadDocument);
authRouter.post("/documents", getDocuments);
authRouter.post("/myupload-docs", getUserUploadedDocuments);
authRouter.post("/approve", approveDocument);
authRouter.post("/reject-document", rejectDocument);
authRouter.post("/allapproveddocs", getApprovedDocuments);

// --- Chat & Sessions ---
authRouter.post("/chat/sessions", getSessions); 
authRouter.post("/chat/history", getChatHistory); 
authRouter.post("/chat/query", handleChat); 
