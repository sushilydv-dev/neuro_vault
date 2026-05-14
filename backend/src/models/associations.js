import Workspaces from "./workspaces.model.js";
import Workspacemembers from "./workspacemember.model.js";
import Documents from "./document.js";
import Users from "./user.model.js";
import WorkspaceJoinRequest from "./workspace_join_request.model.js";
import Chats from "./chat.model.js";
import ChatSessions from "./chatsession.js";
Workspacemembers.belongsTo(Workspaces, {
  foreignKey: "workspace_id",
  as: "workspace",
});

Workspaces.hasMany(Workspacemembers, {
  foreignKey: "workspace_id",
});
Workspacemembers.belongsTo(Users, {
  foreignKey: "user_id",
  targetKey: "id",
  as: "user",
});
Documents.belongsTo(Users, {
  foreignKey: "uploaded_by",
  as: "user",
});

WorkspaceJoinRequest.belongsTo(Users, {
  foreignKey: "user_id",
  as: "user",
});

WorkspaceJoinRequest.belongsTo(Workspaces, {
  foreignKey: "workspace_id",
  as: "workspace",
});

Workspaces.hasMany(WorkspaceJoinRequest, {
  foreignKey: "workspace_id",
  as: "joinRequests",
});

ChatSessions.hasMany(Chats, { foreignKey: "session_id", as: "messages" });


Chats.belongsTo(ChatSessions, { foreignKey: "session_id" });
