import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const ChatSessions = sequelize.define(
  "chat_sessions",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    member_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    workspace_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "workspaces",
        key: "id",
      },
    },
    title: {
      type: DataTypes.STRING(255),
      defaultValue: "New Chat",
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    timestamps: true,
    underscored: true,
    tableName: "chat_sessions",
  },
);

export default ChatSessions;
