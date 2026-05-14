import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Documents = sequelize.define(
  "documents",
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

    uploaded_by: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    file_name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },

    file_url: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    file_path: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },

    status: {
      type: DataTypes.STRING(10),
      defaultValue: "pending",
    },
  },
  {
    timestamps: true,
    underscored: true,
  },
);

export default Documents;
