import jwt from "jsonwebtoken";
import { Op } from "sequelize";
import Workspacemembers from "../models/workspacemember.model.js";
import Users from "../models/user.model.js";
import Workspaces from "../models/workspaces.model.js";
import WorkspaceJoinRequest from "../models/workspace_join_request.model.js";

export const createWorkspaces = async (req, res) => {
  try {
    const {
      token,
      workspace_name,
      workspace_username,
      type: workspaceType,
    } = req.body;

    if (!token) {
      return res.status(400).json({ message: "No token" });
    }

    const data = jwt.verify(token, process.env.JWT_SECRET);
    const id = data.id;

    const type =
      workspaceType === "private" || workspaceType === "public"
        ? workspaceType
        : "public";

    const newworkspace = await Workspaces.create({
      workspace_username,
      workspace_name,
      created_by: id,
      type,
    });

    await Workspacemembers.create({
      workspace_id: newworkspace.id,
      user_id: id,
      role: "admin",
    });

    res.status(201).json({
      message: `${workspace_name} Successfully created`,
    });
  } catch (error) {
    console.log("Create workspace error", error);

    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(400).json({
        message: "Workspace already exists. Please use a different name.",
      });
    }

    if (
      error.name === "JsonWebTokenError" ||
      error.name === "TokenExpiredError"
    ) {
      return res.status(401).json({
        message: "Invalid or expired token",
      });
    }

    res.status(500).json({
      message: "Failed to create workspace",
    });
  }
};

export const getUserWorkspaces = async (req, res) => {
  try {
    const { token, page = 1, limit = 10 } = req.body;

    if (!token) {
      return res.status(400).json({ message: "No token" });
    }

    const data = jwt.verify(token, process.env.JWT_SECRET);
    const id = data.id;

    const offset = (page - 1) * limit;

    const { count, rows } = await Workspacemembers.findAndCountAll({
      where: { user_id: id },
      order: [["id", "DESC"]],
      include: [
        {
          model: Workspaces,
          as: "workspace",
          attributes: ["id", "workspace_name", "type"],
        },
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
    });

    const result = rows.map((item) => ({
      workspace_id: item.workspace_id,
      workspace_name: item.workspace.workspace_name,
      visibility:
        item.workspace.type === "private" ? "private" : "public",
      role: item.role,
      user_id: item.user_id,
    }));

    res.json({
      data: result,
      total: count,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const removeWorkspaceMember = async (req, res) => {
  try {
    const { token, spaceid, targetUserId } = req.body;

    const data = jwt.verify(token, process.env.JWT_SECRET);
    const requesterId = data.id;

   
    const requester = await Workspacemembers.findOne({
      where: { workspace_id: spaceid, user_id: requesterId },
    });

    if (!requester || requester.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Only admins can remove members" });
    }

  
    if (requesterId == targetUserId) {
      return res.status(400).json({ message: "You cannot remove yourself" });
    }

    await Workspacemembers.destroy({
      where: { workspace_id: spaceid, user_id: targetUserId },
    });

    res.json({ message: "Member removed successfully" });
  } catch (error) {
    console.error("Remove member error", error);
    res.status(500).json({ message: "Failed to remove member" });
  }
};

export const getWorkspaceMembers = async (req, res) => {
  try {
    const { token, spaceid } = req.body;
    if (!token || !spaceid)
      return res.status(400).json({ message: "Missing data" });

    jwt.verify(token, process.env.JWT_SECRET);

    const members = await Workspacemembers.findAll({
      where: { workspace_id: spaceid },
      include: [
        {
          model: Users,
          as: "user",
          attributes: ["id", "name", "email", "profilePicUrl", "isCustom"],
        },
      ],
    });

    const result = members.map((member) => ({
      user_id: member.user_id, 
      name: member.user.name,
      email: member.user.email,
      profilePicUrl: member.user.profilePicUrl,
      isCustom: member.user.isCustom,
      role: member.role,
    }));

    res.json({ data: result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getsearchedworkspaces = async (req, res) => {
  try {
    const { search, page = 1, limit = 10, token } = req.body;
    const offset = (page - 1) * limit;

    let userId = null;
    if (token) {
      try {
        const d = jwt.verify(token, process.env.JWT_SECRET);
        userId = d.id;
      } catch {
        userId = null;
      }
    }

    const { count, rows } = await Workspaces.findAndCountAll({
      where: {
        [Op.or]: [
          { workspace_username: { [Op.iLike]: `%${search || ""}%` } },
          { workspace_name: { [Op.iLike]: `%${search || ""}%` } },
        ],
      },
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [["createdAt", "DESC"]],
    });

    const ids = rows.map((r) => r.id);
    let membershipByWs = {};
    let requestByWs = {};

    if (userId && ids.length > 0) {
      const [memberships, joinReqs] = await Promise.all([
        Workspacemembers.findAll({
          where: { user_id: userId, workspace_id: { [Op.in]: ids } },
        }),
        WorkspaceJoinRequest.findAll({
          where: { user_id: userId, workspace_id: { [Op.in]: ids } },
        }),
      ]);
      membershipByWs = Object.fromEntries(
        memberships.map((m) => [m.workspace_id, m.role]),
      );
      requestByWs = Object.fromEntries(
        joinReqs.map((j) => [j.workspace_id, j.status]),
      );
    }

    const data = rows.map((row) => {
      const w = row.get({ plain: true });
      return {
        id: w.id,
        workspace_name: w.workspace_name,
        workspace_username: w.workspace_username,
        visibility: w.type === "private" ? "private" : "public",
        member_role: membershipByWs[w.id] ?? null,
        join_request_status: requestByWs[w.id] ?? null,
      };
    });

    res.json({
      data,
      total: count,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
    });
  } catch (error) {
    console.error("Search Error:", error);
    res.status(500).json({ message: "Search failed" });
  }
};

export const joinWorkspace = async (req, res) => {
  try {
    const { token, workspace_id } = req.body;
    if (!token) {
      return res.status(400).json({ message: "No token" });
    }
    const data = jwt.verify(token, process.env.JWT_SECRET);
    const userId = data.id;

    const ws = await Workspaces.findByPk(workspace_id);
    if (!ws) {
      return res.status(404).json({ message: "Workspace not found" });
    }

    const existing = await Workspacemembers.findOne({
      where: { workspace_id, user_id: userId },
    });

    if (existing) {
      return res.status(400).json({ message: "You are already a member" });
    }

    if (ws.type === "private") {
      const jr = await WorkspaceJoinRequest.findOne({
        where: { workspace_id, user_id: userId },
      });
      if (jr?.status === "pending") {
        return res.status(400).json({ message: "Join request already pending" });
      }
      if (!jr) {
        await WorkspaceJoinRequest.create({
          workspace_id,
          user_id: userId,
          status: "pending",
        });
      } else {
        await jr.update({ status: "pending" });
      }
      return res.status(201).json({
        message: "Request sent to workspace admins for approval",
      });
    }

    await Workspacemembers.create({
      workspace_id,
      user_id: userId,
      role: "member",
    });

    res.status(201).json({ message: "Successfully joined workspace" });
  } catch (error) {
    if (
      error.name === "JsonWebTokenError" ||
      error.name === "TokenExpiredError"
    ) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }
    console.error("joinWorkspace", error);
    res.status(500).json({ message: "Failed to join" });
  }
};

export const getPendingJoinRequests = async (req, res) => {
  try {
    const { token, spaceid } = req.body;
    if (!token || !spaceid) {
      return res.status(400).json({ message: "Missing data" });
    }
    const data = jwt.verify(token, process.env.JWT_SECRET);

    const admin = await Workspacemembers.findOne({
      where: { workspace_id: spaceid, user_id: data.id, role: "admin" },
    });
    if (!admin) {
      return res.status(403).json({ message: "Only admins can view requests" });
    }

    const requests = await WorkspaceJoinRequest.findAll({
      where: { workspace_id: spaceid, status: "pending" },
      include: [
        {
          model: Users,
          as: "user",
          attributes: ["id", "name", "email"],
        },
      ],
      order: [["createdAt", "ASC"]],
    });

    const out = requests.map((r) => ({
      request_id: r.id,
      user_id: r.user_id,
      name: r.user?.name,
      email: r.user?.email,
      createdAt: r.createdAt,
    }));
    res.json({ data: out });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const respondJoinRequest = async (req, res) => {
  try {
    const { token, request_id, decision } = req.body;
    if (!token || !request_id || !["approve", "reject"].includes(decision)) {
      return res.status(400).json({ message: "Invalid request body" });
    }
    const data = jwt.verify(token, process.env.JWT_SECRET);

    const jr = await WorkspaceJoinRequest.findByPk(request_id, {
      include: [
        {
          model: Workspaces,
          as: "workspace",
          attributes: ["id"],
        },
      ],
    });
    if (!jr || jr.status !== "pending") {
      return res.status(404).json({ message: "Request not found" });
    }

    const admin = await Workspacemembers.findOne({
      where: {
        workspace_id: jr.workspace_id,
        user_id: data.id,
        role: "admin",
      },
    });
    if (!admin) {
      return res.status(403).json({ message: "Only admins can respond" });
    }

    if (decision === "reject") {
      await jr.update({ status: "rejected" });
      return res.json({ message: "Join request declined" });
    }

    await Workspacemembers.findOrCreate({
      where: {
        workspace_id: jr.workspace_id,
        user_id: jr.user_id,
      },
      defaults: { role: "member" },
    });

    await jr.update({ status: "approved" });
    res.json({ message: "Member added to workspace" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};