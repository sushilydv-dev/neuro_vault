import React, { useEffect, useState } from "react";
import AvatarPreview from "../AvatarPreview";
import { resolveAvatarUrl } from "../../utils/avatar";
import { API_BASE } from "../../utils/api";

const Connections = () => {
  const [connections, setConnections] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [previewUserId, setPreviewUserId] = useState(null);


  useEffect(() => {
    const fetchConnections = async () => {
      try {
        const response = await fetch(`${API_BASE}/connections`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            token: localStorage.getItem("token"),
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to fetch connections");
        }

        const result = await response.json();

        setConnections(result);
        setFiltered(result);
      } catch (error) {
        console.error("Error fetching connections:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchConnections();
  }, []);

  useEffect(() => {
    const filteredData = connections.filter((user) =>
      user.name.toLowerCase().includes(search.toLowerCase()),
    );
    setFiltered(filteredData);
  }, [search, connections]);

  return (
    <div className="text-white">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-[2rem] font-bold tracking-tight">
            Your Connections
          </h1>
          <p className="text-n-3 text-sm mt-1">
            People you share workspaces with
          </p>
        </div>

        <div className="relative flex items-center max-w-sm w-full">
          <div className="relative w-full group">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="absolute w-5 h-5 top-1/2 -translate-y-1/2 left-3 text-n-4 group-focus-within:text-white transition"
            >
              <path
                fillRule="evenodd"
                d="M10.5 3.75a6.75 6.75 0 1 0 0 13.5 6.75 6.75 0 0 0 0-13.5ZM2.25 10.5a8.25 8.25 0 1 1 14.59 5.28l4.69 4.69a.75.75 0 1 1-1.06 1.06l-4.69-4.69A8.25 8.25 0 0 1 2.25 10.5Z"
                clipRule="evenodd"
              />
            </svg>

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm placeholder:text-n-4 focus:outline-none focus:ring-2 focus:ring-white/20 transition"
              placeholder="Search connections..."
            />
          </div>
        </div>
      </div>

      <div className="relative overflow-hidden nv-bento nv-bento-rim">
        <div className="overflow-x-auto">
          <table className="nv-table">
            <thead className="nv-thead">
              <tr>
                <th className="px-6 py-4 w-16 font-bold">#</th>
                <th className="px-6 py-4 font-bold">Name</th>
                <th className="px-6 py-4 font-bold">Email</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan="3" className="text-center py-10 text-n-4">
                    Loading...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan="3" className="text-center py-10 text-n-4">
                    No connections found
                  </td>
                </tr>
              ) : (
                filtered.map((user, index) => (
                  <tr
                    key={user.id}
                    className="nv-tr"
                  >
                    <td className="nv-td nv-td-mono">
                      {index + 1}
                    </td>

                    <td className="nv-td font-medium text-white/90">
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => setPreviewUserId(user.id)}
                          className="shrink-0 rounded-xl overflow-hidden ring-1 ring-white/10 hover:ring-white/20 transition"
                          title="View profile photo"
                        >
                          <img
                            src={resolveAvatarUrl({
                              profilePicUrl: user.profilePicUrl,
                              seed: user.id ?? user.email ?? user.name,
                            })}
                            alt={user.name}
                            className="w-9 h-9 object-cover"
                          />
                        </button>
                        <span className="truncate">{user.name}</span>
                      </div>
                    </td>

                    <td className="nv-td text-white/70">{user.email}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      {previewUserId != null && (
        <AvatarPreview
          people={filtered.map((u) => ({
            id: u.id,
            name: u.name,
            email: u.email,
            profilePicUrl: u.profilePicUrl,
          }))}
          initialPersonId={previewUserId}
          onClose={() => setPreviewUserId(null)}
          title="Connections"
        />
      )}
    </div>
  );
};

export default Connections;
