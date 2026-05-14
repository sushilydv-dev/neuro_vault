import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Workspaces = sequelize.define(
  "workspaces",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    workspace_name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        len: [1, 100],
      },
    },
    workspace_username: {
      type: DataTypes.STRING(200),
      allowNull: false,
      unique: true,
    },
  
    type: {
      type: DataTypes.ENUM("public", "private"),
      allowNull: false,
      defaultValue: "public",
    },
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
    },
    updatedAt: {
      type: DataTypes.DATE,
    },
  },
  {
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ["workspace_name", "created_by"],
        name: "unique_user_workspace",
      },
    ],
  },
);

export default Workspaces;
