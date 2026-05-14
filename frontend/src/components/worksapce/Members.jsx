import React, { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import AvatarPreview from "../AvatarPreview";
import { resolveAvatarUrl } from "../../utils/avatar";
import { API_BASE } from "../../utils/api";

export const Members = () => {
  const [workspacemembers, setWorkspacemembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { role } = useOutletContext();
  const [previewUserId, setPreviewUserId] = useState(null);

  const fetchMembers = async () => {
    try {
      const response = await fetch(`${API_BASE}/workspacemembers`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token: localStorage.getItem("token"),
          spaceid: localStorage.getItem("spaceid"),
        }),
      });
      const result = await response.json();
      setWorkspacemembers(result.data || []);
    } catch (error) {
      console.error("Error fetching members:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const handleRemove = async (targetUserId) => {
    if (!window.confirm("Are you sure you want to remove this member?")) return;
    try {
      const response = await fetch(`${API_BASE}/removemember`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token: localStorage.getItem("token"),
          spaceid: localStorage.getItem("spaceid"),
          targetUserId: targetUserId,
        }),
      });
      if (response.ok) fetchMembers();
    } catch (err) {
      console.error("Remove request failed", err);
    }
  };

  return (
    <>
    <div className="w-full bg-[#111216] text-[#e1e1e1] font-sans">
      

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/5">
              <th className="px-6 py-3 text-[11px] font-medium text-white/40 uppercase tracking-tight">
                Index
              </th>
              <th className="px-6 py-3 text-[11px] font-medium text-white/40 uppercase tracking-tight">
                Member Name
              </th>
              <th className="px-6 py-3 text-[11px] font-medium text-white/40 uppercase tracking-tight">
                Access Level
              </th>
              {role === "admin" && (
                <th className="px-6 py-3 text-[11px] font-medium text-white/40 uppercase tracking-tight text-right">
                  Action
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {loading ? (
              <tr>
                <td
                  colSpan={role === "admin" ? 4 : 3}
                  className="py-20 text-center"
                >
                  <div className="inline-block w-5 h-5 border-2 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
                </td>
              </tr>
            ) : (
              workspacemembers.map((member, index) => (
                <tr
                  key={index}
                  className="group hover:bg-white/[0.02] transition-colors"
                >
                  <td className="px-6 py-4 text-[13px] text-white/40 font-mono">
                    {String(index + 1).padStart(2, "0")}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => setPreviewUserId(member.user_id)}
                        className="shrink-0 rounded-xl overflow-hidden ring-1 ring-white/10 hover:ring-white/20 transition"
                        title="View profile photo"
                      >
                        <img
                          src={resolveAvatarUrl({
                            profilePicUrl: member.profilePicUrl,
                            seed:
                              member.user_id ??
                              member.email ??
                              member.name ??
                              String(index),
                          })}
                          alt={member.name}
                          className="w-9 h-9 object-cover"
                        />
                      </button>
                      <div className="min-w-0">
                        <p className="text-[13px] font-medium text-white/90 truncate">
                          {member.name}
                        </p>
                        {member.email && (
                          <p className="text-[11px] text-white/40 truncate">
                            {member.email}
                          </p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div
                      className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold border ${
                        member.role === "admin"
                          ? "bg-purple-500/10 border-purple-500/20 text-purple-400"
                          : "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                      }`}
                    >
                      {member.role === "admin" ? "Admin" : "Member"}
                    </div>
                  </td>
                  {role === "admin" && (
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleRemove(member.user_id)}
                        className="
      inline-flex items-center gap-2 
      px-3 py-1.5 rounded-lg
      text-[11px] font-black uppercase tracking-widest
      text-rose-400 border border-rose-500/20
      transition-all duration-200
      hover:bg-red-600 hover:text-white hover:border-transparent 
      hover:scale-102 active:scale-95
      hover:shadow-[0_0_15px_rgba(225,29,72,0.2)]
    "
                      >
                        <svg
                          className="w-3.5 h-3.5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2.5"
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                        Remove
                      </button>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
    {previewUserId != null && (
      <AvatarPreview
        people={workspacemembers.map((m) => ({
          id: m.user_id,
          name: m.name,
          email: m.email,
          profilePicUrl: m.profilePicUrl,
        }))}
        initialPersonId={previewUserId}
        onClose={() => setPreviewUserId(null)}
        title="Members"
      />
    )}
    </>
  );
};

export default Members;
