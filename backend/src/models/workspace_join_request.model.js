import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const WorkspaceJoinRequest = sequelize.define(
  "workspace_join_request",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    workspace_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("pending", "approved", "rejected"),
      allowNull: false,
      defaultValue: "pending",
    },
  },
  {
    tableName: "workspace_join_requests",
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ["workspace_id", "user_id"],
        name: "unique_workspace_join_user",
      },
    ],
  },
);

export default WorkspaceJoinRequest;
