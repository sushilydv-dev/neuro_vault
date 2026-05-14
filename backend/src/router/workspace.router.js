import { Router } from "express";
import { createWorkspace } from "../controller/workspaces.controller.js";
import { getDashInfo } from "../controller/dashinfo.controller.js";
import { getDashboard } from "../controller/dashboard.controller.js";
import { getUserWorkspaces } from "../controller/workspacemanage.controller.js";
export const authRouter = Router();

authRouter.get("/dashboard", authMiddleware, getDashboard);
authRouter.post("/dashinfo", authMiddleware, getDashInfo);
authRouter.post("/workspaces", authMiddleware, getUserWorkspaces);
