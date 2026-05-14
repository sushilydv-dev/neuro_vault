import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  CContainer,
  CHeader,
  CHeaderNav,
  CHeaderToggler,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { cilMenu } from "@coreui/icons";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import { useLayout } from "../LayoutContext";
import userprofile from "../../assets/userprofile.jpg";
import { useAuth } from "../../components/AuthContext";
import { ProfileAvatarModal } from "../../components/ProfileAvatarModal.jsx";
import { resolveAvatarUrl as getAvatarUrl } from "../../utils/avatar";
import { API_BASE } from "../../utils/api";

const AppHeader = () => {
  const headerRef = useRef();
  const dropdownRef = useRef();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const { logout } = useAuth();
  const [user, setUser] = useState({
    name: "",
    email: "",
    avatar: userprofile,
    joinedDate: "—",
    profilePicUrl: null,
  });
  const { sidebarShow, setSidebarShow } = useLayout();

  const loadProfile = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const res = await fetch(`${API_BASE}/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) return;
      const data = await res.json();
      const joined =
        data.createdAt != null
          ? new Date(data.createdAt).toLocaleDateString(undefined, {
              month: "long",
              day: "numeric",
              year: "numeric",
            })
          : "—";
      setUser({
        name: data.name || "User",
        email: data.email || "",
        avatar: getAvatarUrl({
          profilePicUrl: data.profilePicUrl,
          seed: data.id ?? data.email ?? data.name,
        }),
        joinedDate: joined,
        profilePicUrl: data.profilePicUrl || null,
      });
    } catch {
      /* keep state */
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      await loadProfile();
    })();
    return () => {
      cancelled = true;
    };
  }, [loadProfile]);

  const handleAvatarSaved = useCallback(
    (newRelativeUrl) => {
      setUser((prev) => ({
        ...prev,
        profilePicUrl: newRelativeUrl,
        avatar: getAvatarUrl({
          profilePicUrl: newRelativeUrl,
          seed: prev.email ?? prev.name,
        }),
      }));
    },
    [],
  );

  useEffect(() => {
    const handleScroll = () => {
      headerRef.current &&
        headerRef.current.classList.toggle(
          "shadow-sm",
          document.documentElement.scrollTop > 0,
        );
    };
    document.addEventListener("scroll", handleScroll);
    return () => document.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    window.location.href = "/login";
  };

  return (
    <>
      <CHeader
        position="sticky"
        className="mb-2 p-0 bg-[#121316]/75 backdrop-blur-xl border-b border-white/5"
        ref={headerRef}
      >
        <CContainer
          className="px-4 h-12 flex items-center justify-between"
          fluid
        >
          <CHeaderToggler
            onClick={() => setSidebarShow(!sidebarShow)}
            className="hover:bg-white/5 rounded-lg p-2 transition-colors"
          >
            <CIcon icon={cilMenu} size="lg" className="text-white/70" />
          </CHeaderToggler>

          <CHeaderNav className="flex items-center gap-4">
            <div className="relative" ref={dropdownRef}>
              <div
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-3 p-1.5 pl-2 pr-2 rounded-2xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.05] hover:border-white/10 transition-all cursor-pointer group"
              >
                <div className="relative">
                  <img
                    src={user.avatar}
                    alt="User"
                    className="w-9 h-9 rounded-xl object-cover ring-1 ring-white/5 shadow-inner"
                  />
                  <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 border-2 border-[#121316] rounded-full"></div>
                </div>

                <div className="hidden md:flex flex-col leading-tight select-none">
                  <span className="text-[13px] font-semibold text-white">
                    {user.name}
                  </span>
                  <span className="text-[11px] text-white">{user.email}</span>
                </div>

                <MdOutlineKeyboardArrowDown
                  className={`text-white/40 text-xl transition-transform duration-300 ${dropdownOpen ? "rotate-180" : ""}`}
                />
              </div>

              {dropdownOpen && (
                <div className="absolute right-0 mt-3 w-[min(18rem,92vw)] nv-bento nv-bento-rim p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200 bg-black/80 flex flex-col">
                <div className="block md:hidden p-3 bg-white/[0.03] rounded-xl border border-white/5 mb-2">
                    <p className="text-[10px] uppercase tracking-wider text-white/30 font-bold mb-1">
                      Profile
                    </p>
                    <p className="text-sm font-semibold text-white truncate">
                      {user.name}
                    </p>
                    <p className="text-xs text-white/40 truncate">
                      {user.email}
                    </p>
                  </div>

                <div className="p-3 bg-white/[0.03] rounded-xl border border-white/5 mb-2">
                    <p className="text-[10px] uppercase tracking-wider text-white font-bold mb-1">
                      Account Info
                    </p>
                    <p className="text-xs text-white">
                      Joined:{" "}
                      <span className="text-white">{user.joinedDate}</span>
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setShowAvatarModal(true);
                      setDropdownOpen(false);
                    }}
                    className="mb-2 w-full text-left p-2.5 rounded-xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.06] text-sm text-white transition"
                  >
                    Change profile photo
                  </button>

                  <button
                    onClick={handleLogout}
                    className="flex items-center justify-between w-full p-2 rounded-[10px] bg-red-500 hover:bg-red-700 text-white transition-all group border border-white/5"
                  >
                    <span className="text-sm font-medium">Logout</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="2.5"
                      stroke="currentColor"
                      className="w-4 h-4"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75"
                      />
                    </svg>
                  </button>
                </div>
              )}
            </div>
          </CHeaderNav>
        </CContainer>
      </CHeader>

      {showAvatarModal && (
        <ProfileAvatarModal
          onClose={() => setShowAvatarModal(false)}
          onSaved={handleAvatarSaved}
        />
      )}
    </>
  );
};

export default AppHeader;
