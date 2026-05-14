import React, { useState, useEffect } from "react";
import Button from "../Button";
import { useNavigate } from "react-router-dom";
import { Createworkspace } from "./Createworkspace";
import { API_BASE } from "../../utils/api";

export const Userworkspaces = () => {
  const [workspaces, setWorkspaces] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  const navigate = useNavigate();

  const isSearching = search.trim() !== "";

  const fetchWorkspaces = async () => {
    try {
      setLoading(true);

      const response = await fetch(`${API_BASE}/workspaces`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token: localStorage.getItem("token"),
          page,
          limit,
        }),
      });

      if (!response.ok) throw new Error("Failed to fetch");

      const result = await response.json();

      setWorkspaces(result.data);
      setFiltered(result.data);
      setTotalPages(result.totalPages || 1);

      localStorage.removeItem("spaceid");
    } catch (error) {
      console.error("Error fetching workspaces:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkspaces();
  }, [page, limit]);

  useEffect(() => {
    const filteredData = workspaces.filter((ws) =>
      ws.workspace_name.toLowerCase().includes(search.toLowerCase()),
    );
    setFiltered(filteredData);
  }, [search, workspaces]);

  useEffect(() => {
    setPage(1);
  }, [search]);

  const openworkspace = (id) => {
    navigate(`/dashboard/workspacearea/${id}/chatbot`);
    localStorage.setItem("spaceid", `${id}`);
  };

  return (
    <div className="text-white relative ">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-[2rem] font-bold tracking-tight">
            Your Workspaces
          </h1>
          <p className="text-n-3 text-sm mt-1">
            Manage and access your environments
          </p>
        </div>

        <div className="flex gap-2 w-full max-w-md">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white/[0.03] border border-white/5 rounded-xl px-4 py-2.5 text-sm placeholder:text-n-4 focus:outline-none focus:ring-2 focus:ring-white/10"
            placeholder="Search workspace..."
          />

          <Button
            white
            onClick={() => setShowModal(true)}
            className="text-xs px-4 py-2 rounded-lg border-white/5 hover:border-white/10 hover:bg-white/[0.06]"
          >
            Create
          </Button>
        </div>
      </div>

      <div className="flex justify-end mb-4">
        <select
          value={limit}
          onChange={(e) => {
            setLimit(Number(e.target.value));
            setPage(1);
          }}
          className="bg-white/[0.03] border border-white/5 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-white/10"
        >
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={30}>30</option>
        </select>
      </div>

      <div className="overflow-hidden nv-bento nv-bento-rim ">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-separate border-spacing-0">
            <thead>
              <tr className="border-b border-white/[0.05]">
                <th className="px-4 py-3 text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] w-12">
                  #
                </th>
                <th className="px-4 py-3 text-[10px] font-bold text-white/30 uppercase tracking-[0.2em]">
                  Workspace
                </th>
                <th className="px-4 py-3 text-[10px] font-bold text-white/30 uppercase tracking-[0.2em]">
                  Visibility
                </th>
                <th className="px-4 py-3 text-[10px] font-bold text-white/30 uppercase tracking-[0.2em]">
                  Role
                </th>
                <th className="px-4 py-3 text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] text-right">
                  Action
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-white/[0.02]">
              {loading ? (
                <tr>
                  <td colSpan="5" className="py-16 text-center">
                    <div className="inline-block w-5 h-5 border-2 border-blue-500/10 border-t-blue-500 rounded-full animate-spin"></div>
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan="5"
                    className="py-16 text-center text-white/20 text-[11px] font-medium uppercase tracking-widest"
                  >
                    No workspaces found
                  </td>
                </tr>
              ) : (
                filtered.map((item, index) => (
                  <tr
                    key={index}
                    className="group hover:bg-white/[0.03] transition-colors duration-75"
                  >
                    {/* Index */}
                    <td className="px-4 py-3 text-[12px] text-white/20 font-mono">
                      {String(
                        isSearching
                          ? index + 1
                          : (page - 1) * limit + index + 1,
                      ).padStart(2, "0")}
                    </td>

                    {/* Workspace Name */}
                    <td className="px-4 py-3">
                      <span className="text-[13px] font-semibold text-white/90 group-hover:text-blue-400 transition-colors">
                        {item.workspace_name}
                      </span>
                    </td>

                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                          item.visibility === "private"
                            ? "bg-violet-500 text-white"
                            : "bg-emerald-500 text-white"
                        }`}
                      >
                        {item.visibility}
                      </span>
                    </td>

                    <td className="px-4 py-3">
                      <div
                        className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                          item.role === "admin"
                            ? "bg-indigo-600 text-white"
                            : "bg-slate-700 text-slate-300"
                        }`}
                      >
                        {item.role}
                      </div>
                    </td>

                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => openworkspace(item.workspace_id)}
                        className="inline-flex items-center gap-1 text-[12px] font-bold text-blue-500 hover:text-blue-400 transition-colors group/btn"
                      >
                        <span>Open</span>
                        <svg
                          className="w-4 h-4 transform transition-transform duration-200 ease-out group-hover/btn:translate-x-1"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2.5}
                            d="M13 7l5 5m0 0l-5 5m5-5H6"
                          />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {!isSearching && (
        <div className="flex justify-center items-center gap-2 mt-6 flex-wrap ">
          <button
            disabled={page === 1}
            onClick={() => setPage((prev) => prev - 1)}
            className="px-3 py-1 rounded-md border bg-white/[0.03] border-white/5 disabled:opacity-40 hover:bg-white/[0.06] transition-colors"
          >
            Prev
          </button>

          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={`px-3 py-1 rounded-full text-sm border ${
                page === i + 1
                  ? "bg-white text-black"
                  : "bg-white/[0.03] border-white/5 text-white"
              }`}
            >
              {i + 1}
            </button>
          ))}

          <button
            disabled={page === totalPages}
            onClick={() => setPage((prev) => prev + 1)}
            className="px-3 py-1 rounded-md border bg-white/[0.03] border-white/5 disabled:opacity-40 hover:bg-white/[0.06] transition-colors"
          >
            Next
          </button>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="relative w-full max-w-2xl">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-3 right-3 text-white/60 hover:text-white text-xl z-10"
            >
              ✕
            </button>

            <div className="rounded-2xl border border-white/5 shadow-2xl">
              <Createworkspace />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Userworkspaces;
