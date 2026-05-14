import { API_BASE } from "./api";

export const DEFAULT_PRESET_COUNT = 9;

function hashString(str) {
  // small deterministic hash for stable preset choice
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export function pickPresetIndex(seed, presetCount = DEFAULT_PRESET_COUNT) {
  const s = seed == null ? "" : String(seed);
  const h = hashString(s);
  return (h % presetCount) + 1; // 1..presetCount
}

export function resolveAvatarUrl({
  profilePicUrl,
  seed,
  presetCount = DEFAULT_PRESET_COUNT,
} = {}) {
  if (profilePicUrl != null) {
    const raw = String(profilePicUrl).trim().replace(/^"+|"+$/g, "");
    if (
      raw.toLowerCase() === "default-avatar.png" ||
      raw.toLowerCase() === "/default-avatar.png" ||
      raw.toLowerCase() === "null"
    ) {
      const idx = pickPresetIndex(seed, presetCount);
      return `/profilepics/pp${idx}.jpg`;
    }

    if (
      raw.startsWith("http://") ||
      raw.startsWith("https://")
    ) {
      return raw;
    }
    // Presets are served by frontend public folder.
    if (raw.startsWith("/profilepics/")) {
      const legacy = raw.match(/^\/profilepics\/preset-(\d+)\.jpg$/i);
      if (legacy) {
        const n = Number(legacy[1]);
        const mapped = ((n - 1) % DEFAULT_PRESET_COUNT) + 1;
        return `/profilepics/pp${mapped}.jpg`;
      }
      return raw;
    }
    // Uploaded custom avatars are served by backend.
    return `${API_BASE}${raw.startsWith("/") ? "" : "/"}${raw}`;
  }

  const idx = pickPresetIndex(seed, presetCount);
  return `/profilepics/pp${idx}.jpg`;
}

