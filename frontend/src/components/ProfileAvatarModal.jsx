import React, { useState } from "react";
import { DEFAULT_PRESET_COUNT } from "../utils/avatar";
import { API_BASE } from "../utils/api";

export function ProfileAvatarModal({ onClose, onSaved }) {
  const presets = Array.from({ length: DEFAULT_PRESET_COUNT }, (_, i) => ({
    id: i + 1,
    url: `/profilepics/pp${i + 1}.jpg`,
  }));
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const selectPreset = async (profilePicUrl) => {
    setError("");
    setBusy(true);
    try {
      const res = await fetch(`${API_BASE}/profile/preset-pics/select`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          profilePicUrl,
          token: localStorage.getItem("token"),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Could not update");
      onSaved?.(data.profilePicUrl);
      onClose();
    } catch (e) {
      setError(e.message || "Update failed");
    } finally {
      setBusy(false);
    }
  };

  const onFile = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setError("");
    setBusy(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("token", localStorage.getItem("token"));
      const res = await fetch(`${API_BASE}/profile/avatar`, {
        method: "POST",
        body: fd,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Upload failed");
      onSaved?.(data.profilePicUrl);
      onClose();
    } catch (err) {
      setError(err.message || "Upload failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="w-full max-w-md nv-bento nv-bento-rim p-5 text-white relative max-h-[90vh] overflow-y-auto">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3 right-3 text-white/50 hover:text-white text-lg"
          aria-label="Close"
        >
          ✕
        </button>
        <h2 className="text-lg font-semibold mb-1">Profile photo</h2>
        <p className="text-xs text-white/45 mb-4">
          Choose a preset from the gallery or upload your own image. You can
          change this anytime.
        </p>

        {error && (
          <p className="text-xs text-rose-400 mb-3 border border-rose-500/30 rounded-lg px-3 py-2">
            {error}
          </p>
        )}

        <p className="text-[10px] uppercase tracking-wider text-white/35 font-bold mb-2">
          Preset avatars
        </p>
        <div className="grid grid-cols-4 gap-2 mb-6">
          {presets.map((p) => (
            <button
              key={p.id}
              type="button"
              disabled={busy}
              onClick={() => selectPreset(p.url)}
              className="aspect-square rounded-xl overflow-hidden border border-white/10 hover:border-blue-500/50 transition focus:outline-none focus:ring-2 focus:ring-blue-500/40 disabled:opacity-40"
            >
              <img src={p.url} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>

        <p className="text-[10px] uppercase tracking-wider text-white/35 font-bold mb-2">
          Custom upload
        </p>
        <label className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-white/15 bg-white/[0.03] px-4 py-6 cursor-pointer hover:bg-white/[0.05] transition">
          <input
            type="file"
            accept="image/jpeg,image/png,image/gif,image/webp"
            className="hidden"
            disabled={busy}
            onChange={onFile}
          />
          <span className="text-sm text-white/80">
            {busy ? "Please wait…" : "Click to upload (max 3 MB)"}
          </span>
          <span className="text-[11px] text-white/35">JPEG, PNG, GIF, WebP</span>
        </label>

        <button
          type="button"
          onClick={onClose}
          className="mt-4 w-full py-2.5 rounded-xl border border-white/10 text-sm text-white/70 hover:bg-white/5"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
