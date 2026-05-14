import React, { useState } from "react";
import { API_BASE } from "../../utils/api";

export const Createworkspace = () => {
  const [name, setName] = useState("");
  const [workspaceUsername, setWorkspaceUsername] = useState("");
  const [visibility, setVisibility] = useState("public");
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    if (!name.trim()) {
      return alert("Workspace name is required");
    }
    if (!workspaceUsername.trim()) {
      return alert("Workspace username is required");
    }

    try {
      setLoading(true);

      const res = await fetch(`${API_BASE}/createworkspace`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          workspace_name: name,
          workspace_username: workspaceUsername,
          type: visibility,
          token: localStorage.getItem("token"),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      alert(data.message || "Workspace created!");
      setName("");
      setWorkspaceUsername("");
      setVisibility("public");
    } catch (err) {
      console.error(err);
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative  ">
      <div className="nv-bento nv-bento-rim p-5">
        <h2 className="text-lg font-semibold text-white mb-1">
          Create Workspace
        </h2>

        <p className="text-xs text-white/60 mb-4">
          Organize your documents and collaborate
        </p>

        <input
          type="text"
          placeholder="Workspace display name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-3 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-white text-sm outline-none focus:border-white/20 focus:bg-white/[0.05] transition mb-4 placeholder:text-white/30"
        />
        <input
          type="text"
          placeholder="Unique username (e.g. acme-docs)"
          value={workspaceUsername}
          onChange={(e) => setWorkspaceUsername(e.target.value)}
          className="w-full px-3 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-white text-sm outline-none focus:border-white/20 focus:bg-white/[0.05] transition mb-4 placeholder:text-white/30"
        />

        <p className="text-[11px] text-white/40 mb-2">Visibility</p>
        <div className="flex gap-4 mb-6">
          <label className="flex items-center gap-2 text-sm text-white/80 cursor-pointer">
            <input
              type="radio"
              name="ws-vis"
              checked={visibility === "public"}
              onChange={() => setVisibility("public")}
              className="accent-[#2D7FF9]"
            />
            Public — anyone can join from search
          </label>
          <label className="flex items-center gap-2 text-sm text-white/80 cursor-pointer">
            <input
              type="radio"
              name="ws-vis"
              checked={visibility === "private"}
              onChange={() => setVisibility("private")}
              className="accent-[#2D7FF9]"
            />
            Private — join requires admin approval
          </label>
        </div>

        <button
          onClick={handleCreate}
          disabled={loading}
          className="w-[110px] py-2.5 rounded-xl bg-[#2D7FF9] text-white text-sm font-semibold hover:bg-[#2D7FF9]/90 transition disabled:opacity-50 shadow-[0_0_0_1px_rgba(45,127,249,0.35),0_12px_30px_rgba(45,127,249,0.18)] "
        >
          {loading ? "Creating..." : "Create"}
        </button>
      </div>
    </div>
  );
};
