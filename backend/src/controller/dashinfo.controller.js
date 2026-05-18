import Workspacemembers from "../models/workspacemember.model.js";
import Workspaces from "../models/workspaces.model.js";
import Users from "../models/user.model.js";
import Documents from "../models/document.js";
import jwt from "jsonwebtoken";
import { where } from "sequelize";

export const getDashInfo = async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ message: "No token" });
    }

    const data = jwt.verify(token, process.env.JWT_SECRET);
    const id = data.id;

    const [
      user,
      workspaceCount,
      countadmin,
      memberCount,
      documentCount,
      documentCountPending,
      documentCountApproved,
    ] = await Promise.all([
      Users.findOne({
        where: { id },
        attributes: ["name", "email"],
      }),

      Workspaces.count({
        where: { created_by: id },
      }),

      Workspacemembers.count({
        where: {
          role: "admin",
          user_id: id,
        },
      }),

      Workspacemembers.count({
        where: {
          role: "member",
          user_id: id,
        },
      }),

      Documents.count({
        where: {
          uploaded_by: id,
        },
      }),

      Documents.count({
        where: {
          uploaded_by: id,
          status: "pending",
        },
      }),

      Documents.count({
        where: {
          uploaded_by: id,
          status: "approoved",
        },
      }),
    ]);

    res.json({
      id: id,
      name: user.name,
      workspaceCount: workspaceCount,
      countadmin: countadmin,
      memberCount: memberCount,
      documentCount: documentCount,
      email: user.email,
      documentCountPending: documentCountPending,
      documentCountApproved: documentCountApproved,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
export const getWorkspaceData = async (req, res) => {
  try {
    const { token } = req.body;
    const { spaceid } = req.body;
    if (!token) {
      return res.status(400).json({ message: "No token" });
    }
    const data = jwt.verify(token, process.env.JWT_SECRET);
    const user = await Users.findOne({ where: { id: data.id } });
    const id = data.id;
    const workspacename = await Workspaces.findOne({
      where: { id: spaceid },
    });

    const Role = await Workspacemembers.findOne({
      where: {
        workspace_id: spaceid,
        user_id: id,
      },
    });
    const countmembers = await Workspacemembers.count({
      where: {
        workspace_id: spaceid,
      },
    });

    const countDocApproved = await Documents.count({
      where: {
        uploaded_by: id,
        status: "approved",
        workspace_id: spaceid,
      },
    });
    const countDocPending = await Documents.count({
      where: {
        uploaded_by: id,
        status: "pending",
        workspace_id: spaceid,
      },
    });

    res.json({
      workspacename: workspacename.workspace_name,
      countmembers: countmembers,
      countDocApproved: countDocApproved,
      countDocPending: countDocPending,
      role: Role.role,
    });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
export const getConnections = async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ message: "No token" });
    }

    const data = jwt.verify(token, process.env.JWT_SECRET);
    const userId = data.id;

    const memberships = await Workspacemembers.findAll({
      where: { user_id: userId },
      attributes: ["workspace_id"],
    });

    const workspaceIds = memberships.map((m) => m.workspace_id);

    const connections = await Workspacemembers.findAll({
      where: {
        workspace_id: workspaceIds,
      },
      attributes: ["user_id", "workspace_id"],
    });

    const userIds = [
      ...new Set(
        connections.map((c) => c.user_id).filter((id) => id !== userId),
      ),
    ];

    const users = await Users.findAll({
      where: { id: userIds },
      attributes: ["id", "name", "email", "profilePicUrl", "isCustom"],
    });

    res.json(users);
  } catch (error) {
    console.error("Get connections error:", error);
    res.status(500).json({ error: "Failed to fetch connections" });
  }
};
