import React, { useMemo, useState } from "react";
import { resolveAvatarUrl } from "../utils/avatar";

export default function AvatarPreview({
  people,
  initialPersonId,
  onClose,
  title = "Profile photo",
}) {
  const byId = useMemo(() => {
    const map = new Map();
    (people || []).forEach((p) => map.set(p.id ?? p.user_id, p));
    return map;
  }, [people]);

  const initial = initialPersonId ?? (people?.[0]?.id ?? people?.[0]?.user_id);
  const [activeId, setActiveId] = useState(initial);

  const person = byId.get(activeId);
  const seed = person?.id ?? person?.user_id ?? person?.email ?? person?.name;
  const src = resolveAvatarUrl({
    profilePicUrl: person?.profilePicUrl,
    seed,
  });

  return (
    <div
      className="fixed inset-0 z-[120] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose?.();
      }}
    >
      <div className="w-full max-w-md nv-bento nv-bento-rim p-4 text-white relative">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3 right-3 text-white/50 hover:text-white text-lg"
          aria-label="Close"
        >
          ✕
        </button>

        <div className="px-1 pb-3 border-b border-white/10">
          <p className="text-[10px] uppercase tracking-wider text-white/35 font-bold">
            {title}
          </p>
          <p className="text-sm font-semibold text-white truncate">
            {person?.name || "—"}
          </p>
          {person?.email && (
            <p className="text-xs text-white/40 truncate">{person.email}</p>
          )}
        </div>

        <div className="flex items-center justify-center py-4">
          <img
            src={src}
            alt={person?.name || "Avatar"}
            className="w-64 h-64 rounded-2xl object-cover ring-1 ring-white/10 shadow-2xl"
          />
        </div>

        {(people?.length || 0) > 1 && (
          <div className="flex gap-2 overflow-x-auto pt-2 border-t border-white/10">
            {people.map((p) => {
              const pid = p.id ?? p.user_id;
              const pSeed = pid ?? p.email ?? p.name;
              const pSrc = resolveAvatarUrl({
                profilePicUrl: p.profilePicUrl,
                seed: pSeed,
              });
              const active = pid === activeId;
              return (
                <button
                  key={pid}
                  type="button"
                  onClick={() => setActiveId(pid)}
                  className={`shrink-0 rounded-xl overflow-hidden border transition ${
                    active
                      ? "border-blue-500/60"
                      : "border-white/10 hover:border-white/20"
                  }`}
                  title={p.name}
                >
                  <img
                    src={pSrc}
                    alt={p.name || "Avatar"}
                    className="w-12 h-12 object-cover"
                  />
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

