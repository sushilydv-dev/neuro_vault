import React, { useState, useEffect, useCallback } from "react";
import { API_BASE } from "../../utils/api";

export const Searchworkspaces = () => {
  const [workspaces, setWorkspaces] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  const fetchWorkspaces = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/searchworkspaces`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          search,
          token: localStorage.getItem("token"),
          page,
          limit,
        }),
      });
      const result = await response.json();
      setWorkspaces(result.data || []);
      setTotalPages(result.totalPages || 1);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [search, page, limit]);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchWorkspaces();
    }, 500);
    return () => clearTimeout(delayDebounce);
  }, [search, page, limit, fetchWorkspaces]);

  const handleJoin = async (workspaceId) => {
    try {
      const res = await fetch(`${API_BASE}/joinworkspace`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token: localStorage.getItem("token"),
          workspace_id: workspaceId,
        }),
      });
      const data = await res.json();
      alert(data.message);
      if (res.ok) fetchWorkspaces();
    } catch (err) {
      alert("Error joining workspace");
    }
  };

  const actionForRow = (ws) => {
    if (ws.member_role) {
      return (
        <span className="text-emerald-400 text-sm font-medium">
          Joined
          
        </span>
      );
    }
    if (ws.join_request_status === "pending") {
      return (
        <span className="text-amber-400 text-sm font-medium">
          Request pending
        </span>
      );
    }
    if (ws.join_request_status === "rejected") {
      return (
        <div className="flex flex-col items-end gap-1 md:flex-row md:items-center md:justify-end md:gap-2">
          <span className="text-rose-400 text-xs font-medium">
            Request declined
          </span>
          <button
            type="button"
            onClick={() => handleJoin(ws.id)}
            className="bg-white/10 hover:bg-white/15 px-3 py-1.5 rounded-lg text-xs transition"
          >
            Request again
          </button>
        </div>
      );
    }
    return (
      <button
        type="button"
        onClick={() => handleJoin(ws.id)}
        className="bg-blue-600 hover:bg-blue-500 px-4 py-1.5 rounded-lg text-sm transition"
      >
        {ws.visibility === "private" ? "Request access" : "Join"}
      </button>
    );
  };

  return (
    <div className="text-white p-4">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-[2rem] font-bold tracking-tight">
           Find Workspaces
          </h1>
          <p className="text-n-3 text-sm mt-1">
            Join a workspace and start collaborating And Start Collaborating
          </p>
        </div>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by username or name"
          className="bg-white/5 border border-white/10 p-2 rounded-lg w-full md:w-64 text-[.7rem]"
        />
      </div>

      <div className="flex justify-end mb-4">
        <select
          value={limit}
          onChange={(e) => {
            setLimit(Number(e.target.value));
            setPage(1);
          }}
          className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-white/10"
        >
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={30}>30</option>
        </select>
      </div>

      <div className="nv-bento nv-bento-rim overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-white/40 text-sm">
            Searching…
          </div>
        ) : (
          <table className="w-full text-left">
            <thead className="border-b border-white/10 text-xs text-white/40 uppercase">
              <tr>
                <th className="p-4">Name</th>
                <th className="p-4">Username</th>
                <th className="p-4">Visibility</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {workspaces.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="p-8 text-center text-white/35 text-sm"
                  >
                    No workspaces match your search.
                  </td>
                </tr>
              ) : (
                workspaces.map((ws) => (
                  <tr
                    key={ws.id}
                    className="border-b border-white/5 hover:bg-white/5"
                  >
                    <td className="p-4 font-semibold">{ws.workspace_name}</td>
                    <td className="p-4 text-blue-400">
                      @{ws.workspace_username}
                    </td>
                    <td className="p-4">
                      <span
                        className={`text-xs font-semibold px-2 py-1 rounded ${
                          ws.visibility === "private"
                            ? "bg-violet-500 text-white"
                            : "bg-emerald-500 text-white"
                        }`}
                      >
                        {ws.visibility === "private" ? "Private" : "Public"}
                      </span>
                    </td>
                    <td className="p-4 text-right">{actionForRow(ws)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      {!loading && workspaces.length > 0 && (
        <div className="flex justify-center items-center gap-2 mt-6 flex-wrap">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="px-3 py-1 rounded-md border bg-white/5 border-white/10 disabled:opacity-40 hover:bg-white/10 transition-colors"
          >
            Prev
          </button>
          <span className="text-xs text-white/40 px-2">
            Page {page} / {totalPages}
          </span>
          <button
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="px-3 py-1 rounded-md border bg-white/5 border-white/10 disabled:opacity-40 hover:bg-white/10 transition-colors"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};
