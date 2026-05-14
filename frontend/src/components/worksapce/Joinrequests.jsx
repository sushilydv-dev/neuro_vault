import React, { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { API_BASE } from "../../utils/api";

export default function Joinrequests() {
  const { role } = useOutletContext();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    try {
      const res = await fetch(`${API_BASE}/pending-join-requests`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token: localStorage.getItem("token"),
          spaceid: localStorage.getItem("spaceid"),
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Failed to load requests");
      setRequests(json.data || []);
    } catch (e) {
      console.error(e);
      setRequests([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const respond = async (requestId, decision) => {
    try {
      const res = await fetch(`${API_BASE}/respond-join-request`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token: localStorage.getItem("token"),
          request_id: requestId,
          decision,
        }),
      });
      const data = await res.json();
      alert(data.message || (res.ok ? "Done" : "Failed"));
      if (res.ok) fetchRequests();
    } catch (err) {
      alert("Could not update request");
    }
  };

  if (role !== "admin") {
    return (
      <div className="p-4 text-white/50 text-sm">Admin access required.</div>
    );
  }

  return (
    <div className="w-full bg-[#111216] text-[#e1e1e1] font-sans rounded-2xl  overflow-hidden ">
      <div className="px-6 py-4 border-b border-white/5">
        <h2 className="text-lg font-semibold text-white">
          Workspace join requests
        </h2>
        <p className="text-xs text-white/40 mt-1">
          Approve or decline access for private workspaces
        </p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/5">
              <th className="px-6 py-3 text-[11px] font-medium text-white/40 uppercase">
                #
              </th>
              <th className="px-6 py-3 text-[11px] font-medium text-white/40 uppercase">
                Name
              </th>
              <th className="px-6 py-3 text-[11px] font-medium text-white/40 uppercase">
                Email
              </th>
              <th className="px-6 py-3 text-[11px] font-medium text-white/40 uppercase text-right">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {loading ? (
              <tr>
                <td colSpan={4} className="py-16 text-center">
                  <div className="inline-block w-5 h-5 border-2 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
                </td>
              </tr>
            ) : requests.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="py-14 text-center text-white/25 text-[11px] uppercase tracking-[0.2em]"
                >
                  No pending requests
                </td>
              </tr>
            ) : (
              requests.map((row, idx) => (
                <tr key={row.request_id}>
                  <td className="px-6 py-4 text-[13px] text-white/40 font-mono">
                    {String(idx + 1).padStart(2, "0")}
                  </td>
                  <td className="px-6 py-4 text-[13px] font-medium">{row.name}</td>
                  <td className="px-6 py-4 text-[13px] text-white/60">
                    {row.email}
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <button
                      type="button"
                      onClick={() => respond(row.request_id, "reject")}
                      className="px-3 py-1.5 rounded-lg text-[11px] font-semibold border border-rose-500/30 text-rose-300 hover:bg-rose-500/10 transition"
                    >
                      Reject
                    </button>
                    <button
                      type="button"
                      onClick={() => respond(row.request_id, "approve")}
                      className="px-3 py-1.5 rounded-lg text-[11px] font-semibold bg-emerald-600 text-white hover:bg-emerald-500 transition"
                    >
                      Accept
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
