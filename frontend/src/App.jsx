import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./components/AuthContext";
import RequireAuth from "./components/RequireAuth";

import Dashboard from "./coreui/views/dashboard/Dashboard";
import { Homepage } from "./components/Homepage";
import Signup from "./components/forms/Signup";
import Login from "./components/forms/Login";

import Workspace from "./components/worksapce/Worspace";
import Userworkspaces from "./components/worksapce/Userworkspaces";
import { Approvals } from "./components/worksapce/Approvals";
import FileUpload from "./components/worksapce/Fileupload";
import ChatArea from "./components/worksapce/Chatarea";
import { Myuploads } from "./components/worksapce/Myuploads";
import { Members } from "./components/worksapce/Members";
import { Createworkspace } from "./components/worksapce/Createworkspace";
import { Allapproved } from "./components/worksapce/Allapproved";
import Workspacearea from "./components/worksapce/Workspacearea";
import Connections from "./components/worksapce/Connections";
import { Chatmembers } from "./components/worksapce/Chatmembers";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Searchworkspaces } from "./components/worksapce/Searchworkspaces";
import Joinrequests from "./components/worksapce/Joinrequests";
const PublicOnlyRoute = ({ children }) => {
  const { status } = useAuth();

  if (status === "checking") return null;

  if (status === "authenticated") {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

const App = () => {
  return (
    <>
      <Routes>
        <Route
          path="/signup"
          element={
            <PublicOnlyRoute>
              <Signup />
            </PublicOnlyRoute>
          }
        />
        <Route
          path="/login"
          element={
            <PublicOnlyRoute>
              <Login />
            </PublicOnlyRoute>
          }
        />

        <Route
          path="/dashboard"
          element={
            <RequireAuth>
              <Workspace />
            </RequireAuth>
          }
        >
          <Route index element={<Dashboard />} />

          <Route path="workspaces" element={<Userworkspaces />} />
          <Route path="createworkspace" element={<Createworkspace />} />
          <Route path="searchworkspaces" element={<Searchworkspaces/>} />
          <Route path="connections" element={<Connections />} />
          <Route path="workspacearea/:id" element={<Workspacearea />}>
            <Route index element={<ChatArea />} />
            <Route path="chatbot" element={<ChatArea />} />
            <Route path="chatbot/:sessionId" element={<ChatArea />} />
            <Route path="chatmembers" element={<Chatmembers />} />
            <Route path="upload" element={<FileUpload />} />
            <Route path="uploads" element={<Myuploads />} />
            <Route path="members" element={<Members />} />
            <Route path="approvals" element={<Approvals />} />
            <Route path="joinrequests" element={<Joinrequests />} />
            <Route path="allapproved" element={<Allapproved />} />
          </Route>
        </Route>

        <Route
          path="/"
          element={
            <PublicOnlyRoute>
              <Homepage />
            </PublicOnlyRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <ToastContainer position="top-right" />
    </>
  );
};

export default App;
