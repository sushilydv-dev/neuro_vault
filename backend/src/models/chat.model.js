import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Chats = sequelize.define(
  "chats",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
  
    session_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "chat_sessions", 
        key: "id",
      },
    },
    member_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    query_text: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    response_text: {
      type: DataTypes.TEXT,
      allowNull: false,
    },

    chat_status: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    timestamps: true,
    underscored: true,
    freezeTableName: true,
    tableName: "chats",
  },
);

export default Chats;
