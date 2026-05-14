import React, { useState, useEffect } from "react";
import { useNavigate, Outlet, useLocation } from "react-router-dom";
import {
  MdOutlineUploadFile,
  MdPersonAddAlt1,
  MdMenu,
  MdClose,
} from "react-icons/md";
import { TbMessageChatbot } from "react-icons/tb";
import { HiOutlineDocumentCheck } from "react-icons/hi2";
import { ChevronDown, PlusCircle, MessageSquare } from "lucide-react";
import { API_BASE } from "../../utils/api";

const Workspacearea = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [spacedata, setSpacedata] = useState([]);
  const [role, setRole] = useState("");
  const [isChatDropdownOpen, setIsChatDropdownOpen] = useState(false);
  const [chatSessions, setChatSessions] = useState([]);

  // Unified navigation helper to prevent history bloat
  const safeNavigate = (path) => {
    navigate(path, { replace: true });
    setIsMobileMenuOpen(false);
  };

  const styles = [
    { bg: "bg-blue-500", hover: "hover:bg-blue-600" },
    { bg: "bg-indigo-500", hover: "hover:bg-indigo-600" },
    { bg: "bg-violet-500", hover: "hover:bg-violet-600" },
    { bg: "bg-fuchsia-500", hover: "hover:bg-fuchsia-600" },
  ];

  const fetchSessions = async () => {
    try {
      const response = await fetch(`${API_BASE}/chat/sessions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token: localStorage.getItem("token"),
          workspace_id: localStorage.getItem("spaceid"),
        }),
      });
      const data = await response.json();
      if (response.ok) setChatSessions(data.sessions);
    } catch (error) {
      console.error("Error fetching sessions:", error);
    }
  };

  const fetchWorkspacedata = async () => {
    try {
      const response = await fetch(`${API_BASE}/workspacedata`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token: localStorage.getItem("token"),
          spaceid: localStorage.getItem("spaceid"),
        }),
      });
      const result = await response.json();
      setSpacedata(result);
      setRole(result.role);
    } catch (error) {
      console.error("Error fetching workspace data:", error);
    }
  };

  useEffect(() => {
    fetchWorkspacedata();
    fetchSessions();
  }, []);

  const actions = [
    {
      label: "Upload Document",
      path: "upload",
      icon: <MdOutlineUploadFile size={20} />,
    },
    {
      label: "My Uploads",
      path: "uploads",
      icon: <MdOutlineUploadFile size={20} />,
    },
    { label: "Members", path: "members", icon: <TbMessageChatbot size={20} /> },
    ...(role === "admin"
      ? [
          {
            label: "Join requests",
            path: "joinrequests",
            icon: <MdPersonAddAlt1 size={20} />,
          },
          {
            label: "Pending approvals",
            path: "approvals",
            icon: <HiOutlineDocumentCheck size={20} />,
          },
          {
            label: "All Approved Documents",
            path: "allapproved",
            icon: <HiOutlineDocumentCheck size={20} />,
          },
        ]
      : []),
  ];

  const stats = [
    {
      label: "My uploads",
      value: `${(spacedata?.countDocPending || 0) + (spacedata?.countDocApproved || 0)}`,
    },
    { label: "Members", value: `${spacedata?.countmembers || 0}` },
    { label: "Pending", value: `${spacedata?.countDocPending || 0}` },
    { label: "Approved", value: `${spacedata?.countDocApproved || 0}` },
  ];

  const isActive = (path) => location.pathname.includes(path);

  return (
    <div className="text-white w-full relative">
      {/* MOBILE HEADER */}
      <div className="md:hidden flex items-center justify-between mb-4 bg-[#1a1c23] p-4 rounded-xl border border-white/5">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 bg-white/5 rounded-lg text-blue-400"
          >
            {isMobileMenuOpen ? <MdClose size={24} /> : <MdMenu size={24} />}
          </button>
          <h1 className="font-bold truncate max-w-[150px]">
            {spacedata?.workspacename || "Workspace"}
          </h1>
        </div>
        <span
          className={`nv-pill text-[9px] ${role === "admin" ? "nv-pill-purple" : "nv-pill-blue"}`}
        >
          {role}
        </span>
      </div>

      {/* DESKTOP HEADER */}
      <div className="hidden md:flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-white/90">
            {spacedata?.workspacename || "Workspace"}
          </h1>
          <p className="text-xs text-white/40 mt-1">
            Manage documents, members, and AI tools
          </p>
        </div>
        <span
          className={`nv-pill text-[10px] font-bold uppercase tracking-[0.18em] ${role === "admin" ? "nv-pill-purple" : "nv-pill-blue"}`}
        >
          {role}
        </span>
      </div>

      {/* STATS GRID */}
      <div className="flex md:grid md:grid-cols-4 gap-3 mb-6 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
        {stats.map((item, index) => (
          <div
            key={index}
            className={`${styles[index % styles.length].bg} p-4 md:p-6 min-w-[140px] md:min-w-0 rounded-xl flex flex-col items-center justify-center text-center shrink-0`}
          >
            <p className="text-[9px] uppercase tracking-widest font-bold text-white/70 mb-1">
              {item.label}
            </p>
            <h2 className="text-xl md:text-3xl font-light text-white">
              {item.value}
            </h2>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-12 gap-6 min-h-[60vh] relative">
        {/* SIDEBAR */}
        <div
          className={`
          fixed inset-0 z-50 transform transition-transform duration-300 ease-in-out bg-[#1a1c23]/95 backdrop-blur-md p-6
          md:relative md:inset-auto md:z-0 md:translate-x-0 md:bg-[#21242d] md:p-4 md:col-span-3 md:rounded-2xl
          ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
        `}
        >
          <div className="flex items-center justify-between md:hidden mb-8">
            <h2 className="text-xs font-black uppercase tracking-[0.2em]">
              Menu
            </h2>
            <button onClick={() => setIsMobileMenuOpen(false)}>
              <MdClose size={24} />
            </button>
          </div>

          <h2 className="hidden md:block text-[10px] font-black uppercase tracking-[0.2em] mb-6 px-3">
            Workspace Actions
          </h2>

          <div className="flex flex-col gap-1 overflow-y-auto max-h-[80vh] md:max-h-none">
            {/* CHAT DROPDOWN */}
            <div className="flex flex-col mb-2">
              <button
                onClick={() => setIsChatDropdownOpen(!isChatDropdownOpen)}
                className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all ${isActive("chatbot") ? "bg-blue-600 shadow-lg shadow-blue-600/20" : "text-white/50 hover:bg-white/5"}`}
              >
                <div className="flex items-center gap-3">
                  <TbMessageChatbot
                    size={20}
                    className={
                      isActive("chatbot") ? "text-white" : "text-blue-400"
                    }
                  />
                  <span className="text-sm md:text-[13px] font-semibold">
                    Chat with AI
                  </span>
                </div>
                <ChevronDown
                  size={16}
                  className={`transition-transform ${isChatDropdownOpen ? "rotate-180" : ""}`}
                />
              </button>

              {isChatDropdownOpen && (
                <div className="mt-2 ml-4 flex flex-col gap-1 border-l border-white/10 pl-2">
                  <button
                    onClick={() => safeNavigate("chatbot/new")}
                    className="flex items-center gap-2 p-3 md:p-2 text-xs text-blue-400 hover:bg-blue-400/10 rounded-lg"
                  >
                    <PlusCircle size={14} /> New Chat
                  </button>
                  <div className="flex flex-col gap-1 h-[140px] overflow-y-auto pr-1 custom-scrollbar">
                    {chatSessions.map((session) => (
                      <button
                        key={session.id}
                        onClick={() => safeNavigate(`chatbot/${session.id}`)}
                        className={`flex items-center gap-2 p-3 md:p-2 text-[12px] md:text-[11px] rounded-lg truncate ${location.pathname.includes(session.id) ? "bg-white/10" : "text-white/40 hover:bg-white/5"}`}
                      >
                        <MessageSquare size={12} className="shrink-0" />
                        <span className="truncate">{session.title}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* ACTION BUTTONS */}
            {actions.map((action, index) => (
              <button
                key={index}
                onClick={() => safeNavigate(action.path)}
                className={`flex items-center gap-3 px-4 py-4 md:py-3 rounded-xl transition-all ${isActive(action.path) ? "bg-blue-600" : "text-white/50 hover:bg-white/5"}`}
              >
                <div
                  className={
                    isActive(action.path) ? "text-white" : "text-white/30"
                  }
                >
                  {action.icon}
                </div>
                <span className="text-sm md:text-[13px] font-semibold">
                  {action.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* MAIN CONTENT AREA */}
        <div className="col-span-12 md:col-span-9 bg-[#21242d] rounded-2xl min-h-[60vh] md:h-[65vh] flex flex-col">
          <div className="flex-1 min-h-0">
            <Outlet context={{ role, refreshSessions: fetchSessions }} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Workspacearea;
